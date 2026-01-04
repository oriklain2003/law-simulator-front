import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Star,
  Target,
  MessageSquare,
  Sparkles,
  User,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import type { SavedReport, Message } from '../types';

interface SavedReportViewProps {
  savedReport: SavedReport;
  onBack: () => void;
}

const criteriaIcons: Record<string, React.ReactNode> = {
  'ביסוס': <Target className="w-5 h-5" />,
  'קוהרנטיות': <MessageSquare className="w-5 h-5" />,
  'רפלקטיביות': <Sparkles className="w-5 h-5" />,
  'מקצועיות': <Award className="w-5 h-5" />,
};

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

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="80"
          cy="80"
          r="45"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-center"
        >
          <span className="text-3xl sm:text-4xl font-bold text-gray-800">{score}</span>
          <span className="text-base sm:text-lg text-gray-500">/100</span>
        </motion.div>
      </div>
    </div>
  );
}

function CriterionCard({ name, score, feedback }: { name: string; score: number; feedback: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-500';
    if (score >= 3) return 'text-amber-500';
    if (score >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            {criteriaIcons[name] || <Star className="w-5 h-5" />}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{name}</h3>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                star <= score ? getScoreColor(score) : 'text-gray-200'
              } ${star <= score ? 'fill-current' : ''}`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{feedback}</p>
    </motion.div>
  );
}

function ConversationSection({ messages }: { messages: Message[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="glass-card p-5 sm:p-6 mb-6 sm:mb-8"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-600">
            שיחה מלאה ({messages.length} הודעות)
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 max-h-[500px] overflow-y-auto pr-2"
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'interviewer' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-3 ${
                  msg.role === 'interviewer' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'interviewer'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {msg.role === 'interviewer' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    msg.role === 'interviewer'
                      ? 'bg-gray-100 text-gray-700 rounded-tr-sm'
                      : 'bg-blue-500 text-white rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.phase && (
                    <span className={`text-xs mt-1 block ${
                      msg.role === 'interviewer' ? 'text-gray-400' : 'text-blue-200'
                    }`}>
                      שלב: {msg.phase}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SavedReportView({ savedReport, onBack }: SavedReportViewProps) {
  const { report, messages, candidate_name, created_at } = savedReport;

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4 relative">
      {/* Background decoration */}
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה להיסטוריה
          </button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-800 mb-2">
            דוח משוב
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            {candidate_name && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {candidate_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(created_at)}
            </span>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 sm:p-8 mb-4 sm:mb-6 flex flex-col items-center"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">ציון כללי</h2>
          <ScoreCircle score={report.overall_score} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-600 text-center mt-6 max-w-2xl leading-relaxed text-sm sm:text-base"
          >
            {report.summary}
          </motion.p>
        </motion.div>

        {/* Criteria Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6"
        >
          {report.criteria.map((criterion, index) => (
            <motion.div
              key={criterion.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <CriterionCard {...criterion} />
            </motion.div>
          ))}
        </motion.div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-green-600">נקודות חוזק</h3>
            </div>
            <ul className="space-y-3">
              {report.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-2 text-gray-600 text-sm sm:text-base"
                >
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Improvements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-orange-600">נקודות לשיפור</h3>
            </div>
            <ul className="space-y-3">
              {report.improvements.map((improvement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-2 text-gray-600 text-sm sm:text-base"
                >
                  <Target className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{improvement}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-5 sm:p-6 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">המלצה לשיפור</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{report.recommendation}</p>
        </motion.div>

        {/* Full Conversation */}
        <ConversationSection messages={messages} />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pb-safe-bottom"
        >
          <button
            onClick={onBack}
            className="glass-button px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center gap-3 mx-auto"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה להיסטוריה
          </button>
        </motion.div>
      </div>
    </div>
  );
}

