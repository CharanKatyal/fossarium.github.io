const prompt = document.getElementById('prompt'), grid = document.getElementById('info-grid');
document.addEventListener('keydown', e => {
    e.preventDefault();
    prompt.textContent = e.key === ' ' ? 'Space' : e.key;
    prompt.classList.add('active');
    grid.innerHTML = [
        ['key', e.key], ['code', e.code], ['keyCode', e.keyCode], ['which', e.which],
        ['location', e.location], ['type', e.type], ['repeat', e.repeat],
        ['modifiers', [e.ctrlKey && 'Ctrl', e.shiftKey && 'Shift', e.altKey && 'Alt', e.metaKey && 'Meta'].filter(Boolean).join('+') || 'None']
    ].map(([l, v]) => `<div class="info-card"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
});
