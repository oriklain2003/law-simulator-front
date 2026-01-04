import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  FileText, 
  ArrowRight, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Bot,
  Award,
  AlertCircle
} from 'lucide-react';
import type { SavedReport, Message } from '../types';
import { getReportsHistory, deleteSavedReport } from '../api';

interface ReportsHistoryProps {
  onBack: () => void;
  onViewReport: (report: SavedReport) => void;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function ConversationPreview({ messages }: { messages: Message[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewMessages = isExpanded ? messages : messages.slice(0, 4);

  return (
    <div className="mt-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
      >
        <MessageSquare className="w-4 h-4" />
        <span>שיחה מלאה ({messages.length} הודעות)</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {(isExpanded || messages.length <= 4) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 max-h-96 overflow-y-auto pr-2"
          >
            {previewMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-sm ${
                  msg.role === 'interviewer' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'interviewer'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {msg.role === 'interviewer' ? (
                    <Bot className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.role === 'interviewer'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-50 text-blue-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {!isExpanded && messages.length > 4 && (
              <p className="text-center text-gray-400 text-xs py-2">
                לחץ להצגת כל השיחה...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportCard({ 
  report, 
  onView, 
  onDelete 
}: { 
  report: SavedReport; 
  onView: () => void;
  onDelete: () => void;
}) {
  const [showConversation, setShowConversation] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {report.candidate_name || 'ראיון ללא שם'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-bold ${getScoreColor(report.report.overall_score)}`}>
            {report.report.overall_score}
          </div>
          <span className="text-gray-400 text-sm">/100</span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {report.report.summary}
      </p>

      {/* Quick stats */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <MessageSquare className="w-4 h-4" />
          <span>{report.messages.length} הודעות</span>
        </div>
        <div className="flex items-center gap-1 text-green-500">
          <Award className="w-4 h-4" />
          <span>{report.report.strengths.length} חוזקות</span>
        </div>
        <div className="flex items-center gap-1 text-orange-500">
          <AlertCircle className="w-4 h-4" />
          <span>{report.report.improvements.length} לשיפור</span>
        </div>
      </div>

      {/* Toggle conversation */}
      <button
        onClick={() => setShowConversation(!showConversation)}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 mb-4"
      >
        {showConversation ? (
          <>
            <ChevronUp className="w-4 h-4" />
            הסתר שיחה
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            הצג שיחה מלאה
          </>
        )}
      </button>

      <AnimatePresence>
        {showConversation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4"
          >
            <ConversationPreview messages={report.messages} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onDelete}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          מחק
        </button>
        <button
          onClick={onView}
          className="glass-button px-4 py-2 text-sm flex items-center gap-2"
        >
          צפה בדוח מלא
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function ReportsHistory({ onBack, onViewReport }: ReportsHistoryProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getReportsHistory();
      setReports(response.reports);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('שגיאה בטעינת הדוחות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק דוח זה?')) return;
    
    try {
      await deleteSavedReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('שגיאה במחיקת הדוח');
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4 relative">
      {/* Background decoration */}
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-800">
            היסטוריית דוחות
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 sm:p-10 text-center"
          >
            <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">טוען דוחות...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 sm:p-10 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadReports}
              className="glass-button px-4 py-2 mt-4"
            >
              נסה שוב
            </button>
          </motion.div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 sm:p-10 text-center"
          >
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              אין דוחות שמורים
            </h2>
            <p className="text-gray-500 mb-6">
              הדוחות יישמרו אוטומטית לאחר סיום ראיון
            </p>
            <button
              onClick={onBack}
              className="glass-button px-6 py-3"
            >
              התחל ראיון חדש
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm mb-4">
              מציג את {reports.length} הדוחות האחרונים
            </p>
            <AnimatePresence>
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ReportCard
                    report={report}
                    onView={() => onViewReport(report)}
                    onDelete={() => handleDelete(report.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

