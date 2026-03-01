let expenses = JSON.parse(localStorage.getItem("fossarium-expenses") || "[]");

function save() {
    localStorage.setItem("fossarium-expenses", JSON.stringify(expenses));
    render();
}

function addExpense() {
    const desc = document.getElementById("desc").value;
    const amt = parseFloat(document.getElementById("amount").value);
    const cat = document.getElementById("cat").value;

    if (!desc || isNaN(amt)) return;

    expenses.unshift({
        desc,
        amt,
        cat,
        date: new Date().toLocaleDateString()
    });

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    save();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    save();
}

function render() {
    const total = expenses.reduce((s, e) => s + e.amt, 0);
    const summaryEl = document.getElementById("summary");
    const listEl = document.getElementById("list");

    summaryEl.innerHTML = `
        <div class="sum-card">
            <div class="sum-label">Total Expenses</div>
            <div class="sum-val">$${total.toFixed(2)}</div>
        </div>
        <div class="sum-card">
            <div class="sum-label">Transactions</div>
            <div class="sum-val">${expenses.length}</div>
        </div>
    `;

    if (expenses.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">No transactions yet.</div>';
        return;
    }

    listEl.innerHTML = expenses.map((e, i) => `
        <div class="expense-item">
            <div class="expense-info">
                <span class="expense-desc">${e.desc}</span>
                <span class="expense-cat">${e.cat}</span>
            </div>
            <div class="expense-right">
                <span class="expense-amt">$${e.amt.toFixed(2)}</span>
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

initTheme();
render();
window.deleteExpense = deleteExpense;
window.addExpense = addExpense;
