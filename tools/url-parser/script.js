const input = document.getElementById('url-input'), parts = document.getElementById('parts');
function parse() {
    try {
        const u = new URL(input.value);
        const data = [['Protocol', u.protocol], ['Host', u.host], ['Hostname', u.hostname], ['Port', u.port || '(default)'], ['Pathname', u.pathname], ['Search', u.search || '(none)'], ['Hash', u.hash || '(none)'], ['Origin', u.origin]];
        if (u.searchParams.toString()) u.searchParams.forEach((v, k) => data.push(['Param: ' + k, v]));
        parts.innerHTML = data.map(([l, v]) => `<div class="part-row"><span class="part-label">${l}</span><span class="part-value">${v}</span></div>`).join('');
    } catch (e) { parts.innerHTML = `<div class="part-row"><span class="part-label">Error</span><span class="part-value" style="color:#ff4757">${e.message}</span></div>`; }
}
input.addEventListener('input', parse);
parse();
