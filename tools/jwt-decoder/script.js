const jwtInput = document.getElementById('jwt-input');
const headerOutput = document.getElementById('header-output');
const payloadOutput = document.getElementById('payload-output');
const status = document.getElementById('status');

function decode() {
    const token = jwtInput.value.trim();
    if (!token) { headerOutput.textContent = '{}'; payloadOutput.textContent = '{}'; status.classList.add('hidden'); return; }
    try {
        const parts = token.split('.');
        if (parts.length < 2) throw new Error('Invalid JWT format');
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        headerOutput.textContent = JSON.stringify(header, null, 2);
        payloadOutput.textContent = JSON.stringify(payload, null, 2);
        status.classList.add('hidden');
    } catch (e) {
        status.textContent = '✗ ' + e.message;
        status.className = 'status-bar error';
    }
}

jwtInput.addEventListener('input', decode);
