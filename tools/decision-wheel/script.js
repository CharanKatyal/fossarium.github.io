const canvas = document.getElementById("wheel"),
    ctx = canvas.getContext("2d"),
    W = 300,
    R = 140;

const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#a55eea", "#ff6348", "#eccc68", "#ff6b81", "#7bed9f", "#70a1ff"];

function draw(opts, angle) {
    ctx.clearRect(0, 0, W, W);
    const n = opts.length,
        arc = Math.PI * 2 / n;
    opts.forEach((o, i) => {
        ctx.beginPath();
        ctx.moveTo(W / 2, W / 2);
        ctx.arc(W / 2, W / 2, R, angle + i * arc, angle + (i + 1) * arc);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.save();
        ctx.translate(W / 2, W / 2);
        ctx.rotate(angle + i * arc + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "right";
        ctx.fillText(o.slice(0, 15), R - 20, 5);
        ctx.restore();
    });
}

let spinning = false;
const spinBtn = document.getElementById("spin-btn");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result");
const optionsInput = document.getElementById("options");

spinBtn.addEventListener("click", () => {
    if (spinning) return;
    const opts = optionsInput.value.trim().split("\n").filter(Boolean);
    if (opts.length < 2) {
        alert("Please enter at least 2 options.");
        return;
    }
    
    spinning = true;
    resultBox.style.display = "none";
    
    let angle = Math.random() * Math.PI * 2,
        speed = 0.4 + Math.random() * 0.3;
    
    function animate() {
        angle += speed;
        speed *= 0.985;
        draw(opts, angle);
        if (speed > 0.002) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            // The pointer is at the top (3*PI/2)
            // We need to calculate which slice is at that position
            const sliceSize = Math.PI * 2 / opts.length;
            const normalizedAngle = ((1.5 * Math.PI - angle) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
            const idx = Math.floor(normalizedAngle / sliceSize);
            
            resultText.textContent = opts[idx % opts.length];
            resultBox.style.display = "block";
        }
    }
    animate();
});

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

optionsInput.addEventListener("input", () => {
    const opts = optionsInput.value.trim().split("\n").filter(Boolean);
    if (opts.length >= 2) draw(opts, 0);
});

initTheme();
draw(optionsInput.value.trim().split("\n").filter(Boolean), 0);
