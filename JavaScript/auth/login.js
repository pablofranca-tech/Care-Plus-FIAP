document.querySelectorAll('.profile-card').forEach(card => {
    // ripple & hover effects
    card.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const r    = document.createElement('span');
        r.className = 'ripple-circle';
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
        this.appendChild(r);
        setTimeout(() => r.remove(), 600);
    });

    if (window.matchMedia('(hover:hover)').matches) {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width/2)  / rect.width  * 10;
            const dy = (e.clientY - rect.top  - rect.height/2) / rect.height * 10;
            card.style.transform = `translateY(-8px) scale(1.03) translate(${dx}px,${dy}px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    }

    // prompt for name before navigating and save to localStorage
    card.addEventListener('auxclick', (e)=>{}); // noop to keep clickable on some browsers
    card.addEventListener('click', function(e) {
        // if anchor default navigation already happened, skip handling — use setTimeout to run before navigation
    }, { once: false });

    // intercept navigation on link-like cards
    card.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        let name = localStorage.getItem('nome') || '';
        if (!name) {
            // open themed modal to collect name
            const modal = document.getElementById('nameModal');
            const input = document.getElementById('loginNameInput');
            const confirmBtn = document.getElementById('nameConfirm');
            const cancelBtn = document.getElementById('nameCancel');

            // helper to close modal and cleanup
            const closeModal = () => {
                if (modal) modal.classList.remove('open');
                if (confirmBtn) confirmBtn.removeEventListener('click', onConfirm);
                if (cancelBtn) cancelBtn.removeEventListener('click', onCancel);
            };

            const onConfirm = () => {
                let val = (input && input.value) ? input.value.trim() : '';
                if (!val) val = 'Usuário';
                localStorage.setItem('nome', val);
                localStorage.setItem('logado', 'true');
                closeModal();
                setTimeout(() => { window.location.href = href; }, 180);
            };

            const onCancel = () => {
                closeModal();
            };

            if (modal) modal.classList.add('open');
            if (input) { input.value = ''; input.focus(); }
            if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
            if (cancelBtn) cancelBtn.addEventListener('click', onCancel);

            // keyboard support
            if (input) {
                const kd = function(evt) {
                    if (evt.key === 'Enter') { onConfirm(); input.removeEventListener('keydown', kd); }
                    if (evt.key === 'Escape') { onCancel(); input.removeEventListener('keydown', kd); }
                };
                input.addEventListener('keydown', kd);
            }

            return;
        }
        localStorage.setItem('logado', 'true');
        setTimeout(() => { window.location.href = href; }, 180);
    });
});

// Inicializar handlers do nameModal quando aberto diretamente (ex: dashboard)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('nameModal');
    if (!modal) return;

    const input = document.getElementById('loginNameInput');
    const confirmBtn = document.getElementById('nameConfirm');
    const cancelBtn = document.getElementById('nameCancel');

    // Se estamos na página de login, abrir modal automaticamente
    if (window.isLoginPage) {
        modal.classList.add('open');
        if (input) input.focus();
    }

    const closeModal = () => {
        modal.classList.remove('open');
    };

    const onConfirm = () => {
        let val = (input && input.value) ? input.value.trim() : '';
        if (!val) val = 'Usuário';
        localStorage.setItem('nome', val);
        localStorage.setItem('logado', 'true');
        closeModal();

        // atualiza greeting na página sem recarregar
        const hour = new Date().getHours();
        function getGreeting(h) {
            if (h >= 5 && h <= 12) return 'Bom dia';
            if (h >= 13 && h <= 17) return 'Boa tarde';
            return 'Boa noite';
        }
        const helloEl = document.querySelector('.greeting .hello');
        if (helloEl) helloEl.innerHTML = `${getGreeting(hour)}, <span class="name">${val}</span>`;
    };

    const onCancel = () => {
        closeModal();
    };

    if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
    if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') onConfirm();
            if (e.key === 'Escape') onCancel();
        });
    }
});