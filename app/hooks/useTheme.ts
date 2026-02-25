import { useColorScheme } from 'react-native';
import { useProfile } from '../stores/profileStore';
import { COLORS } from '../styles/global_style';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { profile } = useProfile();

  const effectiveScheme = profile.themeOverride === 'system'
    ? systemScheme
    : profile.themeOverride;

  const isDark = effectiveScheme === 'dark';
  const theme = isDark ? COLORS.dark : COLORS.light;

  return {
    isDark,
    theme,
    effectiveScheme,
  };
}
