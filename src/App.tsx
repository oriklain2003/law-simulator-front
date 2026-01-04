import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { ReportView } from './components/ReportView';
import { ReportsHistory } from './components/ReportsHistory';
import { SavedReportView } from './components/SavedReportView';
import { AuthPage } from './components/AuthPage';
import { 
  startInterview, 
  sendMessage, 
  sendAudioMessage, 
  getReport, 
  deleteSession,
  login as apiLogin,
  register as apiRegister,
  verifyToken,
  logout as apiLogout,
  getStoredUsername
} from './api';
import type { AppView, Message, InterviewPhase, InterviewReport, SavedReport } from './types';

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // App state
  const [view, setView] = useState<AppView>('welcome');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('opening');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedSavedReport, setSelectedSavedReport] = useState<SavedReport | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      setIsAuthenticated(result.valid);
      if (result.valid && result.username) {
        setUsername(result.username);
      } else {
        setUsername(getStoredUsername());
      }
    };
    checkAuth();
  }, []);

  // Auth handlers
  const handleLogin = useCallback(async (user: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await apiLogin(user, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUsername(response.username || user);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'ההתחברות נכשלה');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (user: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await apiRegister(user, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUsername(response.username || user);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'ההרשמה נכשלה');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await apiLogout();
    setIsAuthenticated(false);
    setUsername(null);
    // Reset app state
    setSessionId(null);
    setMessages([]);
    setCurrentPhase('opening');
    setIsComplete(false);
    setReport(null);
    setSelectedSavedReport(null);
    setView('welcome');
  }, []);

  const handleStartInterview = useCallback(async (name: string, cv?: string) => {
    setIsLoading(true);
    try {
      const response = await startInterview(name, cv);
      setSessionId(response.session_id);
      setMessages([
        {
          role: 'interviewer',
          content: response.message,
          phase: response.phase,
        },
      ]);
      setCurrentPhase(response.phase);
      setView('interview');
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('שגיאה בהתחלת הראיון. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string, audioBlob?: Blob) => {
    if (!sessionId) return;

    // Add user message immediately
    const userMessage: Message = {
      role: 'candidate',
      content: message || '🎤 הודעה קולית',
      phase: currentPhase,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response;
      
      if (audioBlob) {
        // Send audio with optional text
        response = await sendAudioMessage(sessionId, audioBlob, message || undefined);
      } else {
        // Send text only
        response = await sendMessage(sessionId, message);
      }
      
      // Add interviewer response
      const interviewerMessage: Message = {
        role: 'interviewer',
        content: response.message,
        phase: response.phase,
      };
      setMessages((prev) => [...prev, interviewerMessage]);
      setCurrentPhase(response.phase);
      setIsComplete(response.is_complete);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
      alert('שגיאה בשליחת ההודעה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, currentPhase]);

  const handleViewReport = useCallback(async () => {
    if (!sessionId) return;

    setReportLoading(true);
    setView('report');

    try {
      const response = await getReport(sessionId);
      setReport(response.report);
    } catch (error) {
      console.error('Failed to get report:', error);
      alert('שגיאה בטעינת הדוח. אנא נסה שוב.');
      setView('interview');
    } finally {
      setReportLoading(false);
    }
  }, [sessionId]);

  const handleRestart = useCallback(async () => {
    // Clean up old session
    if (sessionId) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }

    // Reset state
    setSessionId(null);
    setMessages([]);
    setCurrentPhase('opening');
    setIsComplete(false);
    setReport(null);
    setSelectedSavedReport(null);
    setView('welcome');
  }, [sessionId]);

  const handleViewHistory = useCallback(() => {
    setView('history');
  }, []);

  const handleViewSavedReport = useCallback((savedReport: SavedReport) => {
    setSelectedSavedReport(savedReport);
    setView('saved-report');
  }, []);

  const handleBackFromHistory = useCallback(() => {
    setView('welcome');
  }, []);

  const handleBackFromSavedReport = useCallback(() => {
    setSelectedSavedReport(null);
    setView('history');
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="marble-bg" />
        <div className="marble-veins" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'welcome' && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen min-h-[-webkit-fill-available]"
        >
          <WelcomeScreen 
            onStart={handleStartInterview} 
            onViewHistory={handleViewHistory}
            isLoading={isLoading}
            username={username}
            onLogout={handleLogout}
          />
        </motion.div>
      )}

      {view === 'interview' && (
        <motion.div
          key="interview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChatInterface
            messages={messages}
            currentPhase={currentPhase}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isComplete={isComplete}
            onViewReport={handleViewReport}
          />
        </motion.div>
      )}

      {view === 'report' && (
        <motion.div
          key="report"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReportView
            report={report!}
            onRestart={handleRestart}
            isLoading={reportLoading}
          />
        </motion.div>
      )}

      {view === 'history' && (
        <motion.div
          key="history"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReportsHistory
            onBack={handleBackFromHistory}
            onViewReport={handleViewSavedReport}
          />
        </motion.div>
      )}

      {view === 'saved-report' && selectedSavedReport && (
        <motion.div
          key="saved-report"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SavedReportView
            savedReport={selectedSavedReport}
            onBack={handleBackFromSavedReport}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
