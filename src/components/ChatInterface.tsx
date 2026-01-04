import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Briefcase, Loader2, Mic, Square, X } from 'lucide-react';
import type { Message, InterviewPhase } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  currentPhase: InterviewPhase;
  onSendMessage: (message: string, audioBlob?: Blob) => void;
  isLoading: boolean;
  isComplete: boolean;
  onViewReport: () => void;
}

const phaseLabels: Record<InterviewPhase, string> = {
  opening: 'פתיחה',
  behavioral_1: 'שאלה התנהגותית',
  behavioral_2: 'שאלה התנהגותית',
  legal_logic: 'חשיבה משפטית',
  motivation: 'מוטיבציה',
  closing: 'סיום',
  completed: 'הראיון הסתיים',
};

const phaseProgress: Record<InterviewPhase, number> = {
  opening: 1,
  behavioral_1: 2,
  behavioral_2: 3,
  legal_logic: 4,
  motivation: 5,
  closing: 6,
  completed: 6,
};

export function ChatInterface({
  messages,
  currentPhase,
  onSendMessage,
  isLoading,
  isComplete,
  onViewReport,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use compatible audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/wav';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('לא ניתן להפעיל את המיקרופון. אנא בדוק את ההרשאות.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || audioBlob) && !isLoading && !isComplete) {
      onSendMessage(input.trim(), audioBlob || undefined);
      setInput('');
      setAudioBlob(null);
      setRecordingTime(0);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Background decoration */}
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-3 mt-3 p-3 sm:p-4 flex items-center justify-between relative z-10 flex-shrink-0 safe-area-top"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">ראיון התמחות</h1>
            <p className="text-xs sm:text-sm text-gray-500">{phaseLabels[currentPhase]}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            שאלה {phaseProgress[currentPhase]} מתוך 6
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  step <= phaseProgress[currentPhase]
                    ? 'bg-gray-800'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.header>

      {/* Messages area - scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 relative z-10 overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === 'candidate' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'interviewer'
                      ? 'bg-gradient-to-br from-gray-700 to-gray-900 shadow-md'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  }`}
                >
                  {message.role === 'interviewer' ? (
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                    message.role === 'interviewer'
                      ? 'message-interviewer rounded-tr-sm'
                      : 'message-candidate rounded-tl-sm'
                  }`}
                >
                  <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                    message.role === 'interviewer' ? 'text-gray-700' : 'text-white'
                  }`}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 sm:gap-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="message-interviewer p-3 sm:p-4 rounded-2xl rounded-tr-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 animate-spin" />
                  <span className="text-sm text-gray-500">המראיין חושב...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-3 mb-3 p-3 sm:p-4 relative z-10 flex-shrink-0 safe-area-bottom"
      >
        {isComplete ? (
          <div className="text-center py-2">
            <p className="text-gray-600 mb-3 text-sm sm:text-base">הראיון הסתיים! לחץ/י לצפייה בדוח המשוב</p>
            <button
              onClick={onViewReport}
              className="glass-button px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold"
            >
              צפה בדוח המשוב
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Audio recording indicator */}
            {(isRecording || audioBlob) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between bg-red-50 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  {isRecording && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                  <span className="text-sm text-gray-700">
                    {isRecording ? `מקליט... ${formatTime(recordingTime)}` : `הקלטה מוכנה (${formatTime(recordingTime)})`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="הקלד/י את תשובתך..."
                disabled={isLoading || isRecording}
                className="glass-input flex-1 px-3 sm:px-4 py-2.5 sm:py-3 resize-none min-h-[44px] max-h-[120px] text-sm sm:text-base"
                dir="rtl"
                rows={1}
              />
              
              {/* Recording button */}
              {!audioBlob && (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`p-2.5 sm:p-3 flex-shrink-0 rounded-xl transition-all ${
                    isRecording 
                      ? 'record-button recording' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
              )}
              
              <button
                type="submit"
                disabled={(!input.trim() && !audioBlob) || isLoading || isRecording}
                className="glass-button p-2.5 sm:p-3 flex-shrink-0"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
