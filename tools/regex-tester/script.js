const regexInput = document.getElementById('regex-input'), flagsInput = document.getElementById('flags-input'), testInput = document.getElementById('test-input');
const status = document.getElementById('status'), matchCount = document.getElementById('match-count'), matchesOutput = document.getElementById('matches-output');

function test() {
    const pattern = regexInput.value, flags = flagsInput.value, text = testInput.value;
    status.classList.add('hidden');
    if (!pattern || !text) { matchCount.textContent = '0'; matchesOutput.innerHTML = ''; return; }
    try {
        const re = new RegExp(pattern, flags);
        const matches = [...text.matchAll(re)];
        matchCount.textContent = matches.length;
        if (matches.length === 0) { matchesOutput.innerHTML = '<span style="color:var(--text-muted)">No matches</span>'; return; }
        matchesOutput.innerHTML = matches.map((m, i) => `<div><span class="match">${m[0]}</span> <span style="color:var(--text-muted);font-size:0.75rem">index ${m.index}</span></div>`).join('');
    } catch (e) {
        status.textContent = '✗ ' + e.message;
        status.className = 'status-bar error';
        matchCount.textContent = '0';
        matchesOutput.innerHTML = '';
    }
}

regexInput.addEventListener('input', test);
flagsInput.addEventListener('input', test);
testInput.addEventListener('input', test);
