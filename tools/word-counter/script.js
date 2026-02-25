const input = document.getElementById('text-input');
function update() {
    const t = input.value;
    document.getElementById('chars').textContent = t.length;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    document.getElementById('words').textContent = words;
    document.getElementById('sentences').textContent = t.trim() ? (t.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
    document.getElementById('paragraphs').textContent = t.trim() ? t.split(/\n\s*\n/).filter(p => p.trim()).length || (words > 0 ? 1 : 0) : 0;
    document.getElementById('reading-time').textContent = Math.ceil(words / 200);
}
input.addEventListener('input', update);
