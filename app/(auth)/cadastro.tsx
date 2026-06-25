import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LogoProEstoque } from '@/components/LogoProEstoque';
import { theme } from '@/constants/theme';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;

  function handleCriarConta() {
    if (senhasDiferentes) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <LogoProEstoque size="md" />

          <View style={styles.form}>
            <Input
              icon="person-outline"
              label="Nome"
              onChangeText={setNome}
              placeholder="Seu nome completo"
              value={nome}
            />
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
              placeholder="Crie uma senha"
              value={senha}
            />
            <Input
              error={senhasDiferentes ? 'As senhas nao conferem.' : undefined}
              icon="shield-checkmark-outline"
              isPassword
              label="Confirmar senha"
              onChangeText={setConfirmarSenha}
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
            />

            <Button
              fullWidth
              disabled={senhasDiferentes}
              loading={loading}
              title="Criar Conta"
              onPress={handleCriarConta}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ja tenho conta.</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.linkText}>Entrar</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.md,
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
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
});
