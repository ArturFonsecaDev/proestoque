import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ProductForm } from '@/components/ProductForm';
import { theme } from '@/constants/theme';
import { useProducts } from '@/contexts/ProductsContext';
import type { ProdutoFormData } from '@/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const { buscarProdutoPorId, editarProduto, excluirProduto } = useProducts();
  const produto = useMemo(() => buscarProdutoPorId(id), [buscarProdutoPorId, id]);

  async function handleSubmit(data: ProdutoFormData) {
    if (!produto) {
      return;
    }

    setLoading(true);

    try {
      await editarProduto(produto.id, data);
      router.replace('/produtos' as Href);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete() {
    if (!produto) {
      return;
    }

    Alert.alert('Excluir produto', `Tem certeza que deseja excluir ${produto.nome}?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await excluirProduto(produto.id);
            router.replace('/produtos' as Href);
          },
      },
    ]);
  }

  if (!produto) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>Produto nao encontrado</Text>
        <Text style={styles.notFoundText}>O item pode ter sido removido da lista.</Text>
        <Button title="Voltar para produtos" onPress={() => router.replace('/produtos' as Href)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductForm
        defaultValues={produto}
        loading={loading}
        submitLabel="Salvar alteracoes"
        onSubmit={handleSubmit}
      />
      <View style={styles.deleteContainer}>
        <Button fullWidth title="Excluir produto" variant="outline" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  deleteContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  notFoundTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '800',
  },
  notFoundText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },
});
