setInterval(() => { const n = Math.floor(Date.now() / 1000); document.getElementById('now').textContent = n + ' (' + new Date().toISOString() + ')'; }, 1000);
function tsToDate() { const ts = parseInt(document.getElementById('ts').value); if (isNaN(ts)) return; const d = new Date(ts * 1000); document.getElementById('ts-result').textContent = d.toISOString() + '\n' + d.toLocaleString(); }
function dateToTs() { const v = document.getElementById('dt').value; if (!v) return; const ts = Math.floor(new Date(v).getTime() / 1000); document.getElementById('dt-result').textContent = ts + ' (seconds)\n' + (ts * 1000) + ' (milliseconds)'; }
document.getElementById('dt').value = new Date().toISOString().slice(0, 16);
