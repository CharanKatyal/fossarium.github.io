const colSettings = document.getElementById('col-settings');
const rowSettings = document.getElementById('row-settings');
const addColBtn = document.getElementById('add-col-btn');
const addRowBtn = document.getElementById('add-row-btn');
const colGapInput = document.getElementById('col-gap');
const rowGapInput = document.getElementById('row-gap');
const container = document.getElementById('container');
const codeEl = document.getElementById('code');
const copyBtn = document.getElementById('copy-btn');

let columns = ['1fr', '1fr', '1fr'];
let rows = ['1fr', '1fr'];

function createTrackItem(type, index, value) {
    const div = document.createElement('div');
    div.className = 'track-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.placeholder = 'e.g. 1fr, 200px, 20%';
    input.addEventListener('input', (e) => {
        if (type === 'col') columns[index] = e.target.value;
        else rows[index] = e.target.value;
        updateGrid();
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn small-btn delete-btn';
    delBtn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
    delBtn.title = `Delete ${type === 'col' ? 'Column' : 'Row'}`;
    delBtn.addEventListener('click', () => {
        if (type === 'col') {
            if (columns.length > 1) {
                columns.splice(index, 1);
                renderSettings('col');
            }
        } else {
            if (rows.length > 1) {
                rows.splice(index, 1);
                renderSettings('row');
            }
        }
        updateGrid();
    });

    div.appendChild(input);
    div.appendChild(delBtn);
    return div;
}

function renderSettings(type) {
    const target = type === 'col' ? colSettings : rowSettings;
    const data = type === 'col' ? columns : rows;
    target.innerHTML = '';
    data.forEach((val, i) => {
        target.appendChild(createTrackItem(type, i, val));
    });
}

function updateGrid() {
    const colTracks = columns.join(' ');
    const rowTracks = rows.join(' ');
    const colGap = colGapInput.value || 0;
    const rowGap = rowGapInput.value || 0;

    container.style.display = 'grid';
    container.style.gridTemplateColumns = colTracks;
    container.style.gridTemplateRows = rowTracks;
    container.style.columnGap = colGap + 'px';
    container.style.rowGap = rowGap + 'px';

    // Clear and refill cells
    container.innerHTML = '';
    const totalCells = columns.length * rows.length;
    for (let i = 1; i <= totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.textContent = i;
        container.appendChild(cell);
    }

    // Update code output
    codeEl.textContent = `.grid-container {
  display: grid;
  grid-template-columns: ${colTracks};
  grid-template-rows: ${rowTracks};
  column-gap: ${colGap}px;
  row-gap: ${rowGap}px;
}`;
}

addColBtn.addEventListener('click', () => {
    columns.push('1fr');
    renderSettings('col');
    updateGrid();
});

addRowBtn.addEventListener('click', () => {
    rows.push('1fr');
    renderSettings('row');
    updateGrid();
});

[colGapInput, rowGapInput].forEach(el => {
    el.addEventListener('input', updateGrid);
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeEl.textContent);
    const icon = copyBtn.querySelector('ion-icon');
    const originalName = icon.getAttribute('name');
    icon.setAttribute('name', 'checkmark-outline');
    copyBtn.style.color = '#3fb950';
    setTimeout(() => {
        icon.setAttribute('name', originalName);
        copyBtn.style.color = '';
    }, 1500);
});

// Theme Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

initTheme();
renderSettings('col');
renderSettings('row');
updateGrid();
