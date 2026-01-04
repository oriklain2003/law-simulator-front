import type { StartInterviewResponse, ChatResponse, ReportResponse, SavedReportsResponse, SavedReport, AuthResponse, VerifyTokenResponse } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function storeAuth(token: string, username: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

// ============================================
// AUTH API FUNCTIONS
// ============================================

export async function register(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'ההרשמה נכשלה');
  }

  const data = await response.json();
  
  if (data.token && data.username) {
    storeAuth(data.token, data.username);
  }
  
  return data;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'ההתחברות נכשלה');
  }

  const data = await response.json();
  
  if (data.token && data.username) {
    storeAuth(data.token, data.username);
  }
  
  return data;
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  const token = getStoredToken();
  
  if (!token) {
    return { valid: false };
  }

  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      clearAuth();
      return { valid: false };
    }

    const data = await response.json();
    
    if (!data.valid) {
      clearAuth();
    }
    
    return data;
  } catch {
    clearAuth();
    return { valid: false };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } finally {
    clearAuth();
  }
}

export async function startInterview(candidateName?: string, cvText?: string): Promise<StartInterviewResponse> {
  const response = await fetch(`${API_BASE}/interview/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      candidate_name: candidateName || null,
      cv_text: cvText || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start interview');
  }

  return response.json();
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/interview/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function sendAudioMessage(sessionId: string, audioBlob: Blob, textMessage?: string): Promise<ChatResponse> {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('audio', audioBlob, 'recording.webm');
  if (textMessage) {
    formData.append('message', textMessage);
  }

  const response = await fetch(`${API_BASE}/interview/chat-audio`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send audio message');
  }

  return response.json();
}

export async function getReport(sessionId: string): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE}/interview/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get report');
  }

  return response.json();
}

export async function deleteSession(sessionId: string): Promise<void> {
  await fetch(`${API_BASE}/interview/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function getReportsHistory(): Promise<SavedReportsResponse> {
  const response = await fetch(`${API_BASE}/reports/history`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get reports history');
  }

  return response.json();
}

export async function getSavedReport(reportId: string): Promise<SavedReport> {
  const response = await fetch(`${API_BASE}/reports/${reportId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get saved report');
  }

  return response.json();
}

export async function deleteSavedReport(reportId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/reports/${reportId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete saved report');
  }
}
