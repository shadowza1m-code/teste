/**
 * Serviço de API para Orientador
 * Endpoints conforme Contrato de Dados - US02
 */

import { Orientador, OrientadorInput, RespostaErroPadrao } from '../types/orientador';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Converte erros de rede para mensagens amigáveis em português
 */
function traduzirErro(erro: any): string {
  if (erro instanceof TypeError) {
    if (erro.message.includes('Failed to fetch')) {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
    }
    return 'Erro de conexão com o servidor';
  }
  
  if (erro.status === 409) {
    return 'Este e-mail já está cadastrado no sistema';
  }
  
  if (erro.status === 404) {
    return 'Orientador não encontrado';
  }
  
  if (erro.status === 400) {
    return 'Dados inválidos. Verifique os campos do formulário';
  }
  
  return erro.message || 'Erro ao processar a requisição';
}

/**
 * POST /api/v1/orientadores
 * Cadastra um novo perfil de professor orientador
 */
export async function cadastrarOrientador(dados: OrientadorInput): Promise<Orientador> {
  try {
    const response = await fetch(`${API_BASE_URL}/orientadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro: RespostaErroPadrao = await response.json();
      throw new ApiError(response.status, erro.erro);
    }

    return response.json();
  } catch (erro: any) {
    const mensagem = traduzirErro(erro);
    throw new Error(mensagem);
  }
}

/**
 * GET /api/v1/orientadores
 * Lista todos os orientadores cadastrados
 */
export async function listarOrientadores(area?: string): Promise<Orientador[]> {
  try {
    const url = new URL(`${API_BASE_URL}/orientadores`);
    if (area) url.searchParams.append('area', area);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Erro ao listar orientadores');
    }

    return response.json();
  } catch (erro: any) {
    const mensagem = traduzirErro(erro);
    throw new Error(mensagem);
  }
}

/**
 * GET /api/v1/orientadores/{id}
 * Recupera dados detalhados de um orientador específico
 */
export async function obterOrientador(id: number): Promise<Orientador> {
  try {
    const response = await fetch(`${API_BASE_URL}/orientadores/${id}`);

    if (!response.ok) {
      throw new Error('Orientador não encontrado');
    }

    return response.json();
  } catch (erro: any) {
    const mensagem = traduzirErro(erro);
    throw new Error(mensagem);
  }
}

/**
 * PATCH /api/v1/orientadores/{id}
 * Atualiza dados cadastrais, linhas de pesquisa e vagas de um orientador
 */
export async function atualizarOrientador(id: number, dados: Partial<OrientadorInput>): Promise<Orientador> {
  try {
    const response = await fetch(`${API_BASE_URL}/orientadores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro: RespostaErroPadrao = await response.json();
      throw new ApiError(response.status, erro.erro);
    }

    return response.json();
  } catch (erro: any) {
    const mensagem = traduzirErro(erro);
    throw new Error(mensagem);
  }
}

/**
 * DELETE /api/v1/orientadores/{id}
 * Remove ou desativa o cadastro de um orientador
 */
export async function deletarOrientador(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/orientadores/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar orientador');
    }
  } catch (erro: any) {
    const mensagem = traduzirErro(erro);
    throw new Error(mensagem);
  }
}
