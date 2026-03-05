const target = document.getElementById("target");
const result = document.getElementById("result");
const modalOverlay = document.getElementById("modal-overlay");
const modalOk = document.getElementById("modal-ok");

// Set default target to 1 month from now
const d = new Date();
d.setMonth(d.getMonth() + 1);
target.value = d.toISOString().slice(0, 16);

let hasPlayedAlert = false;
let audioCtx = null;
let soundInterval = null;

function playBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = ctx.createGain(); // Note: error in previous logic using ctx instead of audioCtx
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };
}

// Fix audio logic
function playBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

function startAlert() {
    playBeep();
    soundInterval = setInterval(playBeep, 1500);
    modalOverlay.classList.remove("hidden");
}

function stopAlert() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    modalOverlay.classList.add("hidden");
}

function update() {
    const now = new Date();
    const t = new Date(target.value) - now;
    
    if (t <= 0) {
        result.innerHTML = '<div class="passed-message">🎉 The target date has passed!</div>';
        if (!hasPlayedAlert) {
            startAlert();
            hasPlayedAlert = true;
        }
        return;
    }

    // Reset alert flag if a new future date is set
    hasPlayedAlert = false;

    const days = Math.floor(t / 86400000);
    const hrs = Math.floor((t % 86400000) / 3600000);
    const mins = Math.floor((t % 3600000) / 60000);
    const secs = Math.floor((t % 60000) / 1000);

    result.innerHTML = `
        <div class="time-block">
            <span class="value">${String(days).padStart(2, '0')}</span>
            <span class="label">Days</span>
        </div>
        <div class="time-block">
            <span class="value">${String(hrs).padStart(2, '0')}</span>
            <span class="label">Hours</span>
        </div>
        <div class="time-block">
            <span class="value">${String(mins).padStart(2, '0')}</span>
            <span class="label">Mins</span>
        </div>
        <div class="time-block">
            <span class="value">${String(secs).padStart(2, '0')}</span>
            <span class="label">Secs</span>
        </div>
    `;
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

target.addEventListener("input", () => {
    hasPlayedAlert = false;
    stopAlert();
    update();
});
modalOk.addEventListener("click", stopAlert);
setInterval(update, 1000);
initTheme();
update();
