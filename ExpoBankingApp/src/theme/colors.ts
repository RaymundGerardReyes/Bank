export const colors = {
  // --- 60-30-10 Rule Palette ---
  dominant: '#FFFFFF',      // 60% - Clean whitespace and main backgrounds
  secondary: '#7BB2D9',     // 30% - Structural elements, card borders, banners
  accent: '#0F2C59',        // 10% - High-contrast text, primary buttons, icons
  surface: '#F4F9FC',       // Very light tint of secondary for input fields

  // --- Mapped to existing app architecture ---
  primary: '#0F2C59',       // Mapped to Accent for high priority
  background: '#FFFFFF',    // Mapped to Dominant 60%
  card: '#FFFFFF',          // Pure white cards to sit on white backgrounds
  cardBorder: '#7BB2D9',    // Mapped to Secondary 30%

  textPrimary: '#0F2C59',   // Ensures WCAG compliance against white backgrounds
  textSecondary: '#7BB2D9', // Used for subtitles or less important text
  textMuted: '#94A3B8',     // Standard gray for placeholders

  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',
  info: '#0284C7',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  inputBg: '#F4F9FC',       // Subtle background to separate inputs from pure white
  inputBorder: '#7BB2D9',   // 30% structural color
  inputFocus: '#0F2C59',    // 10% highlight color
};