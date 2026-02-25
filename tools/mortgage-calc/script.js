document.getElementById('calc-btn').addEventListener('click', () => {
    const P = parseFloat(document.getElementById('price').value) - parseFloat(document.getElementById('down').value);
    const r = parseFloat(document.getElementById('rate').value) / 100 / 12;
    const n = parseInt(document.getElementById('term').value) * 12;
    const M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = M * n;
    const interest = total - P;
    const fmt = v => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('results').innerHTML = [
        ['Monthly Payment', fmt(M)], ['Total Paid', fmt(total)], ['Total Interest', fmt(interest)], ['Loan Amount', fmt(P)]
    ].map(([l, v]) => `<div class="res-row"><span class="res-label">${l}</span><span class="res-val">${v}</span></div>`).join('');
});
