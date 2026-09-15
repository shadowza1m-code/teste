/**
 * Página: Edição do Perfil de Orientador
 * Segunda página - Professor autenticado edita seu perfil
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrientadorForm } from '../components/OrientadorForm';
import { Orientador } from '../types/orientador';
import { obterOrientador } from '../services/orientadorService';

const perfilDeTeste: Orientador = {
  id: 1,
  nome: 'Dr. Adriano Lima',
  email: 'adriano.lima@ifsc.edu.br',
  departamento: 'DAE - Câmpus São José',
  linhasDePesquisa: ['Engenharia de Software', 'Qualidade de Software'],
  vagasDisponiveis: 3,
  biografia: 'Professor com foco em processos de software, métricas e metodologias ágeis.',
  ativo: true,
  criadoEm: '2026-09-11T09:30:00Z',
};

export const OrientadorEdicaoPage: React.FC = () => {
  const navigate = useNavigate();
  const [orientador, setOrientador] = useState<Orientador | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Verificar se professor está autenticado
    const orientadorId = localStorage.getItem('orientadorId');
    if (!orientadorId) {
      setErro('Você não está autenticado. Faça o cadastro primeiro.');
      setCarregando(false);
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // Carregar dados do professor
    const carregarPerfil = async () => {
      try {
        const dados = await obterOrientador(parseInt(orientadorId));
        setOrientador(dados);
        setCarregando(false);
      } catch {
        setOrientador({ ...perfilDeTeste, id: parseInt(orientadorId) });
        setMensagem('Backend indisponível. Perfil de teste carregado.');
        setCarregando(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleSucesso = (orientadorAtualizado: Orientador) => {
    setOrientador(orientadorAtualizado);
    setMensagem('Perfil atualizado com sucesso!');
    setTimeout(() => setMensagem(''), 3000);
  };

  const handleErro = (erro: string) => {
    setMensagem(`Erro: ${erro}`);
    setTimeout(() => setMensagem(''), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('orientadorId');
    localStorage.removeItem('orientadorNome');
    navigate('/');
  };

  if (carregando) {
    return (
      <div className="orientador-page">
        <header className="page-header">
          <h1>Carregando...</h1>
        </header>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="orientador-page">
        <header className="page-header">
          <h1>Erro</h1>
        </header>
        <main className="page-content">
          <div className="feedback erro">{erro}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="orientador-page">
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Meu Perfil de Orientador</h1>
            <p>Atualize suas informações, linhas de pesquisa e vagas disponíveis</p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={() => navigate('/orientadores')}>
              Listagem
            </button>
            <button type="button" onClick={handleLogout}>Sair</button>
          </div>
        </div>
        <nav className="page-navigation" aria-label="Navegação principal">
          <button type="button" onClick={() => navigate('/')}>Novo cadastro</button>
          <button type="button" onClick={() => navigate('/orientadores')}>
            Listagem de orientadores
          </button>
          <button type="button" className="active">Meu perfil</button>
        </nav>
      </header>

      {mensagem && <div className="notificacao">{mensagem}</div>}

      <main className="page-content">
        {orientador && (
          <OrientadorForm
            orientador={orientador}
            onSucesso={handleSucesso}
            onErro={handleErro}
          />
        )}
      </main>
    </div>
  );
};
