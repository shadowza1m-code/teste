/**
 * Tipos TypeScript para Orientador (US02)
 * Baseado no Contrato de Dados - US02
 */

export interface OrientadorInput {
  nome: string;
  email: string;
  departamento?: string;
  linhasDePesquisa: string[];
  vagasDisponiveis: number;
  biografia?: string;
}

export interface Orientador extends OrientadorInput {
  id: number;
  ativo: boolean;
  criadoEm?: string;
}

export interface ErroValidacaoCampo {
  campo: string;
  mensagem: string;
}

export interface RespostaErroPadrao {
  timestamp: string;
  status: number;
  erro: string;
  caminho: string;
  detalhes?: ErroValidacaoCampo[] | string;
}

export interface EstadoFormulario {
  loading: boolean;
  erro: string | null;
  sucesso: boolean;
}
