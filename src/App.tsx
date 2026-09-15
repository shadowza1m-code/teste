/**
 * Componente Raiz da Aplicação
 * Estrutura principal do projeto React com Roteamento
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrientadorCadastroPage } from './pages/OrientadorCadastroPage';
import { OrientadorEdicaoPage } from './pages/OrientadorEdicaoPage';
import { OrientadorListagemPage } from './pages/OrientadorListagemPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<OrientadorCadastroPage />} />
          <Route path="/orientadores" element={<OrientadorListagemPage />} />
          <Route path="/perfil-editar" element={<OrientadorEdicaoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
