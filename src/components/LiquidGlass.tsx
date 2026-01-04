import { motion, HTMLMotionProps, useAnimation } from 'framer-motion';
import { forwardRef, ReactNode, useState } from 'react';

// ============================================
// APPLE-QUALITY LIQUID GLASS COMPONENTS
// Inspired by iOS 26 Liquid Glass design
// With proper refraction, reflection, and elasticity
// ============================================

// SVG Filters for realistic glass effects
export function LiquidGlassFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* Refraction displacement filter */}
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015" 
            numOctaves="2" 
            result="noise"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="3" 
            xChannelSelector="R" 
            yChannelSelector="G"
          />
        </filter>
        
        {/* Glow effect filter */}
        <filter id="liquid-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feFlood floodColor="rgba(255,255,255,0.4)" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Morphing blob filter */}
        <filter id="liquid-morph">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="morph"
          />
          <feComposite in="SourceGraphic" in2="morph" operator="atop" />
        </filter>

        {/* Specular highlight gradient */}
        <linearGradient id="glass-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Edge rim light */}
        <linearGradient id="rim-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ============================================
// LIQUID GLASS VIEW - Main container
// ============================================

interface LiquidGlassViewProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode;
  interactive?: boolean;
  effect?: 'clear' | 'regular' | 'prominent';
  tintColor?: string;
  colorScheme?: 'light' | 'dark' | 'system';
  radius?: number;
  glowOnHover?: boolean;
  elasticity?: number;
}

export const LiquidGlassView = forwardRef<HTMLDivElement, LiquidGlassViewProps>(
  (
    {
      children,
      interactive = false,
      effect = 'regular',
      tintColor,
      colorScheme = 'light',
      radius = 28,
      glowOnHover = false,
      elasticity = 0.15,
      className = '',
      style,
      ...motionProps
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    // Effect presets - enhanced for better mobile visibility
    const effectStyles = {
      clear: {
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.55) 0%,
          rgba(255, 255, 255, 0.35) 40%,
          rgba(255, 255, 255, 0.45) 100%
        )`,
        backdropFilter: 'blur(24px) saturate(180%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.08)',
      },
      regular: {
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.92) 0%,
          rgba(255, 255, 255, 0.82) 35%,
          rgba(255, 255, 255, 0.85) 70%,
          rgba(255, 255, 255, 0.9) 100%
        )`,
        backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
      },
      prominent: {
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(255, 255, 255, 0.92) 40%,
          rgba(255, 255, 255, 0.95) 100%
        )`,
        backdropFilter: 'blur(60px) saturate(220%) brightness(1.12)',
        WebkitBackdropFilter: 'blur(60px) saturate(220%) brightness(1.12)',
      },
    };

    const baseStyle = effectStyles[effect];

    return (
      <motion.div
        ref={ref}
        className={`liquid-glass-view ${className}`}
        style={{
          ...baseStyle,
          borderRadius: radius,
          // Enhanced borders for 3D glass look
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          borderTopColor: 'rgba(255, 255, 255, 1)',
          borderLeftColor: 'rgba(255, 255, 255, 0.95)',
          borderBottomColor: 'rgba(200, 200, 200, 0.4)',
          borderRightColor: 'rgba(200, 200, 200, 0.5)',
          // Stronger shadows for better depth on mobile
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 4px 16px rgba(0, 0, 0, 0.08),
            0 2px 6px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(255, 255, 255, 1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.03),
            inset 2px 0 4px rgba(255, 255, 255, 0.5),
            inset -2px 0 4px rgba(0, 0, 0, 0.02)
          `,
          position: 'relative',
          overflow: 'hidden',
          willChange: 'transform, box-shadow',
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={(interactive || glowOnHover) ? { 
          scale: 1 + elasticity * 0.1,
          boxShadow: `
            0 12px 48px rgba(0, 0, 0, 0.15),
            0 6px 24px rgba(0, 0, 0, 0.1),
            0 3px 10px rgba(0, 0, 0, 0.08),
            inset 0 2px 4px rgba(255, 255, 255, 1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.04)
          `,
        } : undefined}
        whileTap={interactive ? { 
          scale: 1 - elasticity * 0.15,
        } : undefined}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          mass: 0.8
        }}
        {...motionProps}
      >
        {/* Primary highlight - top edge shine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: `linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.95) 0%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.25) 45%,
              transparent 100%
            )`,
            borderRadius: `${radius}px ${radius}px 0 0`,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.9,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Top specular rim - crisp white line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 8,
            right: 8,
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,1) 85%, transparent 100%)',
            borderRadius: `${radius}px`,
            pointerEvents: 'none',
          }}
        />

        {/* Left edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            bottom: 10,
            width: '1.5px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.9) 80%, transparent 100%)',
            borderRadius: `${radius}px`,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom edge shadow for depth */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 12,
            right: 12,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.08) 30%, rgba(0, 0, 0, 0.08) 70%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Right edge shadow for depth */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 0,
            bottom: 12,
            width: '1px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.06) 30%, rgba(0, 0, 0, 0.06) 70%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Tint overlay */}
        {tintColor && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: tintColor,
              opacity: 0.08,
              borderRadius: radius,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </motion.div>
    );
  }
);

LiquidGlassView.displayName = 'LiquidGlassView';

// ============================================
// LIQUID GLASS BUTTON - Enhanced with liquid light effects
// ============================================

interface LiquidGlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  wobbly?: boolean;
}

export const LiquidGlassButton = forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      wobbly = false,
      className = '',
      disabled,
      style: externalStyle,
      ...motionProps
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const sizeStyles = {
      sm: { padding: '10px 20px', fontSize: '14px', borderRadius: '14px', minHeight: '40px' },
      md: { padding: '14px 28px', fontSize: '16px', borderRadius: '18px', minHeight: '50px' },
      lg: { padding: '16px 36px', fontSize: '17px', borderRadius: '22px', minHeight: '58px' },
    };

    const variantStyles = {
      primary: {
        background: 'linear-gradient(180deg, #3d4555 0%, #2d3340 50%, #252a35 100%)',
        color: '#ffffff',
        boxShadow: `
          0 10px 30px rgba(0, 0, 0, 0.25),
          0 4px 12px rgba(0, 0, 0, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
      },
      secondary: {
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.85) 0%,
          rgba(255, 255, 255, 0.7) 50%,
          rgba(255, 255, 255, 0.75) 100%
        )`,
        color: '#1a202c',
        boxShadow: `
          0 6px 20px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.05),
          0 0 0 0.5px rgba(255, 255, 255, 0.9),
          inset 0 1px 0 rgba(255, 255, 255, 1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.03)
        `,
      },
      ghost: {
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.6) 0%,
          rgba(255, 255, 255, 0.45) 50%,
          rgba(255, 255, 255, 0.5) 100%
        )`,
        color: '#4a5568',
        boxShadow: `
          0 4px 12px rgba(0, 0, 0, 0.05),
          0 1px 4px rgba(0, 0, 0, 0.03),
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(255, 255, 255, 0.3)
        `,
      },
    };

    const currentSize = sizeStyles[size];
    const currentVariant = variantStyles[variant];

    return (
      <motion.button
        ref={ref}
        className={`liquid-glass-button ${wobbly ? 'liquid-wobbly' : ''} ${className}`}
        style={{
          ...currentSize,
          ...currentVariant,
          border: variant === 'primary' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.75)',
          borderTopColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)',
          borderLeftColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.85)',
          borderBottomColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
          borderRightColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: variant !== 'primary' ? 'blur(25px) saturate(180%) brightness(1.05)' : undefined,
          WebkitBackdropFilter: variant !== 'primary' ? 'blur(25px) saturate(180%) brightness(1.05)' : undefined,
          fontWeight: 600,
          letterSpacing: variant === 'primary' ? '0.5px' : '-0.01em',
          textTransform: variant === 'primary' ? 'none' : 'none',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          position: 'relative',
          overflow: 'hidden',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          willChange: 'transform, box-shadow',
          ...externalStyle,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={!disabled && !loading ? { 
          y: -3,
          scale: 1.02,
          boxShadow: variant === 'primary' 
            ? `
              0 18px 50px rgba(0, 0, 0, 0.35),
              0 10px 25px rgba(0, 0, 0, 0.25),
              0 4px 10px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.18),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `
            : `
              0 12px 35px rgba(0, 0, 0, 0.12),
              0 6px 16px rgba(0, 0, 0, 0.08),
              0 0 0 0.5px rgba(255, 255, 255, 1),
              0 0 30px rgba(255, 255, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 1),
              inset 0 -1px 0 rgba(255, 255, 255, 0.4)
            `,
        } : undefined}
        whileTap={!disabled && !loading ? { 
          y: 0,
          scale: 0.96,
        } : undefined}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 28,
          mass: 0.5
        }}
        disabled={disabled || loading}
        {...motionProps}
      >
        {/* Light sweep effect - the "liquid" shine */}
        <motion.div
          animate={{
            x: isHovered ? '200%' : '-100%',
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              90deg, 
              transparent, 
              ${variant === 'primary' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)'}, 
              transparent
            )`,
            transform: 'skewX(-25deg)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Top highlight for 3D glass volume effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: variant === 'primary'
              ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
            borderRadius: `${currentSize.borderRadius} ${currentSize.borderRadius} 0 0`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        
        {/* Specular rim highlight at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: variant === 'primary'
              ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.95) 80%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        
        {/* Inner glow effect for secondary/ghost */}
        {variant !== 'primary' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: currentSize.borderRadius,
              boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.15)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              position: 'relative',
              zIndex: 5,
            }}
          />
        ) : (
          <>
            {icon && <span style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 5 }}>{icon}</span>}
            <span style={{ position: 'relative', zIndex: 5 }}>{children}</span>
          </>
        )}
      </motion.button>
    );
  }
);

LiquidGlassButton.displayName = 'LiquidGlassButton';

// ============================================
// LIQUID GLASS INPUT - With pop animation
// ============================================

interface LiquidGlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onFocus' | 'onBlur'> {
  label?: string;
  error?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const LiquidGlassInput = forwardRef<HTMLInputElement, LiquidGlassInputProps>(
  ({ label, error, className = '', style, onFocus, onBlur, ...inputProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const controls = useAnimation();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Liquid pop animation
      controls.start({
        scale: [1, 1.03, 0.99, 1.01, 1],
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
      });
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={className}>
        {label && (
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        )}
        <motion.div
          animate={controls}
          style={{
            borderRadius: '16px',
            position: 'relative',
          }}
        >
          {/* Glow effect on focus */}
          <motion.div
            animate={{
              opacity: isFocused ? 1 : 0,
              scale: isFocused ? 1 : 0.95,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(200,200,200,0.3) 100%)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />
          
          <input
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '16px',
              background: isFocused
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.65) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: isFocused 
                ? '1.5px solid rgba(255, 255, 255, 0.95)' 
                : '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              color: '#1a1a2e',
              outline: 'none',
              boxShadow: isFocused
                ? `
                  0 8px 25px rgba(0, 0, 0, 0.08),
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 1),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.5)
                `
                : `
                  0 4px 15px rgba(0, 0, 0, 0.04),
                  0 1px 4px rgba(0, 0, 0, 0.02),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9)
                `,
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              ...style,
            }}
            {...inputProps}
          />
        </motion.div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

LiquidGlassInput.displayName = 'LiquidGlassInput';

// ============================================
// LIQUID GLASS TEXTAREA - With enhanced pop animation & liquid effects
// ============================================

interface LiquidGlassTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onFocus' | 'onBlur'> {
  label?: string;
  error?: string;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const LiquidGlassTextarea = forwardRef<HTMLTextAreaElement, LiquidGlassTextareaProps>(
  ({ label, error, className = '', style, onFocus, onBlur, ...textareaProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      // Enhanced liquid pop animation
      controls.start({
        scale: [1, 1.025, 0.99, 1.01, 1],
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
      });
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={className}>
        {label && (
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            {label}
          </label>
        )}
        <motion.div 
          animate={controls} 
          style={{ borderRadius: '16px', position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Outer glow effect */}
          <motion.div
            animate={{ 
              opacity: isFocused ? 1 : isHovered ? 0.6 : 0, 
              scale: isFocused ? 1 : isHovered ? 0.98 : 0.95 
            }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(220,220,220,0.3) 100%)',
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }}
          />
          
          {/* Light sweep effect container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <motion.div
              animate={{
                x: isHovered || isFocused ? '200%' : '-100%',
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                transform: 'skewX(-25deg)',
              }}
            />
          </div>

          <textarea
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '16px',
              background: isFocused
                ? `linear-gradient(
                    165deg,
                    rgba(255, 255, 255, 0.92) 0%,
                    rgba(255, 255, 255, 0.82) 50%,
                    rgba(255, 255, 255, 0.88) 100%
                  )`
                : isHovered
                ? `linear-gradient(
                    165deg,
                    rgba(255, 255, 255, 0.85) 0%,
                    rgba(255, 255, 255, 0.72) 50%,
                    rgba(255, 255, 255, 0.78) 100%
                  )`
                : `linear-gradient(
                    165deg,
                    rgba(255, 255, 255, 0.75) 0%,
                    rgba(255, 255, 255, 0.6) 50%,
                    rgba(255, 255, 255, 0.68) 100%
                  )`,
              backdropFilter: 'blur(25px) saturate(180%) brightness(1.05)',
              WebkitBackdropFilter: 'blur(25px) saturate(180%) brightness(1.05)',
              border: isFocused 
                ? '1.5px solid rgba(255, 255, 255, 0.95)' 
                : '1px solid rgba(255, 255, 255, 0.75)',
              borderTopColor: isFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
              borderLeftColor: isFocused ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
              borderBottomColor: isFocused ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
              borderRightColor: isFocused ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              color: '#1a1a2e',
              outline: 'none',
              resize: 'none',
              boxShadow: isFocused
                ? `
                  0 12px 35px rgba(0, 0, 0, 0.08),
                  0 4px 12px rgba(0, 0, 0, 0.05),
                  0 0 0 0.5px rgba(255, 255, 255, 0.9),
                  inset 0 1.5px 0 rgba(255, 255, 255, 1),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.4)
                `
                : isHovered
                ? `
                  0 8px 25px rgba(0, 0, 0, 0.06),
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  0 0 0 0.5px rgba(255, 255, 255, 0.8),
                  inset 0 1px 0 rgba(255, 255, 255, 0.95),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.3)
                `
                : `
                  0 5px 18px rgba(0, 0, 0, 0.04),
                  0 1px 5px rgba(0, 0, 0, 0.02),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.2)
                `,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              zIndex: 1,
              ...style,
            }}
            {...textareaProps}
          />
          
          {/* Top highlight for 3D glass effect */}
          <div
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              right: 1,
              height: '45%',
              background: `linear-gradient(
                180deg,
                rgba(255, 255, 255, ${isFocused ? 0.7 : 0.5}) 0%,
                rgba(255, 255, 255, 0.2) 40%,
                transparent 100%
              )`,
              borderRadius: '15px 15px 0 0',
              pointerEvents: 'none',
              zIndex: 3,
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Specular rim highlight */}
          <div
            style={{
              position: 'absolute',
              top: 1,
              left: 1,
              right: 1,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.95) 80%, transparent 95%)',
              borderRadius: '16px 16px 0 0',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        </motion.div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>
        )}
      </div>
    );
  }
);

LiquidGlassTextarea.displayName = 'LiquidGlassTextarea';

// ============================================
// LIQUID GLASS FEATURE CARD
// ============================================

interface LiquidGlassFeatureProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidGlassFeature({ children, className = '', style }: LiquidGlassFeatureProps) {
  return (
    <motion.div
      className={`liquid-glass-feature ${className}`}
      style={{
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.75) 0%,
          rgba(255, 255, 255, 0.58) 50%,
          rgba(255, 255, 255, 0.65) 100%
        )`,
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderTopColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: `
          0 8px 25px rgba(0, 0, 0, 0.05),
          0 2px 8px rgba(0, 0, 0, 0.03),
          inset 0 1px 0 rgba(255, 255, 255, 0.95)
        `,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -3,
        boxShadow: `
          0 15px 40px rgba(0, 0, 0, 0.08),
          0 5px 15px rgba(0, 0, 0, 0.04),
          0 0 30px rgba(255, 255, 255, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 1)
        `,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      {/* Top highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

// ============================================
// LIQUID ICON CONTAINER
// ============================================

interface LiquidIconProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LiquidIcon({ children, size = 'md', className = '' }: LiquidIconProps) {
  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 52, height: 52 },
    lg: { width: 64, height: 64 },
  };

  return (
    <motion.div
      className={`liquid-icon ${className}`}
      style={{
        ...sizes[size],
        borderRadius: '50%',
        background: `linear-gradient(
          165deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(250, 250, 250, 0.92) 50%,
          rgba(255, 255, 255, 0.95) 100%
        )`,
        border: '1px solid rgba(255, 255, 255, 0.95)',
        boxShadow: `
          0 6px 20px rgba(0, 0, 0, 0.06),
          0 2px 6px rgba(0, 0, 0, 0.03),
          inset 0 1px 0 rgba(255, 255, 255, 1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.02)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// ANIMATED LIQUID BLOB - Background decoration
// ============================================

interface LiquidBlobProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidBlob({
  size = 200,
  color = 'rgba(255, 255, 255, 0.5)',
  className = '',
  style,
}: LiquidBlobProps) {
  return (
    <motion.div
      className={`liquid-blob ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        ...style,
      }}
      animate={{
        scale: [1, 1.15, 0.95, 1.1, 1],
        opacity: [0.4, 0.6, 0.5, 0.55, 0.4],
        x: [0, 15, -10, 5, 0],
        y: [0, -10, 15, -5, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// ============================================
// LIQUID GLASS CONTAINER - For morphing effects
// ============================================

interface LiquidGlassContainerProps {
  children: ReactNode;
  spacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidGlassContainerView({
  children,
  spacing = 16,
  className = '',
  style,
}: LiquidGlassContainerProps) {
  return (
    <div
      className={`liquid-glass-container ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        gap: spacing,
        ...style,
      }}
    >
      <LiquidGlassFilters />
      {children}
    </div>
  );
}

export default LiquidGlassView;
