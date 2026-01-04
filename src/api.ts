import type { StartInterviewResponse, ChatResponse, ReportResponse } from './types';

const API_BASE = '/api';

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
