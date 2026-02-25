document.getElementById('convert-btn').addEventListener('click', () => {
    try {
        const data = JSON.parse(document.getElementById('input').value);
        if (!Array.isArray(data) || data.length === 0) throw new Error('Input must be a non-empty JSON array');
        const headers = Object.keys(data[0]);
        const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
        document.getElementById('output').value = csv;
    } catch (e) { document.getElementById('output').value = 'Error: ' + e.message; }
});
document.getElementById('copy-btn').addEventListener('click', () => { const t = document.getElementById('output').value; if (t) navigator.clipboard.writeText(t); });
