import { router, type Href } from 'expo-router';
import { useState } from 'react';

import { ProductForm } from '@/components/ProductForm';
import { useProducts } from '@/contexts/ProductsContext';
import type { ProdutoFormData } from '@/schemas/produtoSchema';

export default function NovoProdutoScreen() {
  const [loading, setLoading] = useState(false);
  const { adicionarProduto } = useProducts();

  async function handleSubmit(data: ProdutoFormData) {
    setLoading(true);

    try {
      await adicionarProduto(data);
      router.replace('/produtos' as Href);
    } finally {
      setLoading(false);
    }
  }

  return <ProductForm loading={loading} submitLabel="Cadastrar produto" onSubmit={handleSubmit} />;
}
