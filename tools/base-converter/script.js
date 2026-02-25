const dec = document.getElementById('dec'), bin = document.getElementById('bin'), oct = document.getElementById('oct'), hex = document.getElementById('hex');
function fromDec(v) { const n = parseInt(v); if (isNaN(n)) return; bin.value = n.toString(2); oct.value = n.toString(8); hex.value = n.toString(16).toUpperCase(); }
function fromBin(v) { const n = parseInt(v, 2); if (isNaN(n)) return; dec.value = n; oct.value = n.toString(8); hex.value = n.toString(16).toUpperCase(); }
function fromOct(v) { const n = parseInt(v, 8); if (isNaN(n)) return; dec.value = n; bin.value = n.toString(2); hex.value = n.toString(16).toUpperCase(); }
function fromHex(v) { const n = parseInt(v, 16); if (isNaN(n)) return; dec.value = n; bin.value = n.toString(2); oct.value = n.toString(8); }
dec.addEventListener('input', () => fromDec(dec.value));
bin.addEventListener('input', () => fromBin(bin.value));
oct.addEventListener('input', () => fromOct(oct.value));
hex.addEventListener('input', () => fromHex(hex.value));
