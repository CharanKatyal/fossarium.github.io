const h = document.getElementById('h-offset'),
    v = document.getElementById('v-offset'),
    b = document.getElementById('blur'),
    s = document.getElementById('spread'),
    c = document.getElementById('shadow-color'),
    o = document.getElementById('opacity'),
    inset = document.getElementById('inset');

const preview = document.getElementById('preview-box'),
    output = document.getElementById('css-output'),
    copyBtn = document.getElementById('copy-btn');

const hv = document.getElementById('h-val'),
    vv = document.getElementById('v-val'),
    bv = document.getElementById('b-val'),
    sv = document.getElementById('s-val'),
    ov = document.getElementById('o-val');

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
    return [
        parseInt(hex.substr(0, 2), 16) || 0,
        parseInt(hex.substr(2, 2), 16) || 0,
        parseInt(hex.substr(4, 2), 16) || 0
    ];
}

function update() {
    hv.textContent = h.value;
    vv.textContent = v.value;
    bv.textContent = b.value;
    sv.textContent = s.value;
    ov.textContent = o.value;

    const [r, g, bb] = hexToRgb(c.value);
    const alpha = (o.value / 100).toFixed(2);
    const ins = inset.checked ? 'inset ' : '';
    const shadowValue = `${ins}${h.value}px ${v.value}px ${b.value}px ${s.value}px rgba(${r}, ${g}, ${bb}, ${alpha})`;
    
    const css = `box-shadow: ${shadowValue};`;
    preview.style.boxShadow = shadowValue;
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

[h, v, b, s, c, o, inset].forEach(el => el.addEventListener('input', update));

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
