import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function FluxoCaixa() {
  useEffect(() => {
    document.title = "HortiFruti — Fluxo de Caixa";
  }, []);

  const { caixa, setCaixa, setHistorico, historico, formatBRL } = useContext(AppContext);
  const [inputSaldo, setInputSaldo] = useState('');

  const abrirCaixa = (e) => {
    e.preventDefault();
    setCaixa({ aberto: true, saldoInicial: parseFloat(inputSaldo) || 0, transacoes: [] });
  };

  const fecharCaixa = () => {
    if (window.confirm('Deseja fechar o caixa de hoje? Os dados serão salvos no histórico geral.')) {
      setHistorico([...historico, ...caixa.transacoes]);
      setCaixa({ aberto: false, saldoInicial: 0, transacoes: [] });
    }
  };

  if (!caixa.aberto) {
    return (
      <>
        <h2 className="page-title">Fluxo de Caixa</h2>
        <div className="form-panel">
          <h3 className="form-panel-title">Abrir caixa</h3>
          <label className="form-label" htmlFor="saldo-inicial">Saldo Inicial (R$)</label>
          <input
            className="form-input" id="saldo-inicial" type="number" min="0" step="0.01"
            placeholder="Digite o saldo inicial" value={inputSaldo} onChange={(e) => setInputSaldo(e.target.value)}
          />
          <button onClick={abrirCaixa} className="btn btn-verde btn-full">🏪 Abrir caixa</button>
        </div>
      </>
    );
  }

  const receitas = caixa.transacoes.reduce((acc, t) => t.tipo === 'receita' ? acc + t.valor : acc, 0);
  const despesas = caixa.transacoes.reduce((acc, t) => t.tipo === 'despesa' ? acc + t.valor : acc, 0);

  return (
    <>
      <h2 className="page-title">Caixa Aberto</h2>
      <div className="card-grid-3">
        <div className="card"><p className="card-title">Saldo Inicial</p><p className="card-value">{formatBRL(caixa.saldoInicial)}</p></div>
        <div className="card"><p className="card-title">Receitas</p><p className="card-value">{formatBRL(receitas)}</p></div>
        <div className="card card-vermelho"><p className="card-title">Despesas</p><p className="card-value">{formatBRL(despesas)}</p></div>
      </div>

      <div className="acoes-row">
        <Link to="/novo-lancamento" className="btn btn-verde-claro">+ Novo lançamento</Link>
        <button onClick={fecharCaixa} className="btn btn-vermelho">Fechar caixa</button>
      </div>

      <div className="transacoes-box">
        {caixa.transacoes.length === 0 ? (
          <p className="transacoes-vazio">Nenhuma transação registrada ainda.</p>
        ) : (
          caixa.transacoes.map((t, index) => (
            <div key={index} className="transacao-item">
              <span>{t.descricao}</span>
              <span className={t.tipo === 'receita' ? 'transacao-receita' : 'transacao-despesa'}>
                {t.tipo === 'receita' ? '+' : '-'} {formatBRL(t.valor)}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}