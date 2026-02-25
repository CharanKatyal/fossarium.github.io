const slider = document.getElementById('bpm-slider'), bpmVal = document.getElementById('bpm-val'), startBtn = document.getElementById('start-btn'), indicator = document.getElementById('indicator');
let bpm = 120, timer = null, running = false, audioCtx = null;

function click() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
    indicator.classList.add('active');
    setTimeout(() => indicator.classList.remove('active'), 100);
}

function start() {
    if (running) { clearInterval(timer); running = false; startBtn.textContent = 'Start'; return; }
    running = true; startBtn.textContent = 'Stop';
    click();
    timer = setInterval(click, 60000 / bpm);
}

slider.addEventListener('input', () => { bpm = parseInt(slider.value); bpmVal.textContent = bpm; if (running) { clearInterval(timer); timer = setInterval(click, 60000 / bpm); } });
startBtn.addEventListener('click', start);

// Tap tempo
let taps = [];
document.getElementById('tap-btn').addEventListener('click', () => {
    const now = Date.now();
    taps.push(now);
    if (taps.length > 4) taps = taps.slice(-4);
    if (taps.length >= 2) {
        const diffs = [];
        for (let i = 1; i < taps.length; i++) diffs.push(taps[i] - taps[i - 1]);
        const avg = diffs.reduce((a, b) => a + b) / diffs.length;
        bpm = Math.round(60000 / avg);
        bpm = Math.max(30, Math.min(300, bpm));
        slider.value = bpm; bpmVal.textContent = bpm;
        if (running) { clearInterval(timer); timer = setInterval(click, 60000 / bpm); }
    }
});
