document.getElementById('gen-btn').addEventListener('click', () => {
    const min = parseInt(document.getElementById('min').value) || 0;
    const max = parseInt(document.getElementById('max').value) || 100;
    document.getElementById('result').textContent = Math.floor(Math.random() * (max - min + 1)) + min;
});
document.getElementById('gen-btn').click();
