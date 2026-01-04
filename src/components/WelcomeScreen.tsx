import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Briefcase, ArrowLeft, Sparkles, MessageSquare, History } from 'lucide-react';
import { 
  LiquidGlassView, 
  LiquidGlassButton, 
  LiquidGlassInput,
  LiquidGlassTextarea,
  LiquidGlassFeature,
  LiquidIcon,
  LiquidBlob,
  LiquidGlassFilters 
} from './LiquidGlass';

interface WelcomeScreenProps {
  onStart: (name: string, cv?: string) => void;
  onViewHistory: () => void;
  isLoading: boolean;
}

export function WelcomeScreen({ onStart, onViewHistory, isLoading }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [cv, setCv] = useState('');
  const [showCvInput, setShowCvInput] = useState(false);

  const handleStart = () => {
    onStart(name.trim(), cv.trim() || undefined);
  };

  return (
    <div className="min-h-screen min-h-[-webkit-fill-available] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* SVG Filters */}
      <LiquidGlassFilters />
      
      {/* Marble Background with veins */}
      <div className="marble-bg" />
      <div className="marble-veins" />
      
      {/* Animated liquid blobs for dynamic background - brighter colors */}
      <LiquidBlob 
        size={600} 
        color="rgba(255, 255, 255, 0.7)" 
        style={{ position: 'fixed', top: '-15%', right: '-10%' }} 
      />
      <LiquidBlob 
        size={500} 
        color="rgba(248, 250, 252, 0.6)" 
        style={{ position: 'fixed', bottom: '-20%', left: '-15%' }} 
      />
      <LiquidBlob 
        size={350} 
        color="rgba(255, 255, 255, 0.5)" 
        style={{ position: 'fixed', top: '35%', left: '55%' }} 
      />

      {/* Main card with enhanced liquid glass */}
      <LiquidGlassView
        effect="regular"
        radius={36}
        glowOnHover
        elasticity={0.12}
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1 
        }}
        style={{ 
          padding: '32px 28px', 
          maxWidth: '480px', 
          width: '100%', 
          zIndex: 10 
        }}
      >
        {/* Logo/Icon with liquid glass effect */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.35, 
            type: 'spring', 
            stiffness: 200, 
            damping: 15 
          }}
          className="flex justify-center mb-7"
        >
          <LiquidIcon size="lg">
            <motion.div 
              className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 flex items-center justify-center"
              style={{
                boxShadow: `
                  0 8px 20px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.15),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                `
              }}
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Scale className="w-7 h-7 text-white" />
            </motion.div>
          </LiquidIcon>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800"
          style={{ letterSpacing: '-0.02em' }}
        >
          סימולטור ראיון התמחות
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 mb-7 text-sm sm:text-base"
          style={{ letterSpacing: '-0.01em' }}
        >
          התכוננו לראיון התמחות במשרד עורכי דין מוביל
        </motion.p>

        {/* Features with liquid glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-7"
        >
          <LiquidGlassFeature className="p-4 text-center cursor-default">
            <LiquidIcon size="md" className="mx-auto mb-2.5">
              <Briefcase className="w-5 h-5 text-gray-600" />
            </LiquidIcon>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">6 שאלות מקצועיות</p>
          </LiquidGlassFeature>
          
          <LiquidGlassFeature className="p-4 text-center cursor-default">
            <LiquidIcon size="md" className="mx-auto mb-2.5">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </LiquidIcon>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">דוח משוב מפורט</p>
          </LiquidGlassFeature>
        </motion.div>

        {/* Input fields with liquid glass and pop animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="space-y-4 relative z-10"
        >
          <LiquidGlassInput
            label="שם מלא (אופציונלי)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="הכנס/י את שמך"
            dir="rtl"
          />

          {/* CV toggle with liquid hover effect */}
          <motion.button
            onClick={() => setShowCvInput(!showCvInput)}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center gap-2 font-medium py-2 px-3 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ 
              x: -4,
              background: 'rgba(255, 255, 255, 0.6)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft 
              className={`w-4 h-4 transition-transform duration-300 ${showCvInput ? 'rotate-90' : ''}`} 
            />
            הוסף קורות חיים (אופציונלי)
          </motion.button>

          {showCvInput && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <LiquidGlassTextarea
                value={cv}
                onChange={(e) => setCv(e.target.value)}
                placeholder="הדבק/י את קורות החיים שלך כאן..."
                dir="rtl"
                style={{ height: '120px' }}
              />
              <p className="text-xs text-gray-400 mt-2 pr-1">
                * הנתונים נשמרים בזיכרון בלבד ונמחקים בסיום הראיון
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-7 relative z-10 space-y-3"
        >
          {/* Primary CTA - Start Interview */}
          <LiquidGlassButton
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={isLoading}
            loading={isLoading}
            icon={!isLoading && <Briefcase className="w-5 h-5" />}
            style={{ width: '100%' }}
          >
            {isLoading ? 'מתחיל ראיון...' : 'התחל ראיון'}
          </LiquidGlassButton>

          {/* Secondary - View History */}
          <LiquidGlassButton
            variant="secondary"
            size="md"
            onClick={onViewHistory}
            icon={<History className="w-4 h-4" />}
            style={{ width: '100%' }}
          >
            צפה בדוחות קודמים
          </LiquidGlassButton>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="text-center text-gray-400 text-xs mt-5 relative z-10 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3 h-3 text-gray-300" />
          <span>הראיון מתנהל בעברית ומדמה ראיון אמיתי להתמחות</span>
          <Sparkles className="w-3 h-3 text-gray-300" />
        </motion.p>
      </LiquidGlassView>
    </div>
  );
}
