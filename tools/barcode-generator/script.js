const input = document.getElementById("input");
const canvas = document.getElementById("canvas");
const barWidthSelect = document.getElementById("bar-width");
const barHeightInput = document.getElementById("bar-height");
const downloadBtn = document.getElementById("download-png");

// Full Code 128 pattern table (Values 0 to 106)
const CODE128_PATTERNS = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function widthsToBinary(widths) {
    let binary = '';
    let isBlack = true; // Every character starts with a black bar
    for (let i = 0; i < widths.length; i++) {
        binary += (isBlack ? '1' : '0').repeat(parseInt(widths[i]));
        isBlack = !isBlack;
    }
    return binary;
}

function calculateChecksum(text) {
    let sum = 104; // Start Code B value
    for (let i = 0; i < text.length; i++) {
        let val = text.charCodeAt(i) - 32;
        if (val < 0 || val > 95) val = 0; // Replace non-standard characters with space
        sum += val * (i + 1);
    }
    return sum % 103;
}

function genBarcode() {
    const text = input.value || " ";
    const barWidth = parseInt(barWidthSelect.value);
    const barHeight = parseInt(barHeightInput.value);
    
    // 1. Build binary string: Start B (Index 104)
    let binaryString = widthsToBinary(CODE128_PATTERNS[104]);
    
    // 2. Data
    for (const char of text) {
        let val = char.charCodeAt(0) - 32;
        if (val < 0 || val > 95) val = 0; 
        binaryString += widthsToBinary(CODE128_PATTERNS[val]);
    }
    
    // 3. Modulo 103 Checksum
    const checksumIndex = calculateChecksum(text);
    binaryString += widthsToBinary(CODE128_PATTERNS[checksumIndex]);
    
    // 4. Stop Character (Index 106)
    binaryString += widthsToBinary(CODE128_PATTERNS[106]);

    // Canvas Settings
    const ctx = canvas.getContext("2d");
    const totalWidth = binaryString.length * barWidth;
    
    canvas.width = totalWidth + 40;
    canvas.height = barHeight + 40;

    // Canvas Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bars
    ctx.fillStyle = "#000000";
    let x = 20;
    for (const bit of binaryString) {
        if (bit === '1') {
            ctx.fillRect(x, 10, barWidth, barHeight);
        }
        x += barWidth;
    }

    // Draw Text Label
    ctx.font = "14px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000"; 
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

// Event Listeners
input.addEventListener("input", genBarcode);
barWidthSelect.addEventListener("change", genBarcode);
barHeightInput.addEventListener("input", genBarcode);
downloadBtn.addEventListener("click", downloadBarcode);

// Initialize tool
initTheme();
genBarcode();