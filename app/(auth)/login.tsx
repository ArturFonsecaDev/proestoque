import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LogoProEstoque } from '@/components/LogoProEstoque';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.container}>
          <LogoProEstoque size="lg" />

          <View style={styles.form}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              icon="mail-outline"
              label="E-mail"
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              value={email}
            />
            <Input
              icon="lock-closed-outline"
              isPassword
              label="Senha"
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              value={senha}
            />

            <Link href="/(auth)/recuperar-senha" asChild>
              <Pressable style={styles.forgotLink}>
                <Text style={styles.linkText}>Esqueci minha senha</Text>
              </Pressable>
            </Link>

            <Button
              fullWidth
              loading={isLoading}
              title="Entrar"
              onPress={() => login(email, senha)}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda nao tem conta?</Text>
            <Link href="/(auth)/cadastro" asChild>
              <Pressable>
                <Text style={styles.linkText}>Criar conta</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.md,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: theme.spacing.xs,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  footerText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
});
