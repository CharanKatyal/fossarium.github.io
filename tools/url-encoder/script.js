const input = document.getElementById('input');
const output = document.getElementById('output');

document.getElementById('encode-btn').addEventListener('click', () => {
    output.value = encodeURIComponent(input.value);
});

document.getElementById('decode-btn').addEventListener('click', () => {
    try {
        output.value = decodeURIComponent(input.value);
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    if (output.value) navigator.clipboard.writeText(output.value);
});
