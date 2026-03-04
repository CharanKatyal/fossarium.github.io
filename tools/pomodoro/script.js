let timeLeft = 25 * 60, timer = null, isWork = true, sessions = 0;
const display = document.getElementById('timer'), label = document.getElementById('label'), startBtn = document.getElementById('start-btn');

function updateDisplay() { 
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0'); 
    const s = (timeLeft % 60).toString().padStart(2, '0'); 
    display.textContent = m + ':' + s; 
}

function playAlertSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const playBeep = (freq, startTime, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        // Sequence for Pomodoro: Higher pitch then lower
        playBeep(987.77, ctx.currentTime, 0.3); // B5
        playBeep(783.99, ctx.currentTime + 0.4, 0.5); // G5
    } catch (e) {
        console.error("Audio Context failed:", e);
    }
}

function tick() { 
    timeLeft--; 
    updateDisplay(); 
    if (timeLeft <= 0) { 
        clearInterval(timer); 
        timer = null; 
        playAlertSound();
        if (isWork) { 
            sessions++; 
            document.getElementById('session-count').textContent = sessions; 
            isWork = false; 
            timeLeft = 5 * 60; 
            label.textContent = 'Break Time'; 
        } else { 
            isWork = true; 
            timeLeft = 25 * 60; 
            label.textContent = 'Work Session'; 
        } 
        updateDisplay(); 
        startBtn.textContent = 'Start'; 
        setTimeout(() => alert(isWork ? "Break finished! Time to work." : "Work session finished! Take a break."), 100);
    } 
}

startBtn.addEventListener('click', () => { 
    if (timer) { 
        clearInterval(timer); 
        timer = null; 
        startBtn.textContent = 'Start'; 
    } else { 
        timer = setInterval(tick, 1000); 
        startBtn.textContent = 'Pause'; 
    } 
});

document.getElementById('reset-btn').addEventListener('click', () => { 
    clearInterval(timer); 
    timer = null; 
    isWork = true; 
    timeLeft = 25 * 60; 
    label.textContent = 'Work Session'; 
    startBtn.textContent = 'Start'; 
    updateDisplay(); 
});


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');

        if (isLight) {
            localStorage.setItem('fossarium-theme', 'light');
            if (icon) icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('fossarium-theme', 'dark');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        }
    });
}

initTheme();
updateDisplay();
