document.getElementById('diff-btn').addEventListener('click', () => {
    const a = document.getElementById('text-a').value.split('\n');
    const b = document.getElementById('text-b').value.split('\n');
    const output = document.getElementById('diff-output');
    let html = '';
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
        const la = a[i] || '', lb = b[i] || '';
        if (la === lb) { html += la + '\n'; }
        else {
            if (la) html += '<span class="removed">' + la.replace(/</g, '&lt;') + '</span>\n';
            if (lb) html += '<span class="added">' + lb.replace(/</g, '&lt;') + '</span>\n';
        }
    }
    output.innerHTML = html || '<span style="color:var(--text-muted)">No differences found.</span>';
});
