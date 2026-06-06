import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [caixa, setCaixa] = useState(() => {
    const saved = localStorage.getItem('hortifruti_caixa');
    return saved ? JSON.parse(saved) : { aberto: false, saldoInicial: 0, transacoes: [] };
  });

  const [historico, setHistorico] = useState(() => {
    const saved = localStorage.getItem('hortifruti_historico');
    return saved ? JSON.parse(saved) : [];
  });

  const [filtro, setFiltro] = useState(() => {
    const saved = localStorage.getItem('hortifruti_filtro');
    return saved ? JSON.parse(saved) : { tipo: 'fluxo', inicio: '', fim: '' };
  });

  useEffect(() => {
    localStorage.setItem('hortifruti_caixa', JSON.stringify(caixa));
  }, [caixa]);

  useEffect(() => {
    localStorage.setItem('hortifruti_historico', JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    localStorage.setItem('hortifruti_filtro', JSON.stringify(filtro));
  }, [filtro]);

  const formatBRL = (valor) => `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;

  return (
    <AppContext.Provider value={{ caixa, setCaixa, historico, setHistorico, filtro, setFiltro, formatBRL }}>
      {children}
    </AppContext.Provider>
  );
};