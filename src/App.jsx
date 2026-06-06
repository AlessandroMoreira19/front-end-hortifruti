import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Home from './pages/Home';
import Painel from './pages/Painel';
import FluxoCaixa from './pages/FluxoCaixa';
import NovoLancamento from './pages/NovoLancamento';
import Relatorios from './pages/Relatorios';
import Impressao from './pages/Impressao';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<MainLayout />}>
            <Route path="/painel" element={<Painel />} />
            <Route path="/fluxo" element={<FluxoCaixa />} />
            <Route path="/novo-lancamento" element={<NovoLancamento />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/impressao" element={<Impressao />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;