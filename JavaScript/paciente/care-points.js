const sidebar   = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
toggleBtn.addEventListener('click', () => {
    const exp = sidebar.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', exp);
    toggleBtn.querySelector('i').className = exp ? 'bi bi-x-lg' : 'bi bi-list';
});
document.addEventListener('click', e => {
    if (window.innerWidth<=768 && sidebar.classList.contains('expanded') && !sidebar.contains(e.target))
        { sidebar.classList.remove('expanded'); toggleBtn.querySelector('i').className='bi bi-list'; }
});

const termsCheck = document.getElementById('termsCheck');
const btnJoin    = document.getElementById('btnJoin');

termsCheck.addEventListener('change', () => {
    if (termsCheck.checked) {
        btnJoin.disabled = false;
        btnJoin.classList.add('active');
    } else {
        btnJoin.disabled = true;
        btnJoin.classList.remove('active');
    }
});

btnJoin.addEventListener('click', function() {
    if (!termsCheck.checked) return;

    localStorage.setItem('participandoPoints', 'true');

    const myModal = new bootstrap.Modal(document.getElementById('modalSucesso'));
    myModal.show();
});

if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.benefit-card, .banner-smart').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width/2)  / r.width  * 8;
            const dy = (e.clientY - r.top  - r.height/2) / r.height * 8;
            card.style.transform = `translateY(-5px) translate(${dx}px,${dy}px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform=''; });
    });
}

document.querySelectorAll('.partner-card').forEach((c,i) => {
    c.style.animationDelay = `${.35 + i*.06}s`;
    c.style.animation = 'fadeUp .5s cubic-bezier(.22,1,.36,1) both';
});