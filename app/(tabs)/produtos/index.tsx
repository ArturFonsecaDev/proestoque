import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { useProducts } from '@/contexts/ProductsContext';
import { obterStatusEstoque, type Produto, type StatusEstoque } from '@/data/mockData';

const TODAS_CATEGORIAS = 'Todos';

const statusConfig: Record<StatusEstoque, { label: string; color: string; background: string }> = {
  normal: {
    label: 'Normal',
    color: theme.colors.success,
    background: theme.colors.successLight,
  },
  baixo: {
    label: 'Baixo',
    color: theme.colors.warning,
    background: theme.colors.warningLight,
  },
  'sem-estoque': {
    label: 'Sem estoque',
    color: theme.colors.danger,
    background: theme.colors.dangerLight,
  },
};

const formatCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(TODAS_CATEGORIAS);
  const { produtos, isLoading } = useProducts();

  const categorias = useMemo(() => {
    const uniqueCategories = Array.from(new Set(produtos.map((produto) => produto.categoria)));

    return [TODAS_CATEGORIAS, ...uniqueCategories];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const correspondeBusca =
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.categoria.toLowerCase().includes(termoBusca);
      const correspondeCategoria =
        categoriaSelecionada === TODAS_CATEGORIAS ||
        produto.categoria === categoriaSelecionada;

      return correspondeBusca && correspondeCategoria;
    });
  }, [busca, categoriaSelecionada, produtos]);

  const renderProduto: ListRenderItem<Produto> = ({ item }) => <ProdutoCard produto={item} />;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>Busque, filtre e gerencie os itens cadastrados</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={theme.colors.muted} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Buscar produto ou categoria"
            placeholderTextColor={theme.colors.muted}
            value={busca}
            onChangeText={setBusca}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          horizontal
          data={categorias}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const ativo = item === categoriaSelecionada;

            return (
              <Pressable
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setCategoriaSelecionada(item)}>
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        />

        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={38} color={theme.colors.muted} />
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptyText}>Tente mudar a busca ou cadastre um novo produto.</Text>
            </View>
          }
        />

        <Pressable
          accessibilityRole="button"
          style={styles.fab}
          onPress={() => router.push('/produtos/novo' as Href)}>
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ProdutoCard({ produto }: { produto: Produto }) {
  const status = obterStatusEstoque(produto);
  const statusStyle = statusConfig[status];

  return (
    <Pressable
      style={styles.productCard}
      onPress={() =>
        router.push({
          pathname: '/produtos/[id]',
          params: { id: produto.id },
        } as unknown as Href)
      }>
      <View style={styles.productImage}>
        <Text style={styles.productInitials}>{produto.imagem}</Text>
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productTitleRow}>
          <Text style={styles.productName}>{produto.nome}</Text>
          <View style={[styles.badge, { backgroundColor: statusStyle.background }]}>
            <Text style={[styles.badgeText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
        <Text style={styles.productCategory}>{produto.categoria}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{formatCurrency.format(produto.preco)}</Text>
          <Text style={styles.productStock}>{produto.estoque} unidades</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
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
  searchBox: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  chipsContent: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.lg,
  },
  chip: {
    height: 38,
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  productsContent: {
    gap: theme.spacing.md,
    paddingBottom: 110,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  productImage: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInitials: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
  },
  productInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  productName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
  },
  productCategory: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  productPrice: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '800',
  },
  productStock: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
  badge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badgeText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '800',
  },
  emptyState: {
    marginTop: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 62,
    height: 62,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
});
