import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { theme } from '@/constants/theme';
import { produtoSchema, type ProdutoFormData } from '@/schemas/produtoSchema';

type ProductFormValues = {
  nome: string;
  categoria: string;
  preco: string;
  estoque: string;
  estoqueMinimo: string;
};

type ProductFormInput = {
  nome: string;
  categoria: string;
  preco: unknown;
  estoque: unknown;
  estoqueMinimo: unknown;
};

type ProductFormProps = {
  defaultValues?: Partial<ProdutoFormData>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (data: ProdutoFormData) => void | Promise<void>;
};

const defaultFormValues: ProductFormValues = {
  nome: '',
  categoria: '',
  preco: '',
  estoque: '',
  estoqueMinimo: '',
};

function toFormValues(defaultValues?: Partial<ProdutoFormData>): ProductFormValues {
  return {
    nome: defaultValues?.nome ?? '',
    categoria: defaultValues?.categoria ?? '',
    preco: defaultValues?.preco === undefined ? '' : String(defaultValues.preco),
    estoque: defaultValues?.estoque === undefined ? '' : String(defaultValues.estoque),
    estoqueMinimo:
      defaultValues?.estoqueMinimo === undefined ? '' : String(defaultValues.estoqueMinimo),
  };
}

export function ProductForm({
  defaultValues,
  submitLabel,
  loading = false,
  onSubmit,
}: ProductFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: toFormValues(defaultValues),
  });

  useEffect(() => {
    reset(toFormValues(defaultValues));
  }, [defaultValues, reset]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.nome?.message}
                icon="cube-outline"
                label="Nome do produto"
                onChangeText={onChange}
                placeholder="Ex: Arroz Tipo 1 5kg"
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="categoria"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.categoria?.message}
                icon="albums-outline"
                label="Categoria"
                onChangeText={onChange}
                placeholder="Ex: Alimentos"
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="preco"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.preco?.message}
                icon="cash-outline"
                keyboardType="decimal-pad"
                label="Preco"
                onChangeText={onChange}
                placeholder="Ex: 19.90"
                value={String(value)}
              />
            )}
          />

          <Controller
            control={control}
            name="estoque"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.estoque?.message}
                icon="layers-outline"
                keyboardType="number-pad"
                label="Estoque atual"
                onChangeText={onChange}
                placeholder="Ex: 20"
                value={String(value)}
              />
            )}
          />

          <Controller
            control={control}
            name="estoqueMinimo"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.estoqueMinimo?.message}
                icon="alert-circle-outline"
                keyboardType="number-pad"
                label="Estoque minimo"
                onChangeText={onChange}
                placeholder="Ex: 5"
                value={String(value)}
              />
            )}
          />

          <Button
            fullWidth
            loading={loading}
            title={submitLabel}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});
