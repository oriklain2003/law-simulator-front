import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  FileText, 
  User, 
  Calendar, 
  Search,
  Eye,
  Star
} from 'lucide-react';
import { 
  LiquidGlassView, 
  LiquidGlassButton,
  LiquidGlassInput,
  LiquidBlob,
  LiquidGlassFilters 
} from './LiquidGlass';
import { getAdminReports } from '../api';
import type { AdminSavedReport } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewReport: (report: AdminSavedReport) => void;
}

export function AdminDashboard({ onLogout, onViewReport }: AdminDashboardProps) {
  const [reports, setReports] = useState<AdminSavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminReports();
      setReports(response.reports);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const query = searchQuery.toLowerCase();
    return (
      report.username.toLowerCase().includes(query) ||
      (report.candidate_name?.toLowerCase().includes(query) ?? false)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
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
      <LiquidBlob 
        size={250} 
        color="rgba(255, 255, 255, 0.4)" 
        style={{ position: 'fixed', top: '50%', left: '70%' }} 
      />

      <div className="max-w-6xl mx-auto relative z-10">
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
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
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
                  פאנל ניהול
                </h1>
                <p className="text-sm text-gray-500">צפייה בכל הדוחות במערכת</p>
              </div>
            </div>

            <LiquidGlassButton
              variant="ghost"
              size="sm"
              onClick={onLogout}
              icon={<LogOut className="w-4 h-4" />}
            >
              התנתק
            </LiquidGlassButton>
          </LiquidGlassView>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <LiquidGlassInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש לפי שם משתמש או שם מועמד..."
              dir="rtl"
              style={{ paddingRight: '48px' }}
            />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <LiquidGlassView
            effect="clear"
            radius={16}
            style={{ 
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap'
            }}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 font-medium">{reports.length} דוחות</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 font-medium">
                {new Set(reports.map(r => r.username)).size} משתמשים
              </span>
            </div>
          </LiquidGlassView>
        </motion.div>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LiquidGlassView
            effect="regular"
            radius={24}
            style={{ padding: '0', overflow: 'hidden' }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full"
                />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                <p>{error}</p>
                <LiquidGlassButton
                  variant="secondary"
                  size="sm"
                  onClick={loadReports}
                  style={{ marginTop: '16px' }}
                >
                  נסה שוב
                </LiquidGlassButton>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>לא נמצאו דוחות</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                  <thead>
                    <tr className="border-b border-gray-200/50">
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                        משתמש
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                        שם מועמד
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                        ציון
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                        תאריך
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredReports.map((report, index) => (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100/50 hover:bg-white/30 transition-colors cursor-pointer"
                          onClick={() => onViewReport(report)}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {report.username}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {report.candidate_name || 'לא צוין'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Star 
                                className="w-4 h-4" 
                                style={{ color: getScoreColor(report.report.overall_score) }}
                                fill={getScoreColor(report.report.overall_score)}
                              />
                              <span 
                                className="font-bold"
                                style={{ color: getScoreColor(report.report.overall_score) }}
                              >
                                {report.report.overall_score}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4" />
                              {formatDate(report.created_at)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewReport(report);
                                }}
                                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors shadow-sm"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </LiquidGlassView>
        </motion.div>

        {/* Back to Login hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          מחובר כמנהל מערכת
        </motion.p>
      </div>
    </div>
  );
}

