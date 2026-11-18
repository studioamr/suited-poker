/* Precios en SOL de cada mesa (tarjeta) y de cada entrada de torneo. Una sola fuente para la landing y el juego. */
window.PRICING = {
  // red de Solana donde se mueven los pagos: 'devnet' (SOL de prueba) hasta tener licencia, servidor y bóveda de la casa
  network: 'devnet',
  // dirección PÚBLICA de la bóveda de la casa (donde llegan los buy-ins). Vacía = pagos apagados.
  vault: '',
  rake: 0.05, // comisión de la casa sobre cada bote/premio
  tiers: [ // buy-in en SOL por tarjeta (mismo orden que las mesas)
    { name: 'Classic', sol: 0.05 }, { name: 'Silver', sol: 0.25 }, { name: 'Gold', sol: 1 }, { name: 'Platinum', sol: 5 },
    { name: 'Black', sol: 20 }, { name: 'Diamond', sol: 75 }, { name: 'Double Diamond', sol: 250 },
    { name: 'Infinite', sol: null, minUsd: 50000, custom: true }], // a la medida: desde $50,000, el anfitrión pone el monto
  entries: [ // torneos: entrada en SOL y tarjeta que se necesita
    { k: 'starter', sol: 0.1, tier: 0 }, { k: 'pro', sol: 1, tier: 2 }, { k: 'high roller', sol: 10, tier: 4 }, { k: 'major', sol: 50, tier: 6 }],
  px: { sol: null, btc: null, mxn: null },
  async load() { // precio en vivo para mostrar el equivalente en dólares y en BTC
    try { const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin&vs_currencies=usd,mxn'); const d = await r.json(); this.px.sol = d.solana.usd; this.px.btc = d.bitcoin.usd; this.px.mxn = d.solana.mxn; } catch (e) {}
    return this.px;
  },
  minSol(t) { return t.custom ? (this.px.sol ? Math.ceil(t.minUsd / this.px.sol) : 700) : t.sol; },
  usd(sol) { return this.px.sol ? sol * this.px.sol : null; },
  btc(sol) { return this.px.sol && this.px.btc ? sol * this.px.sol / this.px.btc : null; },
  fmtSol(n) { return (n >= 1 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : n.toFixed(n < .1 ? 3 : 2).replace(/0+$/, '').replace(/\.$/, '')) + ' SOL'; },
  fmtUsd(n) { return n == null ? '' : '$' + (n >= 1000 ? Math.round(n).toLocaleString('en-US') : n.toFixed(2)); },
  fmtBtc(n) { return n == null ? '' : (n < .01 ? n.toFixed(5) : n.toFixed(3)) + ' BTC'; }
};
