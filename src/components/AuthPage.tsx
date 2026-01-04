import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, User, Lock, LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { 
  LiquidGlassView, 
  LiquidGlassButton, 
  LiquidGlassInput,
  LiquidIcon,
  LiquidBlob,
  LiquidGlassFilters 
} from './LiquidGlass';
import type { AuthView } from '../types';

interface AuthPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function AuthPage({ onLogin, onRegister, isLoading, error }: AuthPageProps) {
  const [view, setView] = useState<AuthView>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim()) {
      setLocalError('נא להזין שם משתמש');
      return;
    }

    if (!password) {
      setLocalError('נא להזין סיסמה');
      return;
    }

    if (view === 'register') {
      if (password.length < 4) {
        setLocalError('הסיסמה חייבת להכיל לפחות 4 תווים');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('הסיסמאות אינן תואמות');
        return;
      }
      if (username.length < 3) {
        setLocalError('שם המשתמש חייב להכיל לפחות 3 תווים');
        return;
      }
      await onRegister(username.trim(), password);
    } else {
      await onLogin(username.trim(), password);
    }
  };

  const switchView = () => {
    setView(view === 'login' ? 'register' : 'login');
    setLocalError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen min-h-[-webkit-fill-available] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* SVG Filters */}
      <LiquidGlassFilters />
      
      {/* Marble Background with veins */}
      <div className="marble-bg" />
      <div className="marble-veins" />
      
      {/* Animated liquid blobs for dynamic background */}
      <LiquidBlob 
        size={550} 
        color="rgba(255, 255, 255, 0.65)" 
        style={{ position: 'fixed', top: '-12%', right: '-8%' }} 
      />
      <LiquidBlob 
        size={450} 
        color="rgba(248, 250, 252, 0.55)" 
        style={{ position: 'fixed', bottom: '-18%', left: '-12%' }} 
      />
      <LiquidBlob 
        size={300} 
        color="rgba(255, 255, 255, 0.45)" 
        style={{ position: 'fixed', top: '40%', left: '60%' }} 
      />

      {/* Main card with enhanced liquid glass */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <LiquidGlassView
            effect="regular"
            radius={36}
            glowOnHover
            elasticity={0.1}
            style={{ 
              padding: '36px 32px', 
              maxWidth: '420px', 
              width: '100%', 
              zIndex: 10 
            }}
          >
            {/* Logo/Icon with liquid glass effect */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.15, 
                type: 'spring', 
                stiffness: 200, 
                damping: 15 
              }}
              className="flex justify-center mb-6"
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
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800"
              style={{ letterSpacing: '-0.02em' }}
            >
              {view === 'login' ? 'התחברות' : 'הרשמה'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center text-gray-500 mb-7 text-sm sm:text-base"
              style={{ letterSpacing: '-0.01em' }}
            >
              {view === 'login' 
                ? 'התחבר/י לסימולטור ראיון ההתמחות' 
                : 'צור/י חשבון חדש לסימולטור'
              }
            </motion.p>

            {/* Error message */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-5"
                >
                  <div 
                    className="p-3 rounded-xl text-center text-sm"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#dc2626'
                    }}
                  >
                    {displayError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4 relative z-10"
              >
                {/* Username input */}
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <LiquidGlassInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="שם משתמש"
                    dir="rtl"
                    style={{ paddingRight: '48px' }}
                    autoComplete="username"
                  />
                </div>

                {/* Password input */}
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <LiquidGlassInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="סיסמה"
                    dir="rtl"
                    style={{ paddingRight: '48px' }}
                    autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>

                {/* Confirm password for register */}
                <AnimatePresence>
                  {view === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <LiquidGlassInput
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="אימות סיסמה"
                        dir="rtl"
                        style={{ paddingRight: '48px' }}
                        autoComplete="new-password"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-7 relative z-10"
              >
                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  loading={isLoading}
                  icon={!isLoading && (view === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                  style={{ width: '100%' }}
                >
                  {isLoading 
                    ? (view === 'login' ? 'מתחבר...' : 'נרשם...') 
                    : (view === 'login' ? 'התחבר' : 'הירשם')
                  }
                </LiquidGlassButton>
              </motion.div>
            </form>

            {/* Switch view button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-6 text-center relative z-10"
            >
              <motion.button
                onClick={switchView}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center gap-2 font-medium py-2 px-4 rounded-xl mx-auto"
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
                <ArrowRight className="w-4 h-4" />
                {view === 'login' 
                  ? 'אין לך חשבון? הירשם עכשיו' 
                  : 'יש לך חשבון? התחבר'
                }
              </motion.button>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center text-gray-400 text-xs mt-5 relative z-10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3 h-3 text-gray-300" />
              <span>סימולטור ראיון התמחות במשפטים</span>
              <Sparkles className="w-3 h-3 text-gray-300" />
            </motion.p>
          </LiquidGlassView>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

