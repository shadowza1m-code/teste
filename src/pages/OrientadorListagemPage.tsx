/**
 * Página: Listagem de orientadores cadastrados
 * Permite consultar e filtrar os perfis disponíveis.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrientadorList } from '../components/OrientadorList';

export const OrientadorListagemPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="orientador-page">
      <header className="page-header">
        <h1>Sistema de Gestão de TCC</h1>
        <p>Orientadores cadastrados e áreas de pesquisa</p>
        <nav className="page-navigation" aria-label="Navegação principal">
          <button type="button" onClick={() => navigate('/')}>
            Novo cadastro
          </button>
          <button type="button" className="active" onClick={() => navigate('/orientadores')}>
            Listagem de orientadores
          </button>
          <button type="button" onClick={() => navigate('/perfil-editar')}>
            Meu perfil
          </button>
        </nav>
      </header>

      <main className="page-content">
        <OrientadorList />
      </main>
    </div>
  );
};
