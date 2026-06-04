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