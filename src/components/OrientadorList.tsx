/**
 * Componente: Listagem de Orientadores (Catálogo/Vitrine)
 * US02 - Visualização de perfis disponíveis
 */

import React, { useState, useEffect } from 'react';
import { Orientador, EstadoFormulario } from '../types/orientador';
import { listarOrientadores } from '../services/orientadorService';

interface OrientadorListProps {
  onSelecionarOrientador?: (orientador: Orientador) => void;
}

export const OrientadorList: React.FC<OrientadorListProps> = ({ onSelecionarOrientador }) => {
  const [orientadores, setOrientadores] = useState<Orientador[]>([]);
  const [estado, setEstado] = useState<EstadoFormulario>({
    loading: true,
    erro: null,
    sucesso: false,
  });
  const [filtroArea, setFiltroArea] = useState('');

  useEffect(() => {
    carregarOrientadores();
  }, []);

  const carregarOrientadores = async (area?: string) => {
    setEstado({ loading: true, erro: null, sucesso: false });
    try {
      const dados = await listarOrientadores(area);
      setOrientadores(dados);
      setEstado({ loading: false, erro: null, sucesso: true });
    } catch (erro: any) {
      setEstado({
        loading: false,
        erro: 'Erro ao carregar orientadores',
        sucesso: false,
      });
    }
  };

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    carregarOrientadores(filtroArea || undefined);
  };

  return (
    <div className="orientador-list">
      <h2>Catálogo de Orientadores</h2>

      {/* Filtro */}
      <form onSubmit={handleFiltrar} className="filtro-form">
        <input
          type="text"
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          placeholder="Filtrar por área de pesquisa..."
        />
        <button type="submit">Filtrar</button>
      </form>

      {/* Estados de feedback */}
      {estado.loading && <div className="feedback loading">Carregando orientadores...</div>}
      {estado.erro && <div className="feedback erro">{estado.erro}</div>}

      {/* Lista de Orientadores */}
      {!estado.loading && orientadores.length > 0 ? (
        <div className="cards-container">
          {orientadores.map((orientador) => (
            <div key={orientador.id} className="orientador-card">
              <h3>{orientador.nome}</h3>
              <p className="email">{orientador.email}</p>
              <p className="departamento">{orientador.departamento}</p>

              <div className="vagas">
                <strong>Vagas Disponíveis:</strong> {orientador.vagasDisponiveis}
              </div>

              <div className="linhas-pesquisa">
                <strong>Áreas de Pesquisa:</strong>
                <ul>
                  {orientador.linhasDePesquisa.map((linha, idx) => (
                    <li key={idx}>{linha}</li>
                  ))}
                </ul>
              </div>

              {orientador.biografia && (
                <p className="biografia">{orientador.biografia}</p>
              )}

              {onSelecionarOrientador && (
                <button onClick={() => onSelecionarOrientador(orientador)}>
                  Selecionar
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !estado.loading && <p className="vazio">Nenhum orientador encontrado.</p>
      )}
    </div>
  );
};
