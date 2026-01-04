export type InterviewPhase = 
  | 'opening'
  | 'behavioral_1'
  | 'behavioral_2'
  | 'legal_logic'
  | 'motivation'
  | 'closing'
  | 'completed';

export interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
  phase?: InterviewPhase;
}

export interface StartInterviewResponse {
  session_id: string;
  message: string;
  phase: InterviewPhase;
}

export interface ChatResponse {
  message: string;
  phase: InterviewPhase;
  is_follow_up: boolean;
  is_complete: boolean;
}

export interface FeedbackCriterion {
  name: string;
  score: number;
  feedback: string;
}

export interface InterviewReport {
  overall_score: number;
  summary: string;
  criteria: FeedbackCriterion[];
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

export interface ReportResponse {
  report: InterviewReport;
}

export type AppView = 'welcome' | 'interview' | 'report' | 'history' | 'saved-report';

export interface SavedReport {
  id: string;
  candidate_name: string | null;
  created_at: string;
  report: InterviewReport;
  messages: Message[];
}

export interface SavedReportsResponse {
  reports: SavedReport[];
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  username?: string;
}

export type AuthView = 'login' | 'register';

