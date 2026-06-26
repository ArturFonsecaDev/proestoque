import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import { PRODUTOS_MOCK, type Produto } from '@/data/mockData';
import type { ProdutoFormData } from '@/schemas/produtoSchema';

type ProductsState = {
  produtos: Produto[];
};

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

export type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
};

const PRODUCTS_STORAGE_KEY = '@ProEstoque:produtos';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return { produtos: action.payload };
    case 'ADD':
      return { produtos: [action.payload, ...state.produtos] };
    case 'UPDATE':
      return {
        produtos: state.produtos.map((produto) =>
          produto.id === action.payload.id ? action.payload : produto,
        ),
      };
    case 'DELETE':
      return { produtos: state.produtos.filter((produto) => produto.id !== action.payload) };
    default:
      return state;
  }
}

type ProductsProviderProps = {
  children: ReactNode;
};

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [state, dispatch] = useReducer(productsReducer, { produtos: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const produtos = storedProducts ? (JSON.parse(storedProducts) as Produto[]) : PRODUTOS_MOCK;

        dispatch({ type: 'LOAD', payload: produtos });

        if (!storedProducts) {
          await persistProducts(produtos);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function persistProducts(produtos: Produto[]) {
    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(produtos));
  }

  async function adicionarProduto(data: ProdutoFormData) {
    const produto: Produto = {
      id: Date.now().toString(),
      nome: data.nome,
      categoria: data.categoria,
      preco: data.preco,
      estoque: data.estoque,
      estoqueMinimo: data.estoqueMinimo,
      imagem: getProdutoInitials(data.nome),
      criadoEm: new Date().toISOString(),
    };
    const nextProducts = [produto, ...state.produtos];

    dispatch({ type: 'ADD', payload: produto });
    await persistProducts(nextProducts);
  }

  async function editarProduto(id: string, data: ProdutoFormData) {
    const currentProduct = state.produtos.find((produto) => produto.id === id);

    if (!currentProduct) {
      return;
    }

    const produtoAtualizado: Produto = {
      ...currentProduct,
      nome: data.nome,
      categoria: data.categoria,
      preco: data.preco,
      estoque: data.estoque,
      estoqueMinimo: data.estoqueMinimo,
      imagem: getProdutoInitials(data.nome),
    };
    const nextProducts = state.produtos.map((produto) =>
      produto.id === id ? produtoAtualizado : produto,
    );

    dispatch({ type: 'UPDATE', payload: produtoAtualizado });
    await persistProducts(nextProducts);
  }

  async function excluirProduto(id: string) {
    const nextProducts = state.produtos.filter((produto) => produto.id !== id);

    dispatch({ type: 'DELETE', payload: id });
    await persistProducts(nextProducts);
  }

  function buscarProdutoPorId(id: string) {
    return state.produtos.find((produto) => produto.id === id);
  }

  const value = useMemo<ProductsContextType>(
    () => ({
      produtos: state.produtos,
      isLoading,
      adicionarProduto,
      editarProduto,
      excluirProduto,
      buscarProdutoPorId,
    }),
    [state.produtos, isLoading],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts deve ser usado dentro de ProductsProvider');
  }

  return context;
}

function getProdutoInitials(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
