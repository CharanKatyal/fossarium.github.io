const input = document.getElementById("input");
const canvas = document.getElementById("canvas");
const barWidthSelect = document.getElementById("bar-width");
const barHeightInput = document.getElementById("bar-height");
const downloadBtn = document.getElementById("download-png");

// CODE128 Table B encoding (simplified for most common characters)
const code128Table = {
    ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000', '$': '10010001100',
    '%': '10001001100', '&': '10011001000', '\'': '10011000100', '(': '10001100100', ')': '11001001000',
    '*': '11001000100', '+': '11000100100', ',': '10110011100', '-': '10011011100', '.': '10011001110',
    '/': '10111001100', '0': '10011101100', '1': '10011100110', '2': '11001110100', '3': '11001110010',
    '4': '11011100100', '5': '11011100010', '6': '11011101100', '7': '11011100110', '8': '11101101100',
    '9': '11101100110', ':': '11100101100', ';': '11100100110', '<': '11101101100', '=': '11101100110',
    '>': '11100110110', '?': '11100110011', '@': '11011011000', 'A': '11011000110', 'B': '11000110110',
    'C': '10101111000', 'D': '10100011110', 'E': '10001011110', 'F': '10111101000', 'G': '10111100010',
    'H': '11110101000', 'I': '11110100010', 'J': '10111011110', 'K': '10111101110', 'L': '11101011110',
    'M': '11110101110', 'N': '11011101110', 'O': '11011110110', 'P': '11110111010', 'Q': '11101111010',
    'R': '11011111010', 'S': '11101111101', 'T': '11111011010', 'U': '11111011101', 'V': '11111101101',
    'W': '11111110110', 'X': '11111110101', 'Y': '11111011110', 'Z': '11111101110', '[': '11111110111',
    '\\': '11101111110', ']': '11110111110', '^': '11111101111', '_': '11111110111', '`': '10110011110',
    'a': '10111100110', 'b': '11101100111', 'c': '11100110111', 'd': '11011011110', 'e': '11011110110',
    'f': '11110110110', 'g': '11110110110', 'h': '11111011011', 'i': '11111101101', 'j': '11111110110',
    'k': '11111110101', 'l': '11111011110', 'm': '11111101110', 'n': '11111110111', 'o': '11101111110',
    'p': '11110111110', 'q': '11111101111', 'r': '11111110111', 's': '10110011110', 't': '10111100110',
    'u': '11101100111', 'v': '11100110111', 'w': '11011011110', 'x': '11011110110', 'y': '11110110110',
    'z': '11110110110', '{': '11111011011', '|': '11111101101', '}': '11111110110', '~': '11111110101'
};

const START_B = '11010010000';
const STOP = '1100011101011';

function calculateChecksum(text) {
    let sum = 104; // Start B value
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) - 32;
        sum += charCode * (i + 1);
    }
    const checksumIndex = sum % 103;
    const charList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    return code128Table[charList[checksumIndex]];
}

function genBarcode() {
    const text = input.value || " ";
    const barWidth = parseInt(barWidthSelect.value);
    const barHeight = parseInt(barHeightInput.value);
    
    let binaryString = START_B;
    for (const char of text) {
        binaryString += code128Table[char] || code128Table[' '];
    }
    binaryString += calculateChecksum(text);
    binaryString += STOP;

    const ctx = canvas.getContext("2d");
    const totalWidth = binaryString.length * barWidth;
    
    canvas.width = totalWidth + 40;
    canvas.height = barHeight + 40;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bars
    ctx.fillStyle = "#000000";
    let x = 20;
    for (const bit of binaryString) {
        if (bit === '1') {
            ctx.fillRect(x, 10, barWidth, barHeight);
        }
        x += barWidth;
    }

    // Text
    ctx.font = "14px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height - 10);
}

function downloadBarcode() {
    const link = document.createElement('a');
    link.download = `barcode-${input.value || 'data'}.png`;
    link.href = canvas.toDataURL();
    link.click();
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

input.addEventListener("input", genBarcode);
barWidthSelect.addEventListener("change", genBarcode);
barHeightInput.addEventListener("input", genBarcode);
downloadBtn.addEventListener("click", downloadBarcode);

initTheme();
genBarcode();
