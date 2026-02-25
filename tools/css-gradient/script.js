const type = document.getElementById('type'), angle = document.getElementById('angle'), c1 = document.getElementById('c1'), c2 = document.getElementById('c2');
const preview = document.getElementById('preview'), output = document.getElementById('css-output'), av = document.getElementById('angle-val');

function update() {
    av.textContent = angle.value;
    let css;
    if (type.value === 'linear') {
        css = `background: linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value});`;
        preview.style.background = `linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value})`;
    } else {
        css = `background: radial-gradient(circle, ${c1.value}, ${c2.value});`;
        preview.style.background = `radial-gradient(circle, ${c1.value}, ${c2.value})`;
    }
    output.textContent = css;
}

[type, angle, c1, c2].forEach(el => el.addEventListener('input', update));
document.getElementById('copy-btn').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
update();
