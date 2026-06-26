import { z } from 'zod';

const numberFromInput = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === 'string') {
        return Number(value.replace(',', '.'));
      }

      return value;
    },
    schema,
  );

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Nome e obrigatorio.')
    .min(3, 'Nome deve ter pelo menos 3 caracteres.'),
  categoria: z.string().trim().min(1, 'Categoria e obrigatoria.'),
  preco: numberFromInput(
    z
      .number({ error: 'Preco e obrigatorio.' })
      .positive('Preco deve ser maior que zero.'),
  ),
  estoque: numberFromInput(
    z
      .number({ error: 'Estoque e obrigatorio.' })
      .int('Estoque deve ser um numero inteiro.')
      .nonnegative('Estoque nao pode ser negativo.'),
  ),
  estoqueMinimo: numberFromInput(
    z
      .number({ error: 'Estoque minimo e obrigatorio.' })
      .int('Estoque minimo deve ser um numero inteiro.')
      .nonnegative('Estoque minimo nao pode ser negativo.'),
  ),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
