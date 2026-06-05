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