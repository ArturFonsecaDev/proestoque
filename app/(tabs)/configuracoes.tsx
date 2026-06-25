import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    id: 'notificacoes',
    title: 'Notificacoes',
    description: 'Alertas de estoque baixo e novidades',
    icon: 'notifications-outline',
  },
  {
    id: 'ajuda',
    title: 'Ajuda',
    description: 'Central de suporte do ProEstoque',
    icon: 'help-circle-outline',
  },
] as const;

export default function ConfiguracoesScreen() {
  const { user, logout, isLoading } = useAuth();
  const nomeUsuario = user?.nome ?? 'Usuario';
  const emailUsuario = user?.email ?? 'email nao informado';
  const inicialUsuario = nomeUsuario.charAt(0).toUpperCase();

  function handleLogout() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja encerrar sua sessao?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuracoes</Text>
          <Text style={styles.subtitle}>Gerencie sua conta e preferencias</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicialUsuario}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{nomeUsuario}</Text>
            <Text style={styles.profileEmail}>{emailUsuario}</Text>
          </View>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <Pressable key={item.id} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.muted} />
            </Pressable>
          ))}
        </View>

        <Button
          fullWidth
          loading={isLoading}
          title="Sair da conta"
          variant="outline"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  profileName: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '800',
  },
  profileEmail: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
  menuList: {
    gap: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
  },
  menuContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  menuTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
  },
  menuDescription: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
});
