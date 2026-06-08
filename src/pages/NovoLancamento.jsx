import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function NovoLancamento() {
  useEffect(() => {
      document.title = "HortiFruti — Novo Lançamento";
    }, []);
  const { caixa, setCaixa } = useContext(AppContext);
  const navigate = useNavigate();
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('receita');
  const [descricao, setDescricao] = useState('');

  const lancar = (e) => {
    e.preventDefault();
    const val = parseFloat(valor);
    if (!val || val <= 0) return alert('Por favor, digite um valor maior que zero.');

    const agora = new Date();
    const novaTransacao = {
      data: agora.toLocaleDateString('pt-BR'),
      dataIso: agora.toISOString().split('T')[0],
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tipo,
      descricao: descricao.trim() || 'Lançamento sem descrição',
      valor: val
    };

    setCaixa({ ...caixa, transacoes: [...caixa.transacoes, novaTransacao] });
    navigate('/fluxo');
  };

  return (
    <>
      <div className="form-panel w-660">
        <h3 className="form-panel-title">Novo Lançamento</h3>
        
        <label className="form-label" htmlFor="tipo-lancamento">Tipo de Lançamento</label>
        <select className="form-input" id="tipo-lancamento" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita (Entrada)</option>
          <option value="despesa">Despesa (Saída)</option>
        </select>

        <label className="form-label" htmlFor="desc-lancamento">Descrição</label>
        <input className="form-input" id="desc-lancamento" type="text" placeholder="Ex: Venda de maçãs" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <label className="form-label" htmlFor="valor">Novo valor (R$)</label>
        <input className="form-input" id="valor" type="number" min="0" step="0.01" placeholder="Digite o valor a ser lançado:" value={valor} onChange={(e) => setValor(e.target.value)} />

        <button onClick={lancar} className="btn btn-verde btn-full" style={{ marginTop: '20px' }}>💵 Lançar</button>
      </div>
    </>
  );
}