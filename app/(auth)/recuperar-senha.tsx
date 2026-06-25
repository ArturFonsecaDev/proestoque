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

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.container}>
          <LogoProEstoque size="md" />

          {enviado ? (
            <View style={styles.card}>
              <Text style={styles.title}>Link enviado!</Text>
              <Text style={styles.description}>
                Se o e-mail estiver cadastrado, voce recebera as instrucoes para recuperar sua senha.
              </Text>
              <Link href="/(auth)/login" asChild>
                <Button fullWidth title="Voltar ao Login" variant="outline" />
              </Link>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.title}>Recuperar senha</Text>
              <Text style={styles.description}>
                Informe seu e-mail e enviaremos um link de recuperacao
              </Text>
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
              <Button fullWidth title="Enviar" onPress={() => setEnviado(true)} />
              <Link href="/(auth)/login" asChild>
                <Pressable style={styles.backLink}>
                  <Text style={styles.linkText}>Voltar ao Login</Text>
                </Pressable>
              </Link>
            </View>
          )}
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
});
