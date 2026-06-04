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