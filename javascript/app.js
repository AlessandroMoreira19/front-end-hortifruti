const CAIXA_KEY = 'hortifruti_caixa';
const HISTORICO_KEY = 'hortifruti_historico';
const FILTRO_KEY = 'hortifruti_filtro';

function getCaixa() {
  return JSON.parse(localStorage.getItem(CAIXA_KEY)) || {
    aberto: false,
    saldoInicial: 0,
    transacoes: []
  };
}

function salvarCaixa(caixa) {
  localStorage.setItem(CAIXA_KEY, JSON.stringify(caixa));
}

function formatBRL(valor) {
  return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.toLowerCase();

  if (path.includes('painel') || path.endsWith('/')) {
    initPainel();
  } else if (path.includes('fluxo-abrir')) {
    initFluxoAbrir();
  } else if (path.includes('fluxo-aberto') || path.includes('fluxo-abento')) {
    initFluxoAberto();
  } else if (path.includes('novo-lancamento')) {
    initNovoLancamento();
  } else if (path.includes('relatorios')) {
    initRelatorios();
  } else if (path.includes('impressao')) {
    initImpressao();
  }
});

function initPainel() {
  const caixa = getCaixa();
  const historico = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
  const todasTransacoes = [...historico, ...caixa.transacoes];
  
  let receitas = 0;
  let despesas = 0;
  todasTransacoes.forEach(t => {
    if (t.tipo === 'receita') receitas += t.valor;
    if (t.tipo === 'despesa') despesas += t.valor;
  });

  const saldoAtual = caixa.saldoInicial + receitas - despesas;
  const cards = document.querySelectorAll('.card-value');

  if (cards.length >= 4) {
    cards[0].textContent = formatBRL(saldoAtual);
    cards[1].textContent = todasTransacoes.length;
    cards[2].textContent = formatBRL(despesas);
    cards[3].textContent = formatBRL(receitas);
  }
}

function initFluxoAbrir() {
  const caixa = getCaixa();
  if (caixa.aberto) {
    window.location.href = 'fluxo-aberto.html';
    return;
  }
  const btnAbrir = document.querySelector('.btn-verde');
  const inputSaldo = document.getElementById('saldo-inicial');

  if (btnAbrir) {
    btnAbrir.addEventListener('click', (e) => {
      e.preventDefault();
      const valor = parseFloat(inputSaldo.value) || 0;
      caixa.aberto = true;
      caixa.saldoInicial = valor;
      caixa.transacoes = [];
      salvarCaixa(caixa);
      window.location.href = 'fluxo-aberto.html';
    });
  }
}

function initFluxoAberto() {
  const caixa = getCaixa();
  let receitas = 0;
  let despesas = 0;
  caixa.transacoes.forEach(t => {
    if (t.tipo === 'receita') receitas += t.valor;
    if (t.tipo === 'despesa') despesas += t.valor;
  });

  const cards = document.querySelectorAll('.card-value');
  if (cards.length >= 3) {
    cards[0].textContent = formatBRL(caixa.saldoInicial);
    cards[1].textContent = formatBRL(receitas);
    cards[2].textContent = formatBRL(despesas);
  }

  const box = document.querySelector('.transacoes-box');
  if (box) {
    if (caixa.transacoes.length === 0) {
      box.innerHTML = '<p class="transacoes-vazio">Nenhuma transação registrada ainda.</p>';
    } else {
      box.innerHTML = '';
      caixa.transacoes.forEach(t => {
        const div = document.createElement('div');
        div.className = 'transacao-item';
        const isReceita = t.tipo === 'receita';
        div.innerHTML = `
          <span>${t.descricao}</span>
          <span class="${isReceita ? 'transacao-receita' : 'transacao-despesa'}">
            ${isReceita ? '+' : '-'} ${formatBRL(t.valor)}
          </span>
        `;
        box.appendChild(div);
      });
    }
  }

  const btnFechar = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.toLowerCase().includes('fechar'));
  if (btnFechar) {
    btnFechar.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Deseja fechar o caixa de hoje? Os dados serão salvos no histórico geral.')) {
        let historicoCompleto = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
        historicoCompleto = historicoCompleto.concat(caixa.transacoes);
        localStorage.setItem(HISTORICO_KEY, JSON.stringify(historicoCompleto));
        
        localStorage.removeItem(CAIXA_KEY);
        window.location.href = 'fluxo-abrir.html';
      }
    });
  }
}

function initNovoLancamento() {
  const caixa = getCaixa();
  const container = document.querySelector('.form-panel');
  const inputValor = document.getElementById('valor');
  const btnLancar = document.querySelector('.btn-verde');

  if (container && btnLancar && !document.getElementById('tipo-lancamento')) {
    const typeLabel = document.createElement('label');
    typeLabel.className = 'form-label';
    typeLabel.textContent = 'Tipo de Lançamento';
    typeLabel.style.marginTop = '15px';
    
    const selectType = document.createElement('select');
    selectType.className = 'form-input';
    selectType.id = 'tipo-lancamento';
    selectType.innerHTML = `
      <option value="receita">Receita (Entrada)</option>
      <option value="despesa">Despesa (Saída)</option>
    `;

    const descLabel = document.createElement('label');
    descLabel.className = 'form-label';
    descLabel.textContent = 'Descrição';
    descLabel.style.marginTop = '15px';

    const inputDesc = document.createElement('input');
    inputDesc.className = 'form-input';
    inputDesc.id = 'desc-lancamento';
    inputDesc.type = 'text';
    inputDesc.placeholder = 'Ex: Venda de maçãs';

    container.insertBefore(typeLabel, btnLancar);
    container.insertBefore(selectType, btnLancar);
    container.insertBefore(descLabel, btnLancar);
    container.insertBefore(inputDesc, btnLancar);
    btnLancar.style.marginTop = '20px';

    btnLancar.addEventListener('click', (e) => {
      e.preventDefault();
      const valor = parseFloat(inputValor.value);
      const tipo = selectType.value;
      const descricao = inputDesc.value.trim() || 'Lançamento sem descrição';

      if (!valor || valor <= 0) {
        alert('Por favor, digite um valor maior que zero.');
        return;
      }

      const agora = new Date();
      caixa.transacoes.push({
        data: agora.toLocaleDateString('pt-BR'), 
        dataIso: agora.toISOString().split('T')[0], 
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        tipo,
        descricao,
        valor
      });

      salvarCaixa(caixa);
      window.location.href = 'fluxo-aberto.html';
    });
  }
}

function initRelatorios() {
  const btnGerar = Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.toLowerCase().includes('gerar'));
  
  if (btnGerar) {
    btnGerar.addEventListener('click', () => {
      const tipo = document.getElementById('tipo-relatorio')?.value || 'fluxo';
      const inicio = document.getElementById('data-inicio')?.value || '';
      const fim = document.getElementById('data-fim')?.value || '';

      localStorage.setItem(FILTRO_KEY, JSON.stringify({ tipo, inicio, fim }));
    });
  }
}

function initImpressao() {
  const filtro = JSON.parse(localStorage.getItem(FILTRO_KEY)) || { tipo: 'fluxo', inicio: '', fim: '' };
  
  let dadosBase = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
  if (dadosBase.length === 0) dadosBase = getCaixa().transacoes;

  const transacoesFiltradas = dadosBase.filter(t => {
    if (filtro.tipo === 'receitas' && t.tipo !== 'receita') return false;
    if (filtro.tipo === 'despesas' && t.tipo !== 'despesa') return false;
    if (t.dataIso) {
      if (filtro.inicio && t.dataIso < filtro.inicio) return false;
      if (filtro.fim && t.dataIso > filtro.fim) return false;
    }
    return true;
  });

  const cardExcel = document.querySelector('.impressao-excel');
  const cardPdf = document.querySelector('.impressao-pdf');

  // PDF
  if (cardPdf) {
    cardPdf.addEventListener('click', (e) => {
      e.preventDefault();
      
      const reportVirtual = document.createElement('div');
      
      reportVirtual.style.setProperty('padding', '50px', 'important');
      reportVirtual.style.setProperty('background', '#ffffff', 'important');
      reportVirtual.style.setProperty('color', '#000000', 'important'); // Cor preta padrão
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
              const sColor = isReceita ? '#1b5e20' : '#b71c1c'; // Verde musgo escuro e vermelho vinho
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
    });
  }

  if (cardExcel) {
    cardExcel.addEventListener('click', (e) => {
      e.preventDefault();
      
      let saldoInicial = 0;
      let totalReceitas = 0;
      let totalDespesas = 0;

      const linhasTransacoes = [
        ['Data/Hora', 'Tipo', 'Descrição', 'Valor'] // Cabeçalho
      ];

      transacoesFiltradas.forEach(t => {
        const dataHora = t.dataHora || t.data || '';
        const descricao = t.descricao || '';
        const valor = parseFloat(t.valor) || 0;
        
        const tipoExcel = t.tipo === 'receita' ? 'Entrada' : 'Saída';

        linhasTransacoes.push([dataHora, tipoExcel, descricao, valor]);

        if (descricao.toLowerCase().includes('saldo inicial')) {
          saldoInicial += valor;
        } else if (t.tipo === 'receita') {
          totalReceitas += valor;
        } else if (t.tipo === 'despesa') {
          totalDespesas += valor;
        }
      });

      const saldoFinal = saldoInicial + totalReceitas - totalDespesas;
      
      const dataFechamento = new Date().toLocaleDateString('pt-BR'); 

      const linhasResumo = [
        ['', '🌿 HortiFruti — Resumo do Fluxo de Caixa'], // Linha 1 (A1, B1)
        [''],                                           // Linha 2
        ['Data do Fechamento:', dataFechamento],        // Linha 3 (A3, B3)
        ['Status:', 'Fechado com Sucesso'],             // Linha 4 (A4, B4)
        [''],                                           // Linha 5
        [''],                                           // Linha 6
        ['Saldo Inicial', saldoInicial],                // Linha 7 (A7, B7)
        ['Total Receitas (+)', totalReceitas],          // Linha 8 (A8, B8)
        ['Total Despesas (-)', totalDespesas],          // Linha 9 (A9, B9)
        ['Saldo Final', saldoFinal]                     // Linha 10 (A10, B10)
      ];

      const wsResumo = XLSX.utils.aoa_to_sheet(linhasResumo);
      const wsTransacoes = XLSX.utils.aoa_to_sheet(linhasTransacoes);

      wsResumo['!cols'] = [{ wch: 25 }, { wch: 45 }];
      wsTransacoes['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 40 }, { wch: 15 }];

      const corVerde = "2E7D32"; // Verde Escuro
      const corVermelha = "D32F2F"; // Vermelho
      
      const estiloCabecalho = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: corVerde } },
        alignment: { horizontal: "center", vertical: "center" }
      };

      const estiloNegrito = { font: { bold: true } };
      const estiloReceita = { font: { bold: true, color: { rgb: corVerde } } };
      const estiloDespesa = { font: { bold: true, color: { rgb: corVermelha } } };
      const estiloDestaqueFinal = {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "C8E6C9" } } 
      };

      if (wsResumo['B1']) wsResumo['B1'].s = { font: { bold: true, sz: 14, color: { rgb: corVerde } } };
      
      if (wsResumo['A3']) wsResumo['A3'].s = estiloNegrito;
      if (wsResumo['A4']) wsResumo['A4'].s = estiloNegrito;
      if (wsResumo['B4']) wsResumo['B4'].s = estiloReceita;

      if (wsResumo['A7']) wsResumo['A7'].s = estiloNegrito;
      
      if (wsResumo['A8']) wsResumo['A8'].s = estiloReceita;
      if (wsResumo['B8']) wsResumo['B8'].s = estiloReceita;
      if (wsResumo['A9']) wsResumo['A9'].s = estiloDespesa;
      if (wsResumo['B9']) wsResumo['B9'].s = estiloDespesa;

      if (wsResumo['A10']) wsResumo['A10'].s = estiloDestaqueFinal;
      if (wsResumo['B10']) wsResumo['B10'].s = estiloDestaqueFinal;

      for (let C = 0; C <= 3; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (wsTransacoes[cellRef]) wsTransacoes[cellRef].s = estiloCabecalho;
      }

      for (let R = 1; R < linhasTransacoes.length; ++R) {
        const tipoTransacao = linhasTransacoes[R][1]; // Coluna 'Tipo'
        
        const estiloLinha = tipoTransacao === 'Entrada' 
          ? { font: { color: { rgb: corVerde } } } 
          : { font: { color: { rgb: corVermelha } } };
        
        const cellTipo = wsTransacoes[XLSX.utils.encode_cell({ c: 1, r: R })];
        const cellValor = wsTransacoes[XLSX.utils.encode_cell({ c: 3, r: R })];
        
        if (cellTipo) cellTipo.s = estiloLinha;
        if (cellValor) cellValor.s = estiloLinha;
      }

      const formatarMoeda = (worksheet) => {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
            if (!cell) continue;

            if (cell.t === 'n') {
              cell.z = '"R$" #,##0.00'; 
            }
          }
        }
      };

      formatarMoeda(wsResumo);
      formatarMoeda(wsTransacoes);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, wsResumo, "Resumo do Caixa");
      XLSX.utils.book_append_sheet(workbook, wsTransacoes, "Lista de Transações");

      XLSX.writeFile(workbook, `fluxo_caixa_hortifruti_${Date.now()}.xlsx`);
    });
  }
}