const countInput = document.getElementById("count");
const resultEl = document.getElementById("result");
const copyBtn = document.getElementById("copy-btn");

function gen() {
    const n = parseInt(countInput.value);
    if (isNaN(n) || n < 1) return;
    
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
    }
    
    const sequence = fib.slice(0, n).join(", ");
    resultEl.textContent = sequence;
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resultEl.textContent);
    const icon = copyBtn.querySelector('ion-icon');
    const originalIcon = icon.getAttribute('name');
    
    copyBtn.classList.add('success');
    icon.setAttribute('name', 'checkmark-outline');
    
    setTimeout(() => {
        copyBtn.classList.remove('success');
        icon.setAttribute('name', originalIcon);
    }, 1500);
});

initTheme();
// Initial generation
gen();
