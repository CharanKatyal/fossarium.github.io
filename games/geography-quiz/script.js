(() => {
    const scoreEl = document.getElementById('score');
    const streakEl = document.getElementById('streak');
    const categoryEl = document.getElementById('category');
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const helpOverlay = document.getElementById('help-overlay');

    const QUESTIONS = [
        { category: 'Capitals', q: 'What is the capital of France?', a: ['Paris', 'London', 'Berlin', 'Madrid'], correct: 0 },
        { category: 'Capitals', q: 'What is the capital of Japan?', a: ['Tokyo', 'Seoul', 'Beijing', 'Bangkok'], correct: 0 },
        { category: 'Capitals', q: 'What is the capital of Australia?', a: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], correct: 0 },
        { category: 'Capitals', q: 'What is the capital of Brazil?', a: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], correct: 0 },
        { category: 'Capitals', q: 'What is the capital of Canada?', a: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], correct: 0 },
        { category: 'Countries', q: 'Which country has the largest population?', a: ['China', 'India', 'USA', 'Indonesia'], correct: 0 },
        { category: 'Countries', q: 'Which country is known as the Land of the Rising Sun?', a: ['Japan', 'China', 'Korea', 'Thailand'], correct: 0 },
        { category: 'Countries', q: 'Which country has the most islands?', a: ['Sweden', 'Philippines', 'Indonesia', 'Canada'], correct: 0 },
        { category: 'Landmarks', q: 'Where is the Eiffel Tower located?', a: ['Paris', 'London', 'Rome', 'Berlin'], correct: 0 },
        { category: 'Landmarks', q: 'Which pyramid is the largest?', a: ['Great Pyramid of Giza', 'Pyramid of the Sun', 'Louvre Pyramid', 'Transamerica Pyramid'], correct: 0 },
        { category: 'Rivers', q: 'What is the longest river in the world?', a: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], correct: 0 },
        { category: 'Rivers', q: 'Which river flows through London?', a: ['Thames', 'Seine', 'Danube', 'Rhine'], correct: 0 },
        { category: 'Oceans', q: 'What is the largest ocean?', a: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 0 },
        { category: 'Oceans', q: 'Which ocean is between Europe and America?', a: ['Atlantic', 'Pacific', 'Indian', 'Southern'], correct: 0 },
        { category: 'Continents', q: 'Which continent is the Sahara Desert in?', a: ['Africa', 'Asia', 'Australia', 'South America'], correct: 0 },
        { category: 'Continents', q: 'Which continent has the most countries?', a: ['Africa', 'Europe', 'Asia', 'North America'], correct: 0 },
        { category: 'Flags', q: 'Which country has a red maple leaf on its flag?', a: ['Canada', 'Japan', 'China', 'Switzerland'], correct: 0 },
        { category: 'Flags', q: 'Which country has a dragon on its flag?', a: ['Wales', 'China', 'Bhutan', 'All of these'], correct: 3 },
        { category: 'Mountains', q: 'What is the highest mountain in the world?', a: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'], correct: 0 },
        { category: 'Mountains', q: 'Which mountain range separates Europe and Asia?', a: ['Ural Mountains', 'Alps', 'Himalayas', 'Andes'], correct: 0 },
        { category: 'Cities', q: 'Which city is known as the Big Apple?', a: ['New York', 'Los Angeles', 'Chicago', 'Miami'], correct: 0 },
        { category: 'Cities', q: 'Which city has the most skyscrapers?', a: ['Dubai', 'New York', 'Hong Kong', 'Shanghai'], correct: 0 },
        { category: 'Borders', q: 'Which country borders both France and Spain?', a: ['Andorra', 'Portugal', 'Italy', 'Switzerland'], correct: 0 },
        { category: 'Borders', q: 'How many states does the USA have?', a: ['50', '48', '52', '51'], correct: 0 },
        { category: 'Islands', q: 'What is the largest island in the world?', a: ['Greenland', 'Australia', 'New Guinea', 'Borneo'], correct: 0 },
        { category: 'Islands', q: 'Which island is known for its moai statues?', a: ['Easter Island', 'Hawaii', 'Fiji', 'Tahiti'], correct: 0 },
        { category: 'Deserts', q: 'What is the largest hot desert?', a: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'], correct: 0 },
        { category: 'Deserts', q: 'Which desert is in South America?', a: ['Atacama', 'Sahara', 'Gobi', 'Mojave'], correct: 0 },
        { category: 'Lakes', q: 'What is the largest freshwater lake by volume?', a: ['Lake Baikal', 'Lake Superior', 'Caspian Sea', 'Lake Victoria'], correct: 0 },
        { category: 'Lakes', q: 'Which lake is between the USA and Canada?', a: ['Lake Superior', 'Lake Victoria', 'Lake Titicaca', 'Caspian Sea'], correct: 0 }
    ];

    let score = 0, streak = 0, currentQuestion = null;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomQuestion() {
        const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        const answers = q.a.map((a, i) => ({ text: a, correct: i === q.correct }));
        shuffle(answers);
        return { ...q, answers };
    }

    function loadQuestion() {
        currentQuestion = getRandomQuestion();
        categoryEl.textContent = currentQuestion.category;
        questionEl.textContent = currentQuestion.q;
        answersEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        nextBtn.style.display = 'none';

        currentQuestion.answers.forEach((ans, idx) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = ans.text;
            btn.addEventListener('click', () => selectAnswer(idx, btn));
            answersEl.appendChild(btn);
        });
    }

    function selectAnswer(selectedIdx, btn) {
        const buttons = answersEl.querySelectorAll('.answer-btn');
        buttons.forEach(b => b.disabled = true);

        const isCorrect = currentQuestion.answers[selectedIdx].correct;
        
        if (isCorrect) {
            btn.classList.add('correct');
            score += 10 + streak * 2;
            streak++;
            feedbackEl.textContent = '✓ Correct!';
            feedbackEl.className = 'feedback correct';
        } else {
            btn.classList.add('wrong');
            streak = 0;
            feedbackEl.textContent = '✗ Wrong!';
            feedbackEl.className = 'feedback wrong';
            
            // Show correct answer
            currentQuestion.answers.forEach((ans, idx) => {
                if (ans.correct) buttons[idx].classList.add('correct');
            });
        }

        scoreEl.textContent = score;
        streakEl.textContent = streak;
        nextBtn.style.display = 'block';
    }

    // Event listeners
    nextBtn.addEventListener('click', loadQuestion);
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

    loadQuestion();
})();
