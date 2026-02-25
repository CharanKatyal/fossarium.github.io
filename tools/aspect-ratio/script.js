const w1 = document.getElementById('w1'), h1 = document.getElementById('h1'), w2 = document.getElementById('w2'), h2 = document.getElementById('h2'), result = document.getElementById('result');
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function update() { const w = parseInt(w1.value) || 0, h = parseInt(h1.value) || 0; if (!w || !h) return; const d = gcd(w, h); result.textContent = 'Ratio: ' + w / d + ':' + h / d; const nw = parseInt(w2.value) || 0; h2.value = Math.round(nw * h / w); }
w1.addEventListener('input', update); h1.addEventListener('input', update); w2.addEventListener('input', update); update();
