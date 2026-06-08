import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Importamos o Link aqui

export default function Sidebar() {
  return (
    <aside className="sidebar">
      
      {/* Transformamos a div em um Link que aponta para a Home ("/") */}
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
        <span className="leaf">🌿</span>
        <h1>HortiFruti</h1>
      </Link>

      <NavLink to="/painel" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">▦</span> Painel
      </NavLink>
      
      <NavLink to="/fluxo" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">💰</span> Fluxo de Caixa
      </NavLink>
      
      <NavLink to="/relatorios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">📋</span> Relatórios
      </NavLink>
      
    </aside>
  );
}