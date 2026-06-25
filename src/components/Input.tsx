import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { theme } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type InputProps = TextInputProps & {
  icon?: IconName;
  error?: string;
  label?: string;
  isPassword?: boolean;
};

export function Input({ icon, error, label, isPassword = false, style, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);
  const secureTextEntry = isPassword && !visible;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {icon ? <Ionicons name={icon} size={20} color={theme.colors.muted} /> : null}
        <TextInput
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={secureTextEntry}
          style={[styles.input, style]}
          {...props}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            onPress={() => setVisible((current) => !current)}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={theme.colors.muted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
  inputWrapper: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputWrapperError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.xs,
  },
});
