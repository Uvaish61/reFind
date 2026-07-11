export const Colors = {
  background: '#0B0B0F',
  card: '#141420',
  inputBg: '#1C1C28',

  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDark: '#5B21B6',

  text: '#FFFFFF',
  textSecondary: '#B0B0CC',
  muted: '#888899',

  border: '#2A2A3A',
  white: '#FFFFFF',
  error: '#EF4444',

  darkBg: '#0B0B0F',
  darkCard: '#141420',
};

// New design system (chartreuse accent) — used by redesigned screens (Onboarding, Auth).
// Kept separate from `Colors` above so not-yet-redesigned screens (Home, Search, SavePreview)
// keep rendering with their existing values.
export const Palette = {
  bg: '#0C0C0C',
  card: '#161616',
  input: '#181818',
  navBar: '#111111',
  accent: '#CFFF47',
  accentDim: 'rgba(207, 255, 71, 0.12)',
  textPrimary: '#F2EDE4',
  textMuted: 'rgba(242, 237, 228, 0.38)',
  textDisabled: 'rgba(242, 237, 228, 0.22)',
  border: 'rgba(242, 237, 228, 0.07)',
  borderAccent: 'rgba(207, 255, 71, 0.3)',
  danger: 'rgba(220, 80, 80, 0.85)',
  dangerDim: 'rgba(220, 80, 80, 0.1)',
} as const;

export const Typography = {
  displayXL: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 36, color: Palette.textPrimary, lineHeight: 42 },
  displayLG: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 30, color: Palette.textPrimary, lineHeight: 36 },
  displayMD: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, lineHeight: 28 },

  labelSM: { fontFamily: 'DMSans-SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  bodyMD: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary, lineHeight: 22 },
  bodySM: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted, lineHeight: 20 },
  caption: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted },
  buttonLG: { fontFamily: 'DMSans-Bold', fontSize: 16, color: '#0C0C0C' },
  buttonMD: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: '#0C0C0C' },
} as const;

export const Radius = {
  sm: 8, md: 12, lg: 14, xl: 16, xxl: 24,
} as const;

export const Spacing = {
  xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 32,
} as const;

export default { Colors, Palette, Typography, Radius, Spacing };
