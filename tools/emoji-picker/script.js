const emojis = ["😀", "😂", "🤣", "😊", "😍", "🥰", "😎", "🤔", "😴", "🤯", "😱", "🥳", "🫡", "🤗", "😈", "👻", "💀", "🤖", "👽", "🎃", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💯", "🔥", "⭐", "✨", "🌈", "🌞", "🌙", "⚡", "🎉", "🎊", "🎵", "🎶", "🏆", "⚽", "🏀", "🎯", "🎮", "🕹️", "🧩", "♟️", "🎨", "🖌️", "📝", "📌", "📎", "✂️", "🔑", "🔒", "🔓", "💡", "🔔", "📢", "🚀", "✈️", "🚗", "🚲", "⛵", "🏠", "🏢", "🌍", "🌎", "🌏", "🍕", "🍔", "🍟", "🍩", "🍪", "☕", "🍺", "🍷", "🥤", "🍿", "👍", "👎", "👏", "🤝", "✌️", "🤞", "👋", "🖐️", "✋", "💪", "🧠", "👀", "👁️", "👂", "👃", "👄", "🦷", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🦁", "🐯", "🐮", "🐷", "🐵", "🐔", "🐧", "🐦", "🦅", "🦆", "🦉", "🐴", "🦄", "🐝", "🐛", "🦋", "🐢", "🐍", "🦎", "🐙", "🦀", "🐠", "🐳", "🐬", "🌸", "🌺", "🌻", "🌹", "🌷", "🌵", "🎄", "🎋", "🍀", "🍁", "🍂", "🍃", "🌾"];

const grid = document.getElementById("grid");
const search = document.getElementById("search");

function render(filter = "") {
    const f = filter.toLowerCase();
    grid.innerHTML = emojis
        .filter(e => !f || e.includes(f))
        .map(e => `<button class="emoji-btn" title="Click to copy">${e}</button>`)
        .join("");
}

function copyEmoji(e) {
    if (e.target.classList.contains("emoji-btn")) {
        const emoji = e.target.textContent;
        navigator.clipboard.writeText(emoji);
        
        // Visual feedback
        const btn = e.target;
        const originalScale = btn.style.transform;
        btn.style.transform = "scale(1.5)";
        btn.style.borderColor = "var(--accent-color)";
        
        setTimeout(() => {
            btn.style.transform = originalScale;
            btn.style.borderColor = "transparent";
        }, 200);
    }
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

grid.addEventListener("click", copyEmoji);
search.addEventListener("input", () => render(search.value));

initTheme();
render();
