const csvInput = document.getElementById('csv-input');
const jsonOutput = document.getElementById('json-output');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');

function convertCsvToJson() {
    const csv = csvInput.value.trim();
    if (!csv) {
        jsonOutput.value = '';
        return;
    }

    try {
        const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length === 0) return;

        const headers = lines[0].split(',').map(h => h.trim());
        const result = lines.slice(1).map(line => {
            const vals = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((h, i) => {
                obj[h] = vals[i] !== undefined ? vals[i] : '';
            });
            return obj;
        });

        jsonOutput.value = JSON.stringify(result, null, 2);
    } catch (e) {
        jsonOutput.value = 'Error parsing CSV: ' + e.message;
    }
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

convertBtn.addEventListener('click', convertCsvToJson);

copyBtn.addEventListener('click', () => {
    const json = jsonOutput.value;
    if (!json) return;
    
    navigator.clipboard.writeText(json);
    const icon = copyBtn.querySelector('ion-icon');
    const originalName = icon.getAttribute('name');
    icon.setAttribute('name', 'checkmark-outline');
    copyBtn.style.color = 'var(--accent-color)';
    
    setTimeout(() => {
        icon.setAttribute('name', originalName);
        copyBtn.style.color = '';
    }, 1500);
});

initTheme();
