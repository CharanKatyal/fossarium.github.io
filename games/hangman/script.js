(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const categoryEl = document.getElementById('category');
    const wordEl = document.getElementById('word');
    const keyboardEl = document.getElementById('keyboard');
    const livesEl = document.getElementById('lives');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const WORDS = {
        'Programming': ['JAVASCRIPT', 'PYTHON', 'VARIABLE', 'FUNCTION', 'BROWSER', 'SERVER', 'DATABASE', 'INTERFACE', 'SYNTAX', 'COMPILE'],
        'Animals': ['ELEPHANT', 'GIRAFFE', 'DOLPHIN', 'KANGAROO', 'BUTTERFLY', 'PENGUIN', 'CHEETAH', 'HAMSTER', 'OCTOPUS', 'EAGLE'],
        'Countries': ['AUSTRALIA', 'BRAZIL', 'CANADA', 'DENMARK', 'EGYPT', 'FINLAND', 'GERMANY', 'HUNGARY', 'ICELAND', 'JAPAN'],
        'Fruits': ['APPLE', 'BANANA', 'ORANGE', 'STRAWBERRY', 'PINEAPPLE', 'MANGO', 'WATERMELON', 'GRAPE', 'CHERRY', 'PEACH'],
        'Sports': ['BASKETBALL', 'FOOTBALL', 'TENNIS', 'SWIMMING', 'CRICKET', 'VOLLEYBALL', 'HOCKEY', 'BASEBALL', 'GOLF', 'RUGBY']
    };

    let currentWord = '', currentCategory = '', guessedLetters = [], wrongGuesses = 0, gameOver = false;
    const maxWrong = 6;

    function pickWord() {
        const categories = Object.keys(WORDS);
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = WORDS[currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)];
    }

    function init() {
        pickWord();
        guessedLetters = [];
        wrongGuesses = 0;
        gameOver = false;
        categoryEl.textContent = `Category: ${currentCategory}`;
        gameoverOverlay.classList.add('hidden');
        updateWord();
        renderKeyboard();
        drawHangman(0);
        livesEl.textContent = `Lives: ${maxWrong - wrongGuesses}`;
    }

    function updateWord() {
        wordEl.textContent = currentWord.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ');
        
        if (!gameOver && !currentWord.split('').some(l => !guessedLetters.includes(l))) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
            document.getElementById('final-word').textContent = currentWord;
            gameoverOverlay.classList.remove('hidden');
        }
    }

    function renderKeyboard() {
        keyboardEl.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.textContent = letter;
            
            if (guessedLetters.includes(letter)) {
                btn.disabled = true;
                if (currentWord.includes(letter)) btn.classList.add('correct');
                else btn.classList.add('wrong');
            }
            
            btn.addEventListener('click', () => guessLetter(letter));
            keyboardEl.appendChild(btn);
        }
    }

    function guessLetter(letter) {
        if (gameOver || guessedLetters.includes(letter)) return;
        
        guessedLetters.push(letter);
        
        if (!currentWord.includes(letter)) {
            wrongGuesses++;
            livesEl.textContent = `Lives: ${maxWrong - wrongGuesses}`;
            drawHangman(wrongGuesses);
            
            if (wrongGuesses >= maxWrong) {
                gameOver = true;
                document.getElementById('go-icon').textContent = '💀';
                document.getElementById('go-title').textContent = 'Game Over!';
                document.getElementById('final-word').textContent = currentWord;
                gameoverOverlay.classList.remove('hidden');
            }
        }
        
        updateWord();
        renderKeyboard();
    }

    function drawHangman(parts) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#e6edf3';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Base structure
        ctx.beginPath();
        ctx.moveTo(20, 180); ctx.lineTo(80, 180); ctx.lineTo(50, 180); ctx.lineTo(50, 20); ctx.lineTo(120, 20); ctx.lineTo(120, 40);
        ctx.stroke();

        // Parts based on wrong guesses
        if (parts >= 1) { // Head
            ctx.beginPath();
            ctx.arc(120, 55, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (parts >= 2) { // Body
            ctx.beginPath();
            ctx.moveTo(120, 70); ctx.lineTo(120, 120);
            ctx.stroke();
        }
        if (parts >= 3) { // Left arm
            ctx.beginPath();
            ctx.moveTo(120, 80); ctx.lineTo(90, 100);
            ctx.stroke();
        }
        if (parts >= 4) { // Right arm
            ctx.beginPath();
            ctx.moveTo(120, 80); ctx.lineTo(150, 100);
            ctx.stroke();
        }
        if (parts >= 5) { // Left leg
            ctx.beginPath();
            ctx.moveTo(120, 120); ctx.lineTo(90, 150);
            ctx.stroke();
        }
        if (parts >= 6) { // Right leg
            ctx.beginPath();
            ctx.moveTo(120, 120); ctx.lineTo(150, 150);
            ctx.stroke();
        }
    }

    // Event listeners
    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Physical keyboard support (PC/Laptop only - disabled on touch devices)
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    if (!isTouchDevice()) {
        document.addEventListener('keydown', e => {
            if (gameOver) return;
            const letter = e.key.toUpperCase();
            if (letter >= 'A' && letter <= 'Z' && letter.length === 1) {
                // Highlight the key on virtual keyboard
                const keyBtn = Array.from(keyboardEl.querySelectorAll('.key-btn'))
                    .find(btn => btn.textContent === letter);
                if (keyBtn && !keyBtn.disabled) {
                    keyBtn.style.transform = 'scale(0.9)';
                    keyBtn.style.background = 'var(--accent-color)';
                    setTimeout(() => {
                        keyBtn.style.transform = '';
                        keyBtn.style.background = '';
                    }, 150);
                }
                guessLetter(letter);
            }
        });
    }

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
