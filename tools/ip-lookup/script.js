document.getElementById('fetch-btn').addEventListener('click', async () => {
    const res = document.getElementById('results');
    res.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Loading...</p>';
    try {
        const r = await fetch('https://ipapi.co/json/'); const d = await r.json();
        res.innerHTML = [['IP', d.ip], ['City', d.city], ['Region', d.region], ['Country', d.country_name], ['ISP', d.org], ['Timezone', d.timezone], ['Latitude', d.latitude], ['Longitude', d.longitude]].map(([l, v]) => `<div class="info-row"><span class="info-label">${l}</span><span class="info-val">${v || 'N/A'}</span></div>`).join('');
    } catch (e) { res.innerHTML = '<p style="text-align:center;color:#ff4757">Failed to fetch IP info. Try again.</p>'; }
});
