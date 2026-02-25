const input = document.getElementById('input'), output = document.getElementById('output');
function render() {
    let md = input.value;
    md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>');
    md = md.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    md = md.replace(/`([^`]+)`/g, '<code>$1</code>');
    md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    md = md.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    md = md.replace(/^- (.+)$/gm, '<li>$1</li>');
    md = md.replace(/(<li>.*<\/li>)/s, m => '<ul>' + m + '</ul>');
    md = md.replace(/^(?!<[hupbla])((?!<).+)$/gm, '<p>$1</p>');
    output.innerHTML = md;
}
input.addEventListener('input', render); render();
