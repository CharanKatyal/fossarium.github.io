(() => {
    const gridEl = document.getElementById('grid');
    const piecesEl = document.getElementById('pieces');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const SIZE = 8;
    let grid = [], score = 0, best = parseInt(localStorage.getItem('fossarium-hex-best') || '0'), pieces = [];
    bestEl.textContent = best;

    const SHAPES = [
        [[1]], [[1,1]], [[1],[1]], [[1,1,1]], [[1],[1],[1]],
        [[1,1],[1,1]], [[1,1,1],[0,1,0]], [[1,1,0],[0,1,1]],
        [[1,1,1],[1,0,0]], [[0,0,1],[1,1,1]], [[1,1],[1,0],[1,0]]
    ];
    const COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#a55eea', '#00d2d3', '#ff6b81'];

    function init() {
        grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
        score = 0;
        scoreEl.textContent = 0;
        gameoverOverlay.classList.add('hidden');
        renderGrid();
        spawnPieces();
    }

    function renderGrid() {
        gridEl.innerHTML = '';
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell' + (grid[r][c] ? ' filled' : '');
                if (grid[r][c]) cell.style.background = grid[r][c];
                gridEl.appendChild(cell);
            }
        }
    }

    function spawnPieces() {
        piecesEl.innerHTML = '';
        pieces = [];
        for (let i = 0; i < 3; i++) {
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            pieces.push({ shape, color, used: false });

            const pieceEl = document.createElement('div');
            pieceEl.className = 'piece';
            pieceEl.style.gridTemplateColumns = `repeat(${shape[0].length}, 25px)`;
            pieceEl.dataset.idx = i;

            shape.forEach((row, r) => {
                row.forEach((cell, c) => {
                    const cellEl = document.createElement('div');
                    cellEl.className = 'piece-cell' + (cell ? ' filled' : '');
                    if (cell) cellEl.style.background = color;
                    pieceEl.appendChild(cellEl);
                });
            });

            pieceEl.addEventListener('mousedown', e => startDrag(e, i));
            pieceEl.addEventListener('touchstart', e => startDrag(e, i), { passive: false });
            piecesEl.appendChild(pieceEl);
        }
        checkGameOver();
    }

    let draggedPiece = null, dragEl = null, dragOffset = { x: 0, y: 0 };

    function startDrag(e, idx) {
        if (pieces[idx].used) return;
        e.preventDefault();
        draggedPiece = idx;
        dragEl = piecesEl.children[idx];
        dragEl.classList.add('dragging');
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const rect = dragEl.getBoundingClientRect();
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;
        dragEl.style.position = 'fixed';
        dragEl.style.left = (rect.left) + 'px';
        dragEl.style.top = (rect.top) + 'px';
        dragEl.style.zIndex = '1000';

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
        if (!dragEl) return;
        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        dragEl.style.left = (clientX - dragOffset.x) + 'px';
        dragEl.style.top = (clientY - dragOffset.y) + 'px';
    }

    function endDrag(e) {
        if (!dragEl) return;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);

        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        
        const gridRect = gridEl.getBoundingClientRect();
        if (clientX >= gridRect.left && clientX <= gridRect.right &&
            clientY >= gridRect.top && clientY <= gridRect.bottom) {
            const cellSize = gridRect.width / SIZE;
            const col = Math.floor((clientX - dragOffset.x - gridRect.left) / cellSize);
            const row = Math.floor((clientY - dragOffset.y - gridRect.top) / cellSize);
            
            if (canPlace(pieces[draggedPiece].shape, row, col)) {
                placePiece(pieces[draggedPiece].shape, pieces[draggedPiece].color, row, col);
                pieces[draggedPiece].used = true;
                dragEl.style.display = 'none';
                checkLines();
                
                if (pieces.every(p => p.used)) {
                    spawnPieces();
                } else {
                    checkGameOver();
                }
            }
        }

        dragEl.style.position = '';
        dragEl.style.left = '';
        dragEl.style.top = '';
        dragEl.style.zIndex = '';
        dragEl.classList.remove('dragging');
        dragEl = null;
        draggedPiece = null;
    }

    function canPlace(shape, startRow, startCol) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const nr = startRow + r, nc = startCol + c;
                    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || grid[nr][nc]) return false;
                }
            }
        }
        return true;
    }

    function placePiece(shape, color, startRow, startCol) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    grid[startRow + r][startCol + c] = color;
                }
            }
        }
        score += shape.flat().filter(x => x).length;
        scoreEl.textContent = score;
        renderGrid();
    }

    function checkLines() {
        let linesCleared = 0;
        const rowsToClear = [], colsToClear = [];

        for (let r = 0; r < SIZE; r++) {
            if (grid[r].every(c => c)) rowsToClear.push(r);
        }
        for (let c = 0; c < SIZE; c++) {
            if (grid.every(row => row[c])) colsToClear.push(c);
        }

        rowsToClear.forEach(r => {
            for (let c = 0; c < SIZE; c++) grid[r][c] = null;
            linesCleared++;
        });
        colsToClear.forEach(c => {
            for (let r = 0; r < SIZE; r++) grid[r][c] = null;
            linesCleared++;
        });

        if (linesCleared > 0) {
            score += linesCleared * 10;
            scoreEl.textContent = score;
            renderGrid();
        }
    }

    function checkGameOver() {
        const availablePieces = pieces.filter(p => !p.used);
        if (availablePieces.length === 0) return;

        for (const piece of availablePieces) {
            for (let r = 0; r < SIZE; r++) {
                for (let c = 0; c < SIZE; c++) {
                    if (canPlace(piece.shape, r, c)) return;
                }
            }
        }

        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-hex-best', best);
            bestEl.textContent = best;
        }
        document.getElementById('final-score').textContent = score;
        gameoverOverlay.classList.remove('hidden');
    }

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
