import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Star,
  Target,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { InterviewReport } from '../types';

interface ReportViewProps {
  report: InterviewReport;
  onRestart: () => void;
  isLoading: boolean;
}

const criteriaIcons: Record<string, React.ReactNode> = {
  'ביסוס': <Target className="w-5 h-5" />,
  'קוהרנטיות': <MessageSquare className="w-5 h-5" />,
  'רפלקטיביות': <Sparkles className="w-5 h-5" />,
  'מקצועיות': <Award className="w-5 h-5" />,
};

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
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
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

export function ReportView({ report, onRestart, isLoading }: ReportViewProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[-webkit-fill-available] flex items-center justify-center relative">
        <div className="bg-decoration bg-decoration-1" />
        <div className="bg-decoration bg-decoration-2" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 sm:p-10 text-center relative z-10"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">מכין את דוח המשוב</h2>
          <p className="text-gray-500">מנתח את הביצועים שלך...</p>
        </motion.div>
      </div>
    );
  }

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
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-800 mb-2">
            דוח משוב
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">הנה הניתוח המפורט של הביצועים שלך בראיון</p>
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
          className="glass-card p-5 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">המלצה לשיפור</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{report.recommendation}</p>
        </motion.div>

        {/* Restart button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pb-safe-bottom"
        >
          <button
            onClick={onRestart}
            className="glass-button px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center gap-3 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            התחל ראיון חדש
          </button>
        </motion.div>
      </div>
    </div>
  );
}
