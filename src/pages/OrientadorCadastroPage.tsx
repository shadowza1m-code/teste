/**
 * Página: Cadastro de Novo Orientador
 * Primeira página - Professor novo se registra
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrientadorForm } from '../components/OrientadorForm';
import { Orientador } from '../types/orientador';

export const OrientadorCadastroPage: React.FC = () => {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');

  const handleSucesso = (orientador: Orientador) => {
    // Salvar ID do professor no localStorage (simular autenticação)
    localStorage.setItem('orientadorId', orientador.id.toString());
    localStorage.setItem('orientadorNome', orientador.nome);
    
    setMensagem(`Bem-vindo, ${orientador.nome}! Redirecionando para seu perfil...`);
    
    // Redirecionar para página de edição após 1.5 segundos
    setTimeout(() => {
      navigate('/perfil-editar');
    }, 1500);
  };

  const handleErro = (erro: string) => {
    setMensagem(`Erro: ${erro}`);
    setTimeout(() => setMensagem(''), 5000);
  };

  return (
    <div className="orientador-page">
      <header className="page-header">
        <h1>Sistema de Gestão de TCC</h1>
        <p>US02: Cadastro de Perfil de Orientador e Vagas</p>
        <nav className="page-navigation" aria-label="Navegação principal">
          <button type="button" className="active">Novo cadastro</button>
          <button type="button" onClick={() => navigate('/orientadores')}>
            Listagem de orientadores
          </button>
          <button type="button" onClick={() => navigate('/perfil-editar')}>
            Meu perfil
          </button>
        </nav>
      </header>

      {mensagem && <div className="notificacao">{mensagem}</div>}

      <main className="page-content">
        <OrientadorForm
          onSucesso={handleSucesso}
          onErro={handleErro}
        />
      </main>
    </div>
  );
};
