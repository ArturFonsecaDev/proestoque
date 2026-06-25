export type Categoria = {
  id: string;
  nome: string;
};

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  imagem?: string;
  criadoEm: string;
};

export type StatusEstoque = 'normal' | 'baixo' | 'sem-estoque';

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: 'alimentos', nome: 'Alimentos' },
  { id: 'bebidas', nome: 'Bebidas' },
  { id: 'limpeza', nome: 'Limpeza' },
  { id: 'higiene', nome: 'Higiene' },
  { id: 'mercearia', nome: 'Mercearia' },
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Arroz Tipo 1 5kg',
    categoria: 'Alimentos',
    preco: 28.9,
    estoque: 24,
    estoqueMinimo: 8,
    imagem: 'AR',
    criadoEm: '2026-06-23',
  },
  {
    id: '2',
    nome: 'Feijao Carioca 1kg',
    categoria: 'Alimentos',
    preco: 8.49,
    estoque: 5,
    estoqueMinimo: 10,
    imagem: 'FE',
    criadoEm: '2026-06-22',
  },
  {
    id: '3',
    nome: 'Cafe Tradicional 500g',
    categoria: 'Mercearia',
    preco: 19.99,
    estoque: 13,
    estoqueMinimo: 6,
    imagem: 'CA',
    criadoEm: '2026-06-21',
  },
  {
    id: '4',
    nome: 'Acucar Cristal 2kg',
    categoria: 'Mercearia',
    preco: 7.9,
    estoque: 0,
    estoqueMinimo: 7,
    imagem: 'AC',
    criadoEm: '2026-06-20',
  },
  {
    id: '5',
    nome: 'Refrigerante Cola 2L',
    categoria: 'Bebidas',
    preco: 9.99,
    estoque: 18,
    estoqueMinimo: 12,
    imagem: 'RC',
    criadoEm: '2026-06-19',
  },
  {
    id: '6',
    nome: 'Agua Mineral 500ml',
    categoria: 'Bebidas',
    preco: 2.5,
    estoque: 42,
    estoqueMinimo: 20,
    imagem: 'AG',
    criadoEm: '2026-06-18',
  },
  {
    id: '7',
    nome: 'Detergente Neutro 500ml',
    categoria: 'Limpeza',
    preco: 3.25,
    estoque: 4,
    estoqueMinimo: 9,
    imagem: 'DE',
    criadoEm: '2026-06-17',
  },
  {
    id: '8',
    nome: 'Sabonete Hidratante',
    categoria: 'Higiene',
    preco: 4.75,
    estoque: 31,
    estoqueMinimo: 10,
    imagem: 'SA',
    criadoEm: '2026-06-16',
  },
  {
    id: '9',
    nome: 'Papel Higienico 12 rolos',
    categoria: 'Higiene',
    preco: 22.9,
    estoque: 9,
    estoqueMinimo: 10,
    imagem: 'PH',
    criadoEm: '2026-06-15',
  },
];

export function obterStatusEstoque(produto: Produto): StatusEstoque {
  if (produto.estoque === 0) {
    return 'sem-estoque';
  }

  if (produto.estoque <= produto.estoqueMinimo) {
    return 'baixo';
  }

  return 'normal';
}
