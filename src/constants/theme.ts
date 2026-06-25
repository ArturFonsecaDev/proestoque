export const theme = {
  colors: {
    primary: '#0F766E',
    primaryDark: '#115E59',
    primaryLight: '#CCFBF1',
    secondary: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#CBD5E1',
    danger: '#DC2626',
    success: '#16A34A',
    white: '#FFFFFF',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
    pill: 999,
  },
} as const;

export type Theme = typeof theme;
