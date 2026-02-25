const textInput = document.getElementById('text-input');

async function hashString(algorithm, message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function updateHashes() {
    const text = textInput.value;
    if (!text) {
        document.getElementById('sha256').value = '';
        document.getElementById('sha512').value = '';
        document.getElementById('sha1').value = '';
        return;
    }
    document.getElementById('sha256').value = await hashString('SHA-256', text);
    document.getElementById('sha512').value = await hashString('SHA-512', text);
    document.getElementById('sha1').value = await hashString('SHA-1', text);
}

textInput.addEventListener('input', updateHashes);

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target.value) navigator.clipboard.writeText(target.value);
    });
});
