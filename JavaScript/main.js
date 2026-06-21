const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

// Sidebar toggle functionality
if(toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = sidebar.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', expanded);
        toggleBtn.querySelector('i').className = expanded ? 'bi bi-x-lg' : 'bi bi-list';
        
        // Adicionar classe ao body para overlay no mobile
        if (window.innerWidth <= 768) {
            document.body.classList.toggle('sidebar-open', expanded);
        }
    });
}

// Close sidebar on nav item click (mobile)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
            if(toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', false);
                toggleBtn.querySelector('i').className = 'bi bi-list';
            }
        }
    });
});

// Close sidebar on outside click
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('expanded')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
            if(toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', false);
                toggleBtn.querySelector('i').className = 'bi bi-list';
            }
        }
    }
}); 

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
            if(toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', false);
            }
        }
    }, 250);
});

// Ripple effect on cards
document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Skip ripple for touch on mobile
        if (e.pointerType === 'touch') return;
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top  - size / 2;
    
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Hover effects (only on desktop)
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) / rect.width  * 12;
            const dy   = (e.clientY - cy) / rect.height * 12;
            btn.style.transform = `translateY(-6px) scale(1.02) translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// Greeting function
(function() {
    const hour = new Date().getHours();
    function getGreeting(h) {
        if (h >= 5 && h <= 12) return 'Bom dia';
        if (h >= 13 && h <= 17) return 'Boa tarde';
        return 'Boa noite';
    }
    const greeting = getGreeting(hour);
    const el = document.querySelector('.greeting .hello');
    const storedName = localStorage.getItem('nome');
    if (el) el.innerHTML = `${greeting}, <span class="name">${storedName ? storedName : 'Usuário'}</span>`;
})();

// Prevent body scroll when sidebar is open on mobile
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        if (sidebar && sidebar.classList.contains('expanded') && window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
});