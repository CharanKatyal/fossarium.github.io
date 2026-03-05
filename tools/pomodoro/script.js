let timeLeft = 25 * 60, timer = null, isWork = true, sessions = 0;
let audioCtx = null;
let soundInterval = null;

const display = document.getElementById('timer'), 
    label = document.getElementById('label'), 
    startBtn = document.getElementById('start-btn'),
    modalOverlay = document.getElementById('modal-overlay'),
    modalTitle = document.getElementById('modal-title'),
    modalMessage = document.getElementById('modal-message'),
    modalOk = document.getElementById('modal-ok');

function updateDisplay() { 
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0'); 
    const s = (timeLeft % 60).toString().padStart(2, '0'); 
    display.textContent = m + ':' + s; 
}

function playBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    playNote(987.77, audioCtx.currentTime, 0.3);
    playNote(783.99, audioCtx.currentTime + 0.4, 0.5);
}

function startAlert() {
    playBeep();
    soundInterval = setInterval(playBeep, 2000);
    
    if (isWork) {
        modalTitle.textContent = "Work Session Finished!";
        modalMessage.textContent = "Take a well-deserved break.";
    } else {
        modalTitle.textContent = "Break Finished!";
        modalMessage.textContent = "Time to get back to work.";
    }
    modalOverlay.classList.remove("hidden");
}

function stopAlert() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    modalOverlay.classList.add("hidden");
}

function tick() { 
    timeLeft--; 
    updateDisplay(); 
    if (timeLeft <= 0) { 
        clearInterval(timer); 
        timer = null; 
        
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
        startAlert();
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
    stopAlert();
    isWork = true; 
    timeLeft = 25 * 60; 
    label.textContent = 'Work Session'; 
    startBtn.textContent = 'Start'; 
    updateDisplay(); 
});

modalOk.addEventListener('click', stopAlert);

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
