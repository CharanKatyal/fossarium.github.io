const type = document.getElementById('type'),
    angle = document.getElementById('angle'),
    c1 = document.getElementById('c1'),
    c2 = document.getElementById('c2');

const preview = document.getElementById('preview'),
    output = document.getElementById('css-output'),
    copyBtn = document.getElementById('copy-btn'),
    av = document.getElementById('angle-val'),
    angleCtrl = document.getElementById('angle-ctrl');

function update() {
    av.textContent = angle.value;
    let css;
    
    if (type.value === 'linear') {
        angleCtrl.style.display = 'flex';
        css = `background: linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value});`;
        preview.style.background = `linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value})`;
    } else {
        angleCtrl.style.display = 'none';
        css = `background: radial-gradient(circle, ${c1.value}, ${c2.value});`;
        preview.style.background = `radial-gradient(circle, ${c1.value}, ${c2.value})`;
    }
    
    output.textContent = css;
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

[type, angle, c1, c2].forEach(el => el.addEventListener('input', update));

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.textContent);
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
update();
