const input = document.getElementById('json-input');
const output = document.getElementById('json-output');
const statusBar = document.getElementById('status-bar');

function showStatus(message, type) {
    statusBar.textContent = message;
    statusBar.className = 'status-bar ' + type;
    setTimeout(() => statusBar.classList.add('hidden'), 4000);
}

document.getElementById('format-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, 4);
        showStatus('✓ JSON beautified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('minify-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
        showStatus('✓ JSON minified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('validate-btn').addEventListener('click', () => {
    try {
        JSON.parse(input.value);
        showStatus('✓ Valid JSON!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = output.value || input.value;
    if (!text) { showStatus('Nothing to copy.', 'error'); return; }
    navigator.clipboard.writeText(text).then(() => {
        showStatus('✓ Copied to clipboard!', 'success');
    });
});

document.getElementById('clear-btn').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    statusBar.classList.add('hidden');
});
