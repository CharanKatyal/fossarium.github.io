(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const clearBtn = document.getElementById('clear-btn');
    const randomBtn = document.getElementById('random-btn');
    const speedSlider = document.getElementById('speed');
    const patternSelect = document.getElementById('pattern-select');
    const loadPatternBtn = document.getElementById('load-pattern-btn');
    const generationEl = document.getElementById('generation');
    const populationEl = document.getElementById('population');
    const helpOverlay = document.getElementById('help-overlay');

    const COLS = 40;
    const ROWS = 30;
    let cellSize;
    let grid = [];
    let running = false;
    let generation = 0;
    let animationId;
    let lastUpdate = 0;
    let fps = 30;

    // All patterns as 2D arrays (1 = alive, 0 = dead)
    const PATTERNS = {
        // Still Lifes
        block: [[0,1,1,0],[0,1,1,0]],
        beehive: [[0,0,1,1,0,0],[0,1,0,0,1,0],[0,0,1,1,0,0]],
        loaf: [[0,0,1,1,0],[0,1,0,0,1],[0,0,1,0,1],[0,0,0,1,0]],
        boat: [[0,1,1,0,0],[1,0,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
        tub: [[0,0,1,0,0],[0,1,0,1,0],[0,0,1,0,0]],
        snake: [[0,0,0,1,1,0],[0,0,1,1,0,0],[0,1,1,0,0,0],[0,0,1,0,0,0]],
        eater: [[0,0,0,1,1,0],[0,0,1,0,0,1],[0,1,0,0,1,0],[0,0,1,0,1,0],[0,0,0,1,0,0]],
        
        // Oscillators
        blinker: [[1,1,1]],
        toad: [[0,1,1,1,0,0],[0,0,1,1,1,0]],
        beacon: [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]],
        pulsar: [
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0]
        ],
        clock: [[0,0,1,1],[0,0,1,0],[0,0,1,0],[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]],
        pentadecathlon: [[0,1,0],[0,1,0],[1,0,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[1,0,1],[0,1,0],[0,1,0]],
        figure8: [[1,1,0,0,0,0],[1,1,0,0,0,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,0,0,0,1,1],[0,0,0,0,1,1]],
        
        // Spaceships
        glider: [[0,1,0],[0,0,1],[1,1,1]],
        lwss: [[0,1,1,1,1],[1,0,0,0,1],[0,0,0,0,1],[1,0,0,1,0]],
        mwss: [[0,1,1,1,1,1],[1,0,0,0,0,1],[0,0,0,0,0,1],[1,0,0,0,1,0]],
        hwss: [[0,1,1,1,1,1,1],[1,0,0,0,0,0,1],[0,0,0,0,0,0,1],[1,0,0,0,0,1,0]],
        copperhead: [[1,1,0,0,1,1],[1,1,0,1,1,1],[1,1,0,1,1,1],[0,1,1,1,1,0],[0,0,1,1,0,0],[0,0,1,1,0,0]],
        gemini: [[0,1,1,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,0,1,1],[0,0,1,0,0]],
        
        // Methuselahs
        rpentomino: [[0,1,1],[1,1,0],[0,1,0]],
        acorn: [[0,1,0,0,0,0,0],[0,0,0,1,0,0,0],[1,1,0,0,1,1,1]],
        diehard: [[0,0,0,0,0,0,1,0],[1,1,0,0,0,0,0,0],[0,1,0,0,0,1,1,1]],
        bunnies: [[0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,0,0,1,1,0]],
        century: [[0,0,1,1,0],[1,1,0,0,0],[0,1,0,0,0]],
        
        // Guns & Engines
        gospergun: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        simkingun: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,1,0,0,0,0,1,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        puffer: [
            [0,0,0,0,1,0,0,0,0],
            [0,0,1,0,1,0,0,0,0],
            [0,1,1,1,1,1,0,0,0],
            [0,0,1,0,1,0,0,0,0],
            [0,0,0,0,1,0,0,0,0],
            [1,0,0,0,0,0,0,0,1],
            [0,1,0,0,0,0,0,1,0],
            [0,0,1,0,0,0,1,0,0],
            [0,0,0,1,1,1,0,0,0]
        ],
        spacefiller: [
            [1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1],
            [1,0,1,0,1,0,1],
            [1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ],
        breeder: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    };

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = Math.floor(rect.width * ROWS / COLS);
        cellSize = Math.floor(canvas.width / COLS);
        draw();
    }

    function createGrid() {
        return Array(COLS).fill(null).map(() => Array(ROWS).fill(0));
    }

    function init() {
        grid = createGrid();
        generation = 0;
        updateStats();
        resize();
    }

    function draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cell-dead').trim() || 'rgba(0,0,0,0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let population = 0;
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                if (grid[col][row] === 1) {
                    population++;
                    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cell-alive').trim() || '#2ed573';
                    ctx.fillRect(
                        col * cellSize + 1,
                        row * cellSize + 1,
                        cellSize - 2,
                        cellSize - 2
                    );
                }
            }
        }
        populationEl.textContent = population;
    }

    function countNeighbors(col, row) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                const c = (col + i + COLS) % COLS;
                const r = (row + j + ROWS) % ROWS;
                sum += grid[c][r];
            }
        }
        return sum;
    }

    function nextGeneration() {
        const newGrid = createGrid();
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                const neighbors = countNeighbors(col, row);
                const cell = grid[col][row];
                
                if (cell === 1 && neighbors < 2) {
                    newGrid[col][row] = 0; // Underpopulation
                } else if (cell === 1 && neighbors > 3) {
                    newGrid[col][row] = 0; // Overpopulation
                } else if (cell === 0 && neighbors === 3) {
                    newGrid[col][row] = 1; // Reproduction
                } else {
                    newGrid[col][row] = cell; // Survival
                }
            }
        }
        grid = newGrid;
        generation++;
        updateStats();
    }

    function updateStats() {
        generationEl.textContent = generation;
    }

    function gameLoop(timestamp) {
        if (!running) return;
        
        const interval = 1000 / fps;
        if (timestamp - lastUpdate >= interval) {
            nextGeneration();
            draw();
            lastUpdate = timestamp;
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }

    function start() {
        running = !running;
        startBtn.textContent = running ? '⏸ Pause' : '▶ Start';
        startBtn.classList.toggle('active', running);
        if (running) {
            gameLoop(0);
        } else {
            cancelAnimationFrame(animationId);
        }
    }

    function clear() {
        running = false;
        startBtn.textContent = '▶ Start';
        startBtn.classList.remove('active');
        cancelAnimationFrame(animationId);
        grid = createGrid();
        generation = 0;
        updateStats();
        draw();
    }

    function random() {
        grid = Array(COLS).fill(null).map(() => 
            Array(ROWS).fill(null).map(() => Math.random() > 0.7 ? 1 : 0)
        );
        generation = 0;
        updateStats();
        draw();
    }

    function handleCanvasClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
            grid[col][row] = grid[col][row] ? 0 : 1;
            draw();
        }
    }

    function loadPattern(patternName) {
        const pattern = PATTERNS[patternName];
        if (!pattern) return;
        
        clear();
        
        const offsetX = Math.floor((COLS - pattern[0].length) / 2);
        const offsetY = Math.floor((ROWS - pattern.length) / 2);
        
        pattern.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell && offsetX + c >= 0 && offsetX + c < COLS && offsetY + r >= 0 && offsetY + r < ROWS) {
                    grid[offsetX + c][offsetY + r] = 1;
                }
            });
        });
        
        draw();
    }

    // Event listeners
    startBtn.addEventListener('click', start);
    clearBtn.addEventListener('click', clear);
    randomBtn.addEventListener('click', random);
    loadPatternBtn.addEventListener('click', () => loadPattern(patternSelect.value));

    speedSlider.addEventListener('input', (e) => {
        fps = parseInt(e.target.value);
    });

    canvas.addEventListener('click', handleCanvasClick);
    
    // Help overlay
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

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

    window.addEventListener('resize', resize);
    init();
})();
