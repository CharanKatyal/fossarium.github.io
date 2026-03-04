const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const W = 320, C = W / 2, R = 140;

const timezoneSelect = document.getElementById('timezone-select');
const designSelect = document.getElementById('design-select');
const hourFormatCheckbox = document.getElementById('hour-format');
const digitalEl = document.getElementById('digital');
const dateEl = document.getElementById('date');

function getThemeColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const designs = {
    modern: {
        drawFace: (ctx, colors) => {
            for (let i = 0; i < 60; i++) {
                const a = i * Math.PI / 30;
                const isHour = i % 5 === 0;
                const tickLen = isHour ? 18 : 10;
                ctx.beginPath();
                ctx.moveTo(C + Math.cos(a) * (R - tickLen), C + Math.sin(a) * (R - tickLen));
                ctx.lineTo(C + Math.cos(a) * R, C + Math.sin(a) * R);
                ctx.strokeStyle = isHour ? colors.accent : colors.muted;
                ctx.lineWidth = isHour ? 4 : 2;
                ctx.lineCap = "round";
                ctx.stroke();
            }
        },
        hands: { h: { len: 0.5, width: 8 }, m: { len: 0.75, width: 5 }, s: { len: 0.85, width: 2, color: "#ff4757" } }
    },
    minimal: {
        drawFace: (ctx, colors) => {
            ctx.beginPath();
            ctx.arc(C, C, R, 0, Math.PI * 2);
            ctx.strokeStyle = colors.border;
            ctx.lineWidth = 2;
            ctx.stroke();
        },
        hands: { h: { len: 0.4, width: 4 }, m: { len: 0.7, width: 3 }, s: { len: 0.9, width: 1, color: colors => colors.accent } }
    },
    classic: {
        drawFace: (ctx, colors) => {
            ctx.font = "bold 20px Inter";
            ctx.fillStyle = colors.text;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (let i = 1; i <= 12; i++) {
                const a = i * Math.PI / 6 - Math.PI / 2;
                ctx.fillText(i, C + Math.cos(a) * (R - 25), C + Math.sin(a) * (R - 25));
            }
        },
        hands: { h: { len: 0.45, width: 10 }, m: { len: 0.75, width: 6 }, s: { len: 0.85, width: 2, color: "#ff4757" } }
    },
    roman: {
        drawFace: (ctx, colors) => {
            const romans = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
            ctx.font = "bold 18px serif";
            ctx.fillStyle = colors.text;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            romans.forEach((r, i) => {
                const a = i * Math.PI / 6 - Math.PI / 2;
                ctx.fillText(r, C + Math.cos(a) * (R - 25), C + Math.sin(a) * (R - 25));
            });
        },
        hands: { h: { len: 0.4, width: 6 }, m: { len: 0.7, width: 4 }, s: { len: 0.85, width: 1, color: "#ff4757" } }
    },
    dash: {
        drawFace: (ctx, colors) => {
            for (let i = 0; i < 12; i++) {
                const a = i * Math.PI / 6;
                ctx.beginPath();
                ctx.moveTo(C + Math.cos(a) * (R - 20), C + Math.sin(a) * (R - 20));
                ctx.lineTo(C + Math.cos(a) * R, C + Math.sin(a) * R);
                ctx.strokeStyle = colors.accent;
                ctx.lineWidth = 6;
                ctx.stroke();
            }
        },
        hands: { h: { len: 0.5, width: 10 }, m: { len: 0.8, width: 6 }, s: { len: 0.9, width: 2, color: colors => colors.text } }
    },
    neon: {
        drawFace: (ctx, colors) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = colors.accent;
            ctx.beginPath();
            ctx.arc(C, C, R, 0, Math.PI * 2);
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.shadowBlur = 0;
        },
        hands: { h: { len: 0.5, width: 6, glow: true }, m: { len: 0.8, width: 4, glow: true }, s: { len: 0.9, width: 2, color: "#00ffcc", glow: true } }
    },
    tech: {
        drawFace: (ctx, colors) => {
            ctx.beginPath();
            ctx.arc(C, C, R, 0, Math.PI * 2);
            ctx.strokeStyle = colors.accent;
            ctx.setLineDash([5, 15]);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
        },
        hands: { h: { len: 0.5, width: 2 }, m: { len: 0.8, width: 2 }, s: { len: 0.95, width: 1, color: colors => colors.accent } }
    }
};

function updateClock() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = W * ratio;
    canvas.height = W * ratio;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, W, W);

    const colors = {
        text: getThemeColor('--text-color'),
        accent: getThemeColor('--accent-color'),
        muted: getThemeColor('--text-muted'),
        border: getThemeColor('--card-border')
    };

    const tz = timezoneSelect.value;
    const now = new Date();
    const localized = tz === 'local' ? now : new Date(now.toLocaleString("en-US", { timeZone: tz }));

    const designName = designSelect.value;
    const design = designs[designName];

    // Draw Face
    design.drawFace(ctx, colors);

    const h = localized.getHours() % 12, m = localized.getMinutes(), s = localized.getSeconds(), ms = localized.getMilliseconds();

    // Hour
    drawHand((h + m / 60) * Math.PI / 6 - Math.PI / 2, design.hands.h.len * R, design.hands.h.width, colors.text, design.hands.h.glow ? colors.accent : null);
    // Minute
    drawHand((m + s / 60) * Math.PI / 30 - Math.PI / 2, design.hands.m.len * R, design.hands.m.width, colors.text, design.hands.m.glow ? colors.accent : null);
    // Second
    const sColor = typeof design.hands.s.color === 'function' ? design.hands.s.color(colors) : design.hands.s.color;
    drawHand((s + ms / 1000) * Math.PI / 30 - Math.PI / 2, design.hands.s.len * R, design.hands.s.width, sColor, design.hands.s.glow ? sColor : null);

    // Center Dot
    ctx.beginPath();
    ctx.arc(C, C, 6, 0, Math.PI * 2);
    ctx.fillStyle = sColor;
    ctx.fill();

    // Digital
    const is12h = hourFormatCheckbox.checked;
    digitalEl.textContent = localized.toLocaleTimeString("en-US", { 
        hour12: is12h, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    dateEl.textContent = localized.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function drawHand(angle, length, width, color, glowColor = null) {
    ctx.save();
    if (glowColor) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = glowColor;
    }
    ctx.beginPath();
    ctx.moveTo(C, C);
    ctx.lineTo(C + Math.cos(angle) * length, C + Math.sin(angle) * length);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

// Events
[timezoneSelect, designSelect, hourFormatCheckbox].forEach(el => {
    el.addEventListener('change', () => requestAnimationFrame(updateClock));
});

initTheme();
setInterval(updateClock, 50);
updateClock();
