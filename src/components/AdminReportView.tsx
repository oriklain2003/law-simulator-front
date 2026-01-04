import { motion } from 'framer-motion';
import { 
  ChevronRight,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  Shield
} from 'lucide-react';
import { 
  LiquidGlassView, 
  LiquidGlassButton,
  LiquidBlob,
  LiquidGlassFilters 
} from './LiquidGlass';
import type { AdminSavedReport } from '../types';

interface AdminReportViewProps {
  report: AdminSavedReport;
  onBack: () => void;
}

export function AdminReportView({ report, onBack }: AdminReportViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const getCriterionScoreColor = (score: number) => {
    if (score >= 4) return '#22c55e';
    if (score >= 3) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen min-h-[-webkit-fill-available] p-4 sm:p-6 relative overflow-hidden">
      {/* SVG Filters */}
      <LiquidGlassFilters />
      
      {/* Marble Background */}
      <div className="marble-bg" />
      <div className="marble-veins" />
      
      {/* Animated liquid blobs */}
      <LiquidBlob 
        size={500} 
        color="rgba(255, 255, 255, 0.6)" 
        style={{ position: 'fixed', top: '-10%', right: '-5%' }} 
      />
      <LiquidBlob 
        size={400} 
        color="rgba(248, 250, 252, 0.5)" 
        style={{ position: 'fixed', bottom: '-15%', left: '-10%' }} 
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LiquidGlassView
            effect="regular"
            radius={24}
            style={{ 
              padding: '20px 28px',
              marginBottom: '24px'
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800" style={{ letterSpacing: '-0.02em' }}>
                    צפייה בדוח
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {report.username}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(report.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <LiquidGlassButton
                variant="ghost"
                size="sm"
                onClick={onBack}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                חזרה לרשימה
              </LiquidGlassButton>
            </div>
          </LiquidGlassView>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="prominent"
            radius={24}
            style={{ padding: '32px', textAlign: 'center' }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star 
                className="w-8 h-8" 
                style={{ color: getScoreColor(report.report.overall_score) }}
                fill={getScoreColor(report.report.overall_score)}
              />
              <span 
                className="text-5xl font-bold"
                style={{ color: getScoreColor(report.report.overall_score) }}
              >
                {report.report.overall_score}
              </span>
              <span className="text-2xl text-gray-400">/100</span>
            </div>
            <p className="text-gray-600 text-lg" dir="rtl">
              {report.candidate_name ? `מועמד: ${report.candidate_name}` : 'שם מועמד לא צוין'}
            </p>
          </LiquidGlassView>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="regular"
            radius={20}
            style={{ padding: '24px' }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3" dir="rtl">סיכום</h2>
            <p className="text-gray-600 leading-relaxed" dir="rtl">
              {report.report.summary}
            </p>
          </LiquidGlassView>
        </motion.div>

        {/* Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="regular"
            radius={20}
            style={{ padding: '24px' }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4" dir="rtl">קריטריונים</h2>
            <div className="space-y-4">
              {report.report.criteria.map((criterion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl bg-white/40"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{criterion.name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4"
                          style={{ 
                            color: star <= criterion.score 
                              ? getCriterionScoreColor(criterion.score) 
                              : '#e5e7eb'
                          }}
                          fill={star <= criterion.score 
                            ? getCriterionScoreColor(criterion.score) 
                            : '#e5e7eb'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{criterion.feedback}</p>
                </motion.div>
              ))}
            </div>
          </LiquidGlassView>
        </motion.div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LiquidGlassView
              effect="regular"
              radius={20}
              style={{ padding: '24px', height: '100%' }}
            >
              <div className="flex items-center gap-2 mb-4" dir="rtl">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-gray-800">חוזקות</h2>
              </div>
              <ul className="space-y-2" dir="rtl">
                {report.report.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </LiquidGlassView>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LiquidGlassView
              effect="regular"
              radius={20}
              style={{ padding: '24px', height: '100%' }}
            >
              <div className="flex items-center gap-2 mb-4" dir="rtl">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-800">נקודות לשיפור</h2>
              </div>
              <ul className="space-y-2" dir="rtl">
                {report.report.improvements.map((improvement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-amber-500 mt-1">•</span>
                    {improvement}
                  </motion.li>
                ))}
              </ul>
            </LiquidGlassView>
          </motion.div>
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="prominent"
            radius={20}
            style={{ padding: '24px' }}
          >
            <div className="flex items-center gap-2 mb-3" dir="rtl">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">המלצה</h2>
            </div>
            <p className="text-gray-700 font-medium" dir="rtl">
              {report.report.recommendation}
            </p>
          </LiquidGlassView>
        </motion.div>

        {/* Conversation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="regular"
            radius={20}
            style={{ padding: '24px' }}
          >
            <div className="flex items-center gap-2 mb-4" dir="rtl">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-800">היסטוריית שיחה</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {report.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.02 }}
                  className={`p-3 rounded-xl ${
                    message.role === 'interviewer' 
                      ? 'bg-gray-100/60 mr-8' 
                      : 'bg-blue-50/60 ml-8'
                  }`}
                  dir="rtl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      {message.role === 'interviewer' ? 'מראיין' : 'מועמד'}
                    </span>
                    {message.phase && (
                      <span className="text-xs text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded">
                        {message.phase}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{message.content}</p>
                </motion.div>
              ))}
            </div>
          </LiquidGlassView>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-center"
        >
          <LiquidGlassButton
            variant="primary"
            size="lg"
            onClick={onBack}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            חזרה לפאנל ניהול
          </LiquidGlassButton>
        </motion.div>
      </div>
    </div>
  );
}

