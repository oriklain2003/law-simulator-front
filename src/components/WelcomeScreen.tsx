import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Briefcase, ArrowLeft } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string, cv?: string) => void;
  isLoading: boolean;
}

export function WelcomeScreen({ onStart, isLoading }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [cv, setCv] = useState('');
  const [showCvInput, setShowCvInput] = useState(false);

  const handleStart = () => {
    onStart(name.trim(), cv.trim() || undefined);
  };

  return (
    <div className="min-h-screen min-h-[-webkit-fill-available] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background decoration */}
      <div className="bg-decoration bg-decoration-1" />
      <div className="bg-decoration bg-decoration-2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card p-6 sm:p-10 max-w-2xl w-full relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
            <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-3 font-display text-gray-800"
        >
          סימולטור ראיון התמחות
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg"
        >
          התכוננו לראיון התמחות במשרד עורכי דין מוביל
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="glass-card p-3 sm:p-4 text-center">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600">6 שאלות מקצועיות</p>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600">דוח משוב מפורט</p>
          </div>
        </motion.div>

        {/* Input fields */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-500 mb-2">שם מלא (אופציונלי)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הכנס/י את שמך"
              className="glass-input w-full px-4 py-3 text-base sm:text-lg"
              dir="rtl"
            />
          </div>

          {/* CV toggle */}
          <button
            onClick={() => setShowCvInput(!showCvInput)}
            className="text-gray-600 text-sm hover:text-gray-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className={`w-4 h-4 transition-transform ${showCvInput ? 'rotate-90' : ''}`} />
            הוסף קורות חיים (אופציונלי)
          </button>

          {showCvInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={cv}
                onChange={(e) => setCv(e.target.value)}
                placeholder="הדבק/י את קורות החיים שלך כאן..."
                className="glass-input w-full px-4 py-3 h-32 resize-none text-base"
                dir="rtl"
              />
              <p className="text-xs text-gray-400 mt-1">
                * הנתונים נשמרים בזיכרון בלבד ונמחקים בסיום הראיון
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleStart}
          disabled={isLoading}
          className="glass-button w-full py-3 sm:py-4 mt-6 sm:mt-8 text-lg sm:text-xl font-semibold flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              מתחיל ראיון...
            </>
          ) : (
            <>
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
              התחל ראיון
            </>
          )}
        </motion.button>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6"
        >
          הראיון מתנהל בעברית ומדמה ראיון אמיתי להתמחות
        </motion.p>
      </motion.div>
    </div>
  );
}
