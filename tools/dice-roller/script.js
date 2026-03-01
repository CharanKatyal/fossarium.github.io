const result = document.getElementById("result");
const totalEl = document.getElementById("total");
const historyEl = document.getElementById("history");
const rollBtn = document.getElementById("roll-btn");
const typeSelect = document.getElementById("type");
const countInput = document.getElementById("count");

const hist = [];

function rollDice() {
    const sides = parseInt(typeSelect.value);
    const count = parseInt(countInput.value);
    
    if (isNaN(count) || count < 1) return;
    
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    // Update Display
    result.innerHTML = rolls.map(r => `<div class="die">${r}</div>`).join("");
    
    const sum = rolls.reduce((a, b) => a + b, 0);
    totalEl.textContent = sum;

    // Update History
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    hist.unshift(`${timestamp}: ${count}d${sides} → [${rolls.join(", ")}] = <strong>${sum}</strong>`);
    
    historyEl.innerHTML = hist.slice(0, 15).join("<br>");
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

rollBtn.addEventListener("click", rollDice);
initTheme();
// Initial state
totalEl.textContent = "0";
historyEl.textContent = "No rolls yet";
