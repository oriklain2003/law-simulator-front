import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { ReportView } from './components/ReportView';
import { startInterview, sendMessage, sendAudioMessage, getReport, deleteSession } from './api';
import type { AppView, Message, InterviewPhase, InterviewReport } from './types';

function App() {
  const [view, setView] = useState<AppView>('welcome');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('opening');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

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
    setView('welcome');
  }, [sessionId]);

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
          <WelcomeScreen onStart={handleStartInterview} isLoading={isLoading} />
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
    </AnimatePresence>
  );
}

export default App;
