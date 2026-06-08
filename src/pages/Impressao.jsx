import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx-js-style';

export default function Impressao() {
  useEffect(() => {
    document.title = "HortiFruti — Impressão";
  }, []);

  const { filtro, historico, caixa, formatBRL } = useContext(AppContext);

  // Unifica os dados e aplica os filtros
  const dadosBase = historico.length === 0 ? caixa.transacoes : historico;
  
  const transacoesFiltradas = dadosBase.filter(t => {
    if (filtro.tipo === 'receitas' && t.tipo !== 'receita') return false;
    if (filtro.tipo === 'despesas' && t.tipo !== 'despesa') return false;
    if (t.dataIso) {
      if (filtro.inicio && t.dataIso < filtro.inicio) return false;
      if (filtro.fim && t.dataIso > filtro.fim) return false;
    }
    return true;
  });

  // ==========================================
  // LÓGICA DO PDF
  // ==========================================
  const gerarPDF = (e) => {
    e.preventDefault();
    
    const reportVirtual = document.createElement('div');
    
    // Forçando os estilos do contêiner principal
    reportVirtual.style.setProperty('padding', '50px', 'important');
    reportVirtual.style.setProperty('background', '#ffffff', 'important');
    reportVirtual.style.setProperty('color', '#000000', 'important');
    reportVirtual.style.fontFamily = 'Arial, sans-serif';
    reportVirtual.style.boxSizing = 'border-box';
    reportVirtual.style.minHeight = '296mm'; 

    let totalE = 0, totalS = 0;
    transacoesFiltradas.forEach(t => {
      if (t.tipo === 'receita') totalE += t.valor;
      if (t.tipo === 'despesa') totalS += t.valor;
    });

    let tInicio = filtro.inicio ? filtro.inicio.split('-').reverse().join('/') : 'Início';
    let tFim = filtro.fim ? filtro.fim.split('-').reverse().join('/') : 'Fim';

    // HTML do relatório modificado com cores escuras e !important
    reportVirtual.innerHTML = `
      <div style="border-bottom: 2px solid #2e7d32; padding-bottom: 12px; margin-bottom: 35px;">
        <h1 style="color: #1b5e20 !important; margin: 0; font-size: 26px; font-weight: bold;">HortiFruti — Relatório Estatístico</h1>
        <p style="margin: 8px 0 0 0; color: #424242 !important; font-size: 15px;">Período Filtrado: ${tInicio} até ${tFim}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 40px;">
        <div style="flex: 1; border: 1px solid #bdbdbd; border-radius: 8px; padding: 18px 20px; background: #f5f5f5 !important;">
          <p style="color: #616161 !important; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: bold;">Total Receitas</p>
          <p style="color: #1b5e20 !important; font-size: 24px; font-weight: bold; margin: 0;">${formatBRL(totalE)}</p>
        </div>
        <div style="flex: 1; border: 1px solid #bdbdbd; border-radius: 8px; padding: 18px 20px; background: #f5f5f5 !important;">
          <p style="color: #616161 !important; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: bold;">Total Despesas</p>
          <p style="color: #b71c1c !important; font-size: 24px; font-weight: bold; margin: 0;">${formatBRL(totalS)}</p>
        </div>
        <div style="flex: 1; border: 1px solid #bdbdbd; border-radius: 8px; padding: 18px 20px; background: #f5f5f5 !important;">
          <p style="color: #616161 !important; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: bold;">Saldo Final</p>
          <p style="color: #000000 !important; font-size: 24px; font-weight: bold; margin: 0;">${formatBRL(totalE - totalS)}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: #ffffff !important;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #9e9e9e; color: #000000 !important; font-weight: bold;">DATA / HORA</th>
            <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #9e9e9e; color: #000000 !important; font-weight: bold;">DESCRIÇÃO DO LANÇAMENTO</th>
            <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #9e9e9e; color: #000000 !important; font-weight: bold;">TIPO</th>
            <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #9e9e9e; color: #000000 !important; font-weight: bold;">VALOR</th>
          </tr>
        </thead>
        <tbody>
          ${transacoesFiltradas.length === 0 ? `<tr><td colspan="4" style="text-align: center; padding: 30px; color: #424242 !important;">Nenhuma transação encontrada no período.</td></tr>` : ''}
          ${transacoesFiltradas.map(t => {
            const isReceita = t.tipo === 'receita';
            const sColor = isReceita ? '#1b5e20' : '#b71c1c';
            const sType = isReceita ? 'RECEITA' : 'DESPESA';
            const sSinal = isReceita ? '+' : '-';
            return `
              <tr>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e0e0e0; color: #212121 !important;">${t.data} ${t.hora || ''}</td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e0e0e0; color: #212121 !important;">${t.descricao}</td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e0e0e0; color: ${sColor} !important; font-weight: bold;">${sType}</td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #e0e0e0; color: ${sColor} !important; font-weight: bold; text-align: right;">${sSinal} ${formatBRL(t.valor)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="text-align: center; font-size: 11px; color: #757575 !important; margin-top: 40px; padding-top: 20px;">
        Documento de conferência gerado digitalmente.
      </div>
    `;

    const opcoes = {
      margin:       0,
      filename:     `Relatorio_Hortifruti.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, backgroundColor: '#ffffff', useCORS: true }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(reportVirtual).save();
  };

  // ==========================================
  // LÓGICA DO EXCEL (ESTILO DASHBOARD CLARO)
  // ==========================================
  const gerarExcel = (e) => {
    e.preventDefault();
    
    let saldoInicial = 0;
    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoesFiltradas.forEach(t => {
      const valor = parseFloat(t.valor) || 0;
      const descricao = t.descricao || '';
      if (descricao.toLowerCase().includes('saldo inicial')) {
        saldoInicial += valor;
      } else if (t.tipo === 'receita') {
        totalReceitas += valor;
      } else if (t.tipo === 'despesa') {
        totalDespesas += valor;
      }
    });

    const saldoFinal = saldoInicial + totalReceitas - totalDespesas;

    // Lógica idêntica à do PDF para capturar e inverter o intervalo de datas
    let tInicio = filtro.inicio ? filtro.inicio.split('-').reverse().join('/') : 'Início';
    let tFim = filtro.fim ? filtro.fim.split('-').reverse().join('/') : 'Fim';

    const linhas = [
      [],
      ['', '🌿 PAINEL FINANCEIRO — HORTIFRUTI', '', '', ''], 
      ['', `Período Filtrado: ${tInicio} até ${tFim}`, '', '', ''],  // Alterado para o padrão do PDF
      [], 
      ['', 'SALDO INICIAL', 'RECEITAS (+)', 'DESPESAS (-)', 'SALDO FINAL'],
      ['', saldoInicial, totalReceitas, totalDespesas, saldoFinal],         
      [], 
      ['', 'HISTÓRICO DE MOVIMENTAÇÕES', '', '', ''],
      ['', 'DATA / HORA', 'TIPO', 'DESCRIÇÃO', 'VALOR']
    ];

    transacoesFiltradas.forEach(t => {
      const dataHora = (t.data || '') + ' ' + (t.hora || '');
      const tipoExcel = t.tipo === 'receita' ? 'Entrada' : 'Saída';
      const valor = parseFloat(t.valor) || 0;
      linhas.push(['', dataHora.trim(), tipoExcel, t.descricao, valor]);
    });

    const ws = XLSX.utils.aoa_to_sheet(linhas);
    ws['!cols'] = [{ wch: 2 }, { wch: 22 }, { wch: 15 }, { wch: 45 }, { wch: 20 }];
    ws['!merges'] = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } }, 
      { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } }, 
      { s: { r: 7, c: 1 }, e: { r: 7, c: 4 } }  
    ];

    // Paleta de Cores Light
    const paleta = {
      bgFundo: "FFFFFF",
      bgCard: "F8F9FA",
      borda: "DDDDDD",
      textoPadrao: "333333",
      textoCinza: "666666",
      verde: "2E7D32",
      vermelho: "C62828",
      azul: "1565C0"
    };

    const range = XLSX.utils.decode_range(ws['!ref']);
    
    for (let R = 0; R <= range.e.r + 5; ++R) { 
      for (let C = 0; C <= 5; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };

        let estiloBase = {
          fill: { fgColor: { rgb: paleta.bgFundo } },
          font: { color: { rgb: paleta.textoPadrao }, name: 'Calibri' },
          alignment: { vertical: "center" }
        };

        // Título e Subtítulo (Aqui o estilo do intervalo de datas é aplicado)
        if (R === 1 && C >= 1 && C <= 4) {
          estiloBase.font = { ...estiloBase.font, sz: 18, bold: true, color: { rgb: paleta.verde } };
          estiloBase.alignment = { horizontal: "center" };
        } else if (R === 2 && C >= 1 && C <= 4) {
          estiloBase.font = { ...estiloBase.font, sz: 10, color: { rgb: paleta.textoCinza }, italic: true };
          estiloBase.alignment = { horizontal: "center" };
        }
        
        // Títulos dos Cards KPI (Linha 5)
        else if (R === 4 && C >= 1 && C <= 4) {
          estiloBase.fill = { fgColor: { rgb: paleta.bgCard } };
          estiloBase.font = { ...estiloBase.font, sz: 10, bold: true, color: { rgb: paleta.textoCinza } };
          estiloBase.border = { top: { style: "thin", color: { rgb: paleta.borda } }, left: { style: "thin", color: { rgb: paleta.borda } }, right: { style: "thin", color: { rgb: paleta.borda } } };
          estiloBase.alignment = { horizontal: "center" };
        }
        
        // Valores dos Cards KPI (Linha 6)
        else if (R === 5 && C >= 1 && C <= 4) {
          estiloBase.fill = { fgColor: { rgb: paleta.bgCard } };
          estiloBase.font = { ...estiloBase.font, sz: 14, bold: true };
          estiloBase.border = { bottom: { style: "thin", color: { rgb: paleta.borda } }, left: { style: "thin", color: { rgb: paleta.borda } }, right: { style: "thin", color: { rgb: paleta.borda } } };
          estiloBase.alignment = { horizontal: "center" };
          if (C === 2) estiloBase.font.color = { rgb: paleta.verde };
          if (C === 3) estiloBase.font.color = { rgb: paleta.vermelho };
          if (C === 4) estiloBase.font.color = { rgb: paleta.azul };
          if (ws[cellRef].t === 'n') ws[cellRef].z = '"R$" #,##0.00';
        }

        // Título da Tabela
        else if (R === 7 && C >= 1 && C <= 4) {
          estiloBase.font = { ...estiloBase.font, sz: 12, bold: true };
          estiloBase.border = { bottom: { style: "medium", color: { rgb: paleta.verde } } };
        }

        // Cabeçalhos da Tabela
        else if (R === 8 && C >= 1 && C <= 4) {
          estiloBase.fill = { fgColor: { rgb: paleta.verde } };
          estiloBase.font = { ...estiloBase.font, sz: 10, bold: true, color: { rgb: "FFFFFF" } };
        }

        // Linhas Dinâmicas
        else if (R >= 9 && R < linhas.length && C >= 1 && C <= 4) {
          estiloBase.fill = { fgColor: { rgb: R % 2 === 0 ? "F9F9F9" : "FFFFFF" } };
          estiloBase.font = { ...estiloBase.font, sz: 10 };
          estiloBase.border = { bottom: { style: "hair", color: { rgb: paleta.borda } } };

          if (C === 2) { 
            const isEntrada = ws[cellRef].v === 'Entrada';
            estiloBase.font.color = { rgb: isEntrada ? paleta.verde : paleta.vermelho };
            estiloBase.font.bold = true;
          }
          if (C === 4) { 
            const tipoStr = linhas[R][2];
            estiloBase.font.color = { rgb: tipoStr === 'Entrada' ? paleta.verde : paleta.vermelho };
            if (ws[cellRef].t === 'n') ws[cellRef].z = '"R$" #,##0.00';
          }
        }

        ws[cellRef].s = estiloBase;
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, "Painel Dashboard");
    XLSX.writeFile(workbook, `dashboard_hortifruti_${Date.now()}.xlsx`);
  };

  return (
    <>
      <h2 className="page-title">Escolher Tipo de Impressão</h2>

      <div className="impressao-grid">
        {/* Excel */}
        <a href="#" onClick={gerarExcel} className="impressao-card impressao-excel">
          <span className="icon-grande">📊</span>
          Excel
        </a>

        {/* PDF */}
        <a href="#" onClick={gerarPDF} className="impressao-card impressao-pdf">
          <span className="icon-grande">📄</span>
          PDF
        </a>
      </div>
    </>
  );
}