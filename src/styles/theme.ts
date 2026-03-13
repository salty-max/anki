export const lightTheme = {
  colors: {
    background: '#ffffff',
    card: '#f4f4f5',
    border: '#e4e4e7',
    primary: '#09090b',
    primaryText: '#fafafa',
    text: '#09090b',
    muted: '#71717a',
    danger: '#ef4444',
    success: '#22c55e',
  },
  typography: {
    fontFamily: 'Nunito_400Regular',
    fontFamilyJapanese: 'NotoSansJP_400Regular',
    bold: 'Nunito_700Bold',
    boldJapanese: 'NotoSansJP_700Bold',
  },
} as const;

export const darkTheme = {
  colors: {
    background: '#09090b',
    card: '#18181b',
    border: '#27272a',
    primary: '#fafafa',
    primaryText: '#18181b',
    text: '#fafafa',
    muted: '#a1a1aa',
    danger: '#ef4444',
    success: '#22c55e',
  },
  typography: {
    fontFamily: 'Nunito_400Regular',
    fontFamilyJapanese: 'NotoSansJP_400Regular',
    bold: 'Nunito_700Bold',
    boldJapanese: 'NotoSansJP_700Bold',
  },
} as const;