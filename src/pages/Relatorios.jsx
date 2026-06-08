import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Relatorios() {
  useEffect(() => {
    document.title = "HortiFruti — Relatórios";
  }, []);
  const { filtro, setFiltro } = useContext(AppContext);
  const navigate = useNavigate();
  const [localFiltro, setLocalFiltro] = useState(filtro);

  const gerar = (e) => {
    e.preventDefault();
    setFiltro(localFiltro);
    navigate('/impressao');
  };

  return (
    <>
      <h2 className="page-title">Relatórios</h2>
      <div className="relatorio-panel">
        <h3 className="relatorio-panel-title">Configurar Relatório</h3>
        <div className="relatorio-row">
          <div className="relatorio-field">
            <label className="form-label" htmlFor="tipo-relatorio">Tipo de Relatório</label>
            <select className="select-input" id="tipo-relatorio" value={localFiltro.tipo} onChange={(e) => setLocalFiltro({...localFiltro, tipo: e.target.value})}>
              <option value="fluxo">Fluxo de caixa</option>
              <option value="receitas">Receitas</option>
              <option value="despesas">Despesas</option>
            </select>
          </div>
          <div className="relatorio-field">
            <label className="form-label" htmlFor="data-inicio">Data de Início</label>
            <input className="date-input" id="data-inicio" type="date" value={localFiltro.inicio} onChange={(e) => setLocalFiltro({...localFiltro, inicio: e.target.value})} />
          </div>
          <div className="relatorio-field">
            <label className="form-label" htmlFor="data-fim">Data de Término</label>
            <input className="date-input" id="data-fim" type="date" value={localFiltro.fim} onChange={(e) => setLocalFiltro({...localFiltro, fim: e.target.value})} />
          </div>
          <div className="relatorio-field">
            <label className="form-label label-hidden">Ação</label>
            <button onClick={gerar} className="btn btn-verde-claro btn-rounded-sm">📄 Gerar</button>
          </div>
        </div>
      </div>
    </>
  );
}