export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const;

export const shadows = {
  subtle: '0 1px 3px rgba(0, 0, 0, 0.06)',
  hover: '0 4px 12px rgba(0, 0, 0, 0.1)',
  elevation: '0 8px 24px rgba(0, 0, 0, 0.12)',
} as const;

export const transitions = {
  fast: '200ms',
  base: '300ms',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const colors = {
  light: {
    primary: '#6B8E7A',
    primaryHover: '#5a7867',
    background: '#F5F1EB',
    foreground: '#1F2933',
    accent: '#D4A574',
    accentHover: '#c49463',
    card: '#FFFFFF',
    cardHover: '#FAFAF8',
    border: '#E4E1DB',
    borderHover: '#D4D1CB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  dark: {
    primary: '#7BA089',
    primaryHover: '#8cb29a',
    background: '#0F1419',
    foreground: '#F0EDE5',
    accent: '#D4A574',
    accentHover: '#e0b585',
    card: '#1A1F2E',
    cardHover: '#242936',
    border: '#2A2F3E',
    borderHover: '#3A3F4E',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
} as const;

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;
