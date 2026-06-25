import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

type LogoProEstoqueProps = {
  size?: LogoSize;
};

const sizeMap = {
  sm: {
    icon: 24,
    title: theme.fontSizes.lg,
    subtitle: theme.fontSizes.xs,
    padding: theme.spacing.sm,
  },
  md: {
    icon: 34,
    title: theme.fontSizes.xl,
    subtitle: theme.fontSizes.sm,
    padding: theme.spacing.md,
  },
  lg: {
    icon: 46,
    title: theme.fontSizes.xxl,
    subtitle: theme.fontSizes.md,
    padding: theme.spacing.lg,
  },
} as const;

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const currentSize = sizeMap[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { padding: currentSize.padding }]}>
        <Ionicons name="cube-outline" size={currentSize.icon} color={theme.colors.primary} />
      </View>
      <Text style={[styles.title, { fontSize: currentSize.title }]}>ProEstoque</Text>
      <Text style={[styles.subtitle, { fontSize: currentSize.subtitle }]}>
        Controle inteligente de produtos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconBox: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.muted,
    fontWeight: '500',
  },
});
