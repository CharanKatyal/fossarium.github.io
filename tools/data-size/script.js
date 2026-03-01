const units = ["Bytes", "Kilobytes (KB)", "Megabytes (MB)", "Gigabytes (GB)", "Terabytes (TB)", "Petabytes (PB)"];
const valInput = document.getElementById("val");
const unitSelect = document.getElementById("unit");
const resultContainer = document.getElementById("result");

function convert() {
    const v = parseFloat(valInput.value);
    if (isNaN(v)) {
        resultContainer.innerHTML = '';
        return;
    }
    
    const u = parseInt(unitSelect.value);
    const bytes = v * Math.pow(1024, u);
    
    resultContainer.innerHTML = units.map((name, i) => {
        const value = bytes / Math.pow(1024, i);
        const formattedValue = value.toLocaleString(undefined, {
            maximumFractionDigits: i === 0 ? 0 : 4
        });
        
        return `
            <div class="result-item">
                <span class="unit-name">${name}</span>
                <span class="unit-value">${formattedValue}</span>
            </div>
        `;
    }).join("");
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

[valInput, unitSelect].forEach(e => e.addEventListener("input", convert));
initTheme();
convert();
