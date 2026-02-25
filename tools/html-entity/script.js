const input = document.getElementById('input'), output = document.getElementById('output');
document.getElementById('encode-btn').addEventListener('click', () => {
    output.value = input.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
});
document.getElementById('decode-btn').addEventListener('click', () => {
    const el = document.createElement('textarea');
    el.innerHTML = input.value;
    output.value = el.value;
});
document.getElementById('copy-btn').addEventListener('click', () => { if (output.value) navigator.clipboard.writeText(output.value); });
