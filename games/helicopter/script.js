(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const W = 600, H = 300;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);

    let helicopter, walls, score, best, running, thrusting, distance, speed;
    best = parseInt(localStorage.getItem('fossarium-helicopter-best') || '0');
    bestEl.textContent = best;

    function init() {
        helicopter = { x: 100, y: H / 2, vy: 0, width: 50, height: 24 };
        walls = [];
        score = 0;
        distance = 0;
        speed = 4;
        running = false;
        thrusting = false;
        gameoverOverlay.classList.add('hidden');
        msgEl.textContent = 'Hold Click or Space to Fly';
        scoreEl.textContent = 0;
        
        // Create initial walls - spread across screen width
        for (let i = 0; i < 20; i++) {
            walls.push({
                x: i * 100 - 100,
                topHeight: 30 + Math.random() * 30,
                bottomHeight: 30 + Math.random() * 30
            });
        }
        draw();
    }

    function thrust() {
        helicopter.vy -= 0.6;
    }

    function spawnWall() {
        const lastWall = walls[walls.length - 1];
        const gapChange = (Math.random() - 0.5) * 15;
        const newTop = Math.max(25, Math.min(70, lastWall.topHeight + gapChange));
        const newBottom = Math.max(25, Math.min(70, lastWall.bottomHeight + gapChange));
        
        walls.push({
            x: lastWall.x + 100,
            topHeight: newTop,
            bottomHeight: newBottom
        });
    }

    function draw() {
        const isLight = document.documentElement.classList.contains('light-theme');
        
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        if (isLight) {
            skyGrad.addColorStop(0, '#34495e');
            skyGrad.addColorStop(1, '#1a1a2e');
        } else {
            skyGrad.addColorStop(0, '#0a0e18');
            skyGrad.addColorStop(1, '#1a0a2e');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        // Draw walls
        ctx.fillStyle = isLight ? '#34495e' : '#2d1b4e';
        ctx.strokeStyle = isLight ? '#5d6d7e' : '#4a3b5e';
        ctx.lineWidth = 8;
        
        walls.forEach(wall => {
            const drawX = wall.x - distance;
            
            // Only skip if completely off screen
            if (drawX < -120 || drawX > W + 10) return;
            
            const w = 110; // Wall width with overlap
            
            // Top wall
            ctx.beginPath();
            ctx.moveTo(drawX, 0);
            ctx.lineTo(drawX + w, 0);
            ctx.lineTo(drawX + w, wall.topHeight);
            ctx.quadraticCurveTo(drawX + w/2, wall.topHeight + 12, drawX, wall.topHeight);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Bottom wall
            ctx.beginPath();
            ctx.moveTo(drawX, H);
            ctx.lineTo(drawX + w, H);
            ctx.lineTo(drawX + w, H - wall.bottomHeight);
            ctx.quadraticCurveTo(drawX + w/2, H - wall.bottomHeight - 12, drawX, H - wall.bottomHeight);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        drawHelicopter(isLight);

        // Speed lines
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const lineX = ((distance) + i * 120) % W;
            ctx.beginPath();
            ctx.moveTo(lineX, 40 + i * 35);
            ctx.lineTo(lineX - 40, 40 + i * 35);
            ctx.stroke();
        }
    }

    function drawHelicopter(isLight) {
        const hx = helicopter.x;
        const hy = helicopter.y;
        const w = helicopter.width;
        const h = helicopter.height;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(hx + w/2, hy + h + 8, w/2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(hx + 10, hy + h/2);
        ctx.quadraticCurveTo(hx - 20, hy + h/2, hx - 35, hy + h/2 + 5);
        ctx.lineTo(hx - 35, hy + h/2 + 12);
        ctx.quadraticCurveTo(hx - 20, hy + h/2 + 8, hx + 10, hy + h/2 + 8);
        ctx.closePath();
        ctx.fill();
        
        // Tail fin
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(hx - 35, hy + h/2 + 5);
        ctx.lineTo(hx - 45, hy + h/2);
        ctx.lineTo(hx - 35, hy + h/2 + 15);
        ctx.closePath();
        ctx.fill();
        
        // Body
        const bodyGrad = ctx.createLinearGradient(hx, hy, hx + w, hy + h);
        bodyGrad.addColorStop(0, '#ff6b81');
        bodyGrad.addColorStop(1, '#e74c3c');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(hx + w/2, hy + h/2, w/2 + 5, h/2 + 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cockpit
        const cockpitGrad = ctx.createRadialGradient(hx + w - 15, hy + 8, 2, hx + w - 15, hy + 8, 18);
        cockpitGrad.addColorStop(0, isLight ? '#74b9ff' : '#0984e3');
        cockpitGrad.addColorStop(1, isLight ? '#a29bfe' : '#6c5ce7');
        ctx.fillStyle = cockpitGrad;
        ctx.beginPath();
        ctx.arc(hx + w - 12, hy + 10, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(hx + w - 16, hy + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Rotor mast
        ctx.fillStyle = '#636e72';
        ctx.fillRect(hx + w/2 - 2, hy - 15, 4, 18);
        
        // Rotor
        const rotorAngle = Math.sin(distance * 0.08) * 12;
        ctx.fillStyle = '#a55eea';
        ctx.beginPath();
        ctx.roundRect(hx + w/2 - rotorAngle - 15, hy - 18, rotorAngle * 2 + 30, 6, 3);
        ctx.fill();
        
        // Hub
        ctx.fillStyle = '#8854d0';
        ctx.beginPath();
        ctx.arc(hx + w/2, hy - 15, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Flame
        if (thrusting && running) {
            const flameLen = 20 + Math.random() * 15;
            const flameGrad = ctx.createLinearGradient(hx - 35, hy + h/2 + 8, hx - 35 - flameLen, hy + h/2 + 8);
            flameGrad.addColorStop(0, '#f39c12');
            flameGrad.addColorStop(0.5, '#e74c3c');
            flameGrad.addColorStop(1, 'rgba(231,76,60,0)');
            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.moveTo(hx - 35, hy + h/2 + 5);
            ctx.lineTo(hx - 35 - flameLen, hy + h/2 + 10);
            ctx.lineTo(hx - 35, hy + h/2 + 15);
            ctx.closePath();
            ctx.fill();
        }
        
        // Skids
        ctx.strokeStyle = '#636e72';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hx + 15, hy + h + 5);
        ctx.lineTo(hx + 15, hy + h + 12);
        ctx.lineTo(hx + w - 10, hy + h + 12);
        ctx.lineTo(hx + w - 10, hy + h + 5);
        ctx.stroke();
    }

    function update() {
        if (thrusting) thrust();
        
        helicopter.vy += 0.25;
        helicopter.y += helicopter.vy;

        // Move forward
        distance += speed;

        // Spawn new walls when needed
        const lastWall = walls[walls.length - 1];
        if (lastWall.x - distance < W + 100) {
            spawnWall();
        }

        // Remove old walls
        if (walls.length > 25 && walls[0].x - distance < -200) {
            walls.shift();
        }

        // Collision detection
        const heliLeft = helicopter.x + 8;
        const heliRight = helicopter.x + helicopter.width - 8;
        const heliTop = helicopter.y + 6;
        const heliBottom = helicopter.y + helicopter.height - 4;
        
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const wallX = wall.x - distance;
            
            // Skip far walls
            if (wallX > heliRight + 20 || wallX < heliLeft - 120) continue;
            
            // Check collision
            if (heliRight > wallX && heliLeft < wallX + 110) {
                if (heliTop < wall.topHeight - 3 || heliBottom > H - wall.bottomHeight + 3) {
                    gameOver();
                    return;
                }
            }
        }

        // Boundaries
        if (helicopter.y < 0) {
            helicopter.y = 0;
            helicopter.vy = 0;
        }
        if (helicopter.y + helicopter.height > H) {
            helicopter.y = H - helicopter.height;
            helicopter.vy = 0;
        }

        // Score based on distance
        score = Math.floor(distance / 10);
        scoreEl.textContent = score;

        // Speed up
        if (distance % 900 === 0 && speed < 10) {
            speed += 0.4;
        }

        draw();
    }

    function gameOver() {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-helicopter-best', best);
            bestEl.textContent = best;
        }
        document.getElementById('final-score').textContent = score;
        gameoverOverlay.classList.remove('hidden');
    }

    function loop() {
        if (!running) return;
        update();
        requestAnimationFrame(loop);
    }

    function startGame() {
        if (running) return;
        running = true;
        msgEl.textContent = '';
        loop();
    }

    // Controls
    canvas.addEventListener('mousedown', () => { thrusting = true; startGame(); });
    canvas.addEventListener('mouseup', () => { thrusting = false; });
    canvas.addEventListener('mouseleave', () => { thrusting = false; });
    
    canvas.addEventListener('touchstart', e => { 
        e.preventDefault(); 
        thrusting = true; 
        startGame(); 
    }, { passive: false });
    canvas.addEventListener('touchend', e => { 
        e.preventDefault(); 
        thrusting = false; 
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Space') { 
            e.preventDefault(); 
            thrusting = true; 
            startGame(); 
        }
    });
    document.addEventListener('keyup', e => {
        if (e.code === 'Space') { 
            e.preventDefault(); 
            thrusting = false; 
        }
    });

    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');

    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    init();
})();
