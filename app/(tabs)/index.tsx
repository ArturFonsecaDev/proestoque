import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import {
  CATEGORIAS_MOCK,
  PRODUTOS_MOCK,
  obterStatusEstoque,
  type Produto,
  type StatusEstoque,
} from '@/data/mockData';

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

const formatDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const produtosRecentes = useMemo(
    () =>
      [...PRODUTOS_MOCK].sort(
        (produtoA, produtoB) =>
          new Date(produtoB.criadoEm).getTime() - new Date(produtoA.criadoEm).getTime(),
      ),
    [],
  );

  const produtosEmAlerta = useMemo(
    () => PRODUTOS_MOCK.filter((produto) => obterStatusEstoque(produto) !== 'normal'),
    [],
  );

  const valorTotal = useMemo(
    () =>
      PRODUTOS_MOCK.reduce((total, produto) => total + produto.preco * produto.estoque, 0),
    [],
  );

  const resumoCards = [
    {
      id: 'total',
      label: 'Total',
      value: PRODUTOS_MOCK.length.toString(),
      icon: 'cube-outline',
      color: theme.colors.primary,
    },
    {
      id: 'alertas',
      label: 'Alertas',
      value: produtosEmAlerta.length.toString(),
      icon: 'alert-circle-outline',
      color: theme.colors.warning,
    },
    {
      id: 'categorias',
      label: 'Categorias',
      value: CATEGORIAS_MOCK.length.toString(),
      icon: 'albums-outline',
      color: theme.colors.secondary,
    },
    {
      id: 'valor',
      label: 'Valor',
      value: formatCurrency.format(valorTotal),
      icon: 'cash-outline',
      color: theme.colors.success,
    },
  ] as const;

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  }

  const renderProduto: ListRenderItem<Produto> = ({ item }) => <ProdutoItem produto={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={produtosRecentes}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Ola, Artur</Text>
                <Text style={styles.date}>{formatDate.format(new Date())}</Text>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name="storefront-outline" size={26} color={theme.colors.primary} />
              </View>
            </View>

            <View style={styles.summaryGrid}>
              {resumoCards.map((card) => (
                <View key={card.id} style={styles.summaryCard}>
                  <View style={[styles.summaryIcon, { backgroundColor: `${card.color}1A` }]}>
                    <Ionicons name={card.icon} size={22} color={card.color} />
                  </View>
                  <Text style={styles.summaryValue} numberOfLines={1}>
                    {card.value}
                  </Text>
                  <Text style={styles.summaryLabel}>{card.label}</Text>
                </View>
              ))}
            </View>

            {produtosEmAlerta.length > 0 ? (
              <View style={styles.alertSection}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="warning-outline" size={20} color={theme.colors.warning} />
                  <Text style={styles.sectionTitle}>Estoque critico</Text>
                </View>
                {produtosEmAlerta.slice(0, 3).map((produto) => (
                  <View key={produto.id} style={styles.alertItem}>
                    <Text style={styles.alertName}>{produto.nome}</Text>
                    <Text style={styles.alertStock}>
                      {produto.estoque} un. / min. {produto.estoqueMinimo}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>Produtos recentes</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ProdutoItem({ produto }: { produto: Produto }) {
  const status = obterStatusEstoque(produto);
  const statusStyle = statusConfig[status];

  return (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Text style={styles.productInitials}>{produto.imagem}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{produto.nome}</Text>
        <Text style={styles.productCategory}>{produto.categoria}</Text>
        <Text style={styles.productPrice}>{formatCurrency.format(produto.preco)}</Text>
      </View>
      <View style={styles.productMeta}>
        <Text style={styles.stockText}>{produto.estoque} un.</Text>
        <View style={[styles.badge, { backgroundColor: statusStyle.background }]}>
          <Text style={[styles.badgeText, { color: statusStyle.color }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  headerContent: {
    gap: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: '800',
  },
  date: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    textTransform: 'capitalize',
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  summaryCard: {
    width: '47.7%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '800',
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  alertSection: {
    backgroundColor: theme.colors.warningLight,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    gap: theme.spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: '800',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  alertName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
  },
  alertStock: {
    color: theme.colors.warning,
    fontSize: theme.fontSizes.xs,
    fontWeight: '800',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInitials: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: theme.fontSizes.md,
  },
  productInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  productName: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: '800',
  },
  productCategory: {
    color: theme.colors.muted,
    fontSize: theme.fontSizes.sm,
  },
  productPrice: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '800',
  },
  productMeta: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  stockText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
    fontWeight: '800',
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
});
