import { Stack } from 'expo-router';

import { theme } from '@/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar produto' }} />
    </Stack>
  );
}
