let expenses = JSON.parse(localStorage.getItem("fossarium-expenses") || "[]");
let currentType = 'expense';
let currency = localStorage.getItem("fossarium-currency") || 'USD';
let symbol = '$';

const currencySelect = document.getElementById('currency-select');
currencySelect.value = currency;

function updateCurrency() {
    const selected = currencySelect.options[currencySelect.selectedIndex];
    currency = selected.value;
    symbol = selected.dataset.symbol;
    localStorage.setItem("fossarium-currency", currency);
    document.getElementById('currency-symbol').textContent = symbol;
    render(); // Re-render to update all amounts
}

updateCurrency(); // Set initial symbol and format

const typeBtns = document.querySelectorAll('.type-btn');
typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;
    });
});

function formatCurrency(val) {
    try {
        return new Intl.NumberFormat(undefined, { // Let browser decide locale for number formatting
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol'
        }).format(val);
    } catch(e) {
        // Fallback for unsupported currencies
        return `${symbol}${val.toFixed(2)}`;
    }
}

function save() {
    localStorage.setItem("fossarium-expenses", JSON.stringify(expenses));
    render();
}

function addExpense() {
    const desc = document.getElementById("desc").value.trim();
    const amtInput = document.getElementById("amount");
    const amt = parseFloat(amtInput.value);
    const cat = document.getElementById("cat").value;

    if (!desc || isNaN(amt) || amt <= 0) {
        amtInput.focus();
        return;
    }

    expenses.unshift({
        desc,
        amt: currentType === 'expense' ? -amt : amt,
        cat,
        type: currentType,
        date: new Date().toISOString()
    });

    document.getElementById("desc").value = "";
    amtInput.value = "";
    save();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    save();
}

document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm("This will delete all transactions. Are you sure?")) {
        expenses = [];
        save();
    }
});

function render() {
    const totalIncome = expenses.filter(e => e.amt > 0).reduce((s, e) => s + e.amt, 0);
    const totalExpense = Math.abs(expenses.filter(e => e.amt < 0).reduce((s, e) => s + e.amt, 0));
    const balance = totalIncome - totalExpense;

    document.getElementById("total-balance").textContent = formatCurrency(balance);
    document.getElementById("total-income").textContent = formatCurrency(totalIncome);
    document.getElementById("total-expense").textContent = formatCurrency(totalExpense);

    const listEl = document.getElementById("list");
    if (expenses.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight:600;">No transactions yet. Add one to get started!</div>';
        return;
    }

    listEl.innerHTML = expenses.map((e, i) => `
        <div class="expense-item ${e.type}">
            <div class="expense-info">
                <span class="expense-desc">${e.desc}</span>
                <div class="expense-meta">
                    <span class="expense-cat">${e.cat}</span>
                    <span class="expense-date">${new Date(e.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="expense-right">
                <span class="expense-amt">${e.amt > 0 ? '+' : ''}${formatCurrency(Math.abs(e.amt))}</span>
                <div class="del-btn" onclick="deleteExpense(${i})" title="Delete">
                    <ion-icon name="trash-outline"></ion-icon>
                </div>
            </div>
        </div>
    `).join("");
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
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

currencySelect.addEventListener('change', updateCurrency);
initTheme();
render();
window.deleteExpense = deleteExpense;
window.addExpense = addExpense;
