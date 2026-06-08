import React, { useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function Painel() {
  useEffect(() => {
    document.title = "HortiFruti — Painel";
  }, []);
  
  const { caixa, historico, formatBRL } = useContext(AppContext);
  const todasTransacoes = [...historico, ...caixa.transacoes];

  let receitas = 0;
  let despesas = 0;
  todasTransacoes.forEach(t => {
    if (t.tipo === 'receita') receitas += t.valor;
    if (t.tipo === 'despesa') despesas += t.valor;
  });

  const saldoAtual = caixa.saldoInicial + receitas - despesas;

  // Processa os dados de todas as transações para o gráfico
  const chartData = useMemo(() => {
    const agrupado = {};
    todasTransacoes.forEach(t => {
      if (!agrupado[t.data]) {
        agrupado[t.data] = { data: t.data, Receitas: 0, Despesas: 0 };
      }
      if (t.tipo === 'receita') agrupado[t.data].Receitas += t.valor;
      if (t.tipo === 'despesa') agrupado[t.data].Despesas += t.valor;
    });

    // Converte o objeto em array e ordena pela data
    return Object.values(agrupado).sort((a, b) => {
      const [d1, m1, y1] = a.data.split('/');
      const [d2, m2, y2] = b.data.split('/');
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });
  }, [todasTransacoes]);

  // Personaliza o balão que aparece ao passar o mouse no gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color, fontWeight: 'bold' }}>
              {entry.name}: {formatBRL(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h2 className="page-title">Painel</h2>
      
      <div className="card-grid">
        <div className="card">
          <p className="card-title">Saldo</p>
          <p className="card-value">{formatBRL(saldoAtual)}</p>
        </div>
        <div className="card">
          <p className="card-title">Transações</p>
          <p className="card-value">{todasTransacoes.length}</p>
        </div>
        <div className="card card-vermelho">
          <p className="card-title">Despesas</p>
          <p className="card-value">{formatBRL(despesas)}</p>
        </div>
        <div className="card">
          <p className="card-title">Receitas</p>
          <p className="card-value">{formatBRL(receitas)}</p>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO MOVIDA PARA O PAINEL */}
      <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: '20px', border: '1.5px solid #e0e0e0', marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a1a', fontSize: '18px' }}>Visão Geral (Todas as Transações)</h3>
        
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                <XAxis dataKey="data" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                <Bar dataKey="Receitas" fill="#2E7D32" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="Despesas" fill="#D32F2F" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Nenhum dado registrado ainda.
          </div>
        )}
      </div>
    </>
  );
}