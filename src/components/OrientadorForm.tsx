/**
 * Componente: Formulário de Cadastro/Edição de Perfil de Orientador
 * US02 - Cadastro de Perfil de Orientador e Vagas
 */

import React, { useState } from 'react';
import { OrientadorInput, Orientador, EstadoFormulario } from '../types/orientador';
import { cadastrarOrientador, atualizarOrientador } from '../services/orientadorService';

interface OrientadorFormProps {
  orientador?: Orientador;
  onSucesso: (orientador: Orientador) => void;
  onErro: (erro: string) => void;
}

interface ErrosValidacao {
  [key: string]: string;
}

export const OrientadorForm: React.FC<OrientadorFormProps> = ({
  orientador,
  onSucesso,
  onErro,
}) => {
  const [formData, setFormData] = useState<OrientadorInput>({
    nome: orientador?.nome || '',
    email: orientador?.email || '',
    departamento: orientador?.departamento || '',
    linhasDePesquisa: orientador?.linhasDePesquisa || [],
    vagasDisponiveis: orientador?.vagasDisponiveis || 0,
    biografia: orientador?.biografia || '',
  });

  const [estado, setEstado] = useState<EstadoFormulario>({
    loading: false,
    erro: null,
    sucesso: false,
  });

  const [errosValidacao, setErrosValidacao] = useState<ErrosValidacao>({});
  const [novaLinha, setNovaLinha] = useState('');

  const validarFormulario = (): boolean => {
    const erros: ErrosValidacao = {};

    if (!formData.nome.trim()) {
      erros.nome = 'O nome é obrigatório';
    } else if (formData.nome.length < 3 || formData.nome.length > 100) {
      erros.nome = 'O nome deve ter entre 3 e 100 caracteres';
    }

    if (!formData.email.trim()) {
      erros.email = 'O e-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      erros.email = 'Formato de e-mail inválido';
    }

    // Validação: Departamento máximo 100 caracteres
    if (formData.departamento && formData.departamento.length > 100) {
      erros.departamento = 'O departamento deve ter no máximo 100 caracteres';
    }

    // Validação crítica: Vagas não podem ser negativas (Cenário 2)
    if (formData.vagasDisponiveis < 0) {
      erros.vagasDisponiveis = 'O número de vagas deve ser maior ou igual a zero';
    }

    // Validação: Biografia máximo 500 caracteres
    if (formData.biografia && formData.biografia.length > 500) {
      erros.biografia = 'A biografia deve ter no máximo 500 caracteres';
    }

    if (formData.linhasDePesquisa.length === 0) {
      erros.linhasDePesquisa = 'Informe ao menos uma linha de pesquisa';
    }

    setErrosValidacao(erros);
    return Object.keys(erros).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const novoValor = name === 'vagasDisponiveis' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: novoValor,
    }));

    // Limpar erro deste campo ao editar
    if (errosValidacao[name]) {
      setErrosValidacao(prev => {
        const novosErros = { ...prev };
        delete novosErros[name];
        return novosErros;
      });
    }
  };

  const handleAdicionarLinha = () => {
    if (novaLinha.trim()) {
      if (novaLinha.length < 2 || novaLinha.length > 80) {
        setErrosValidacao(prev => ({
          ...prev,
          novaLinha: 'A linha deve ter entre 2 e 80 caracteres',
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        linhasDePesquisa: [...prev.linhasDePesquisa, novaLinha.trim()],
      }));
      setNovaLinha('');
      setErrosValidacao(prev => {
        const novosErros = { ...prev };
        delete novosErros.linhasDePesquisa;
        delete novosErros.novaLinha;
        return novosErros;
      });
    }
  };

  const handleRemoverLinha = (index: number) => {
    setFormData(prev => ({
      ...prev,
      linhasDePesquisa: prev.linhasDePesquisa.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validarFormulario()) {
      setEstado({ loading: false, erro: 'Corrija os erros do formulário', sucesso: false });
      return;
    }

    setEstado({ loading: true, erro: null, sucesso: false });

    try {
      let resultado: Orientador;

      if (orientador) {
        resultado = await atualizarOrientador(orientador.id, formData);
      } else {
        resultado = await cadastrarOrientador(formData);
      }

      setEstado({ loading: false, erro: null, sucesso: true });
      onSucesso(resultado);
      
      // Limpar formulário se for novo cadastro
      if (!orientador) {
        setFormData({
          nome: '',
          email: '',
          departamento: '',
          linhasDePesquisa: [],
          vagasDisponiveis: 0,
          biografia: '',
        });
      }
    } catch (erro: any) {
      const mensagem = erro.message || 'Erro ao processar formulário';
      setEstado({ loading: false, erro: mensagem, sucesso: false });
      onErro(mensagem);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="orientador-form">
      <h2>{orientador ? 'Editar Perfil' : 'Cadastrar Novo Orientador'}</h2>

      {/* Estados de feedback */}
      {estado.loading && <div className="feedback loading">Processando...</div>}
      {estado.erro && <div className="feedback erro">{estado.erro}</div>}
      {estado.sucesso && <div className="feedback sucesso">Operação realizada com sucesso!</div>}

      {/* Campos do formulário */}
      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Dr. Adriano Lima"
          required
          disabled={estado.loading}
          className={errosValidacao.nome ? 'input-erro' : ''}
        />
        {errosValidacao.nome && <span className="erro-texto">{errosValidacao.nome}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="adriano.lima@ifsc.edu.br"
          required
          disabled={estado.loading}
          className={errosValidacao.email ? 'input-erro' : ''}
        />
        {errosValidacao.email && <span className="erro-texto">{errosValidacao.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="departamento">Departamento</label>
        <input
          id="departamento"
          name="departamento"
          type="text"
          value={formData.departamento}
          onChange={handleInputChange}
          placeholder="DAE - Câmpus São José"
          disabled={estado.loading}
          className={errosValidacao.departamento ? 'input-erro' : ''}
        />
        {errosValidacao.departamento && (
          <span className="erro-texto">{errosValidacao.departamento}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="vagasDisponiveis">Vagas Disponíveis *</label>
        <input
          id="vagasDisponiveis"
          name="vagasDisponiveis"
          type="number"
          min="0"
          value={formData.vagasDisponiveis}
          onChange={handleInputChange}
          required
          disabled={estado.loading}
          className={errosValidacao.vagasDisponiveis ? 'input-erro' : ''}
        />
        {errosValidacao.vagasDisponiveis && (
          <span className="erro-texto">{errosValidacao.vagasDisponiveis}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="biografia">Biografia</label>
        <textarea
          id="biografia"
          name="biografia"
          value={formData.biografia}
          onChange={handleInputChange}
          placeholder="Descreva sua experiência e áreas de pesquisa..."
          rows={4}
          disabled={estado.loading}
          className={errosValidacao.biografia ? 'input-erro' : ''}
        />
        {errosValidacao.biografia && (
          <span className="erro-texto">{errosValidacao.biografia}</span>
        )}
      </div>

      {/* Linhas de Pesquisa */}
      <div className="form-group">
        <label>Linhas de Pesquisa *</label>
        <div className="linhas-input">
          <input
            type="text"
            value={novaLinha}
            onChange={(e) => setNovaLinha(e.target.value)}
            placeholder="Digite uma linha de pesquisa"
            disabled={estado.loading}
            className={errosValidacao.novaLinha ? 'input-erro' : ''}
          />
          <button
            type="button"
            onClick={handleAdicionarLinha}
            disabled={estado.loading || !novaLinha.trim()}
          >
            Adicionar
          </button>
        </div>
        {errosValidacao.novaLinha && <span className="erro-texto">{errosValidacao.novaLinha}</span>}

        <ul className="linhas-lista">
          {formData.linhasDePesquisa.map((linha, index) => (
            <li key={index}>
              {linha}
              <button
                type="button"
                onClick={() => handleRemoverLinha(index)}
                disabled={estado.loading}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {errosValidacao.linhasDePesquisa && (
          <span className="erro-texto">{errosValidacao.linhasDePesquisa}</span>
        )}
      </div>

      <button type="submit" disabled={estado.loading}>
        {estado.loading ? 'Salvando...' : orientador ? 'Atualizar' : 'Cadastrar'}
      </button>
    </form>
  );
};
