import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    document.title = "HortiFruti — Home";
  }, []);

  return (
    <div className="tela-inicial">
      <div className="inicial-logo">
        <span className="leaf">🌿</span>
        <h1>HortiFruti</h1>
      </div>
      <nav className="menu-inicial">
        <Link to="/painel" className="menu-btn"><span className="icon">▦</span> Painel</Link>
        <Link to="/fluxo" className="menu-btn"><span className="icon">💰</span> Fluxo de Caixa</Link>
        <Link to="/relatorios" className="menu-btn"><span className="icon">📋</span> Relatórios</Link>
      </nav>
    </div>
  );
}