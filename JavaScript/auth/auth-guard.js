function _resolveRoot(path) {
    // Detectar se está em produção (GitHub Pages)
    const isProduction = window.location.hostname.includes('github.io');
    const repoName = window.location.pathname.split('/')[1];
    
    if (isProduction) {
        // GitHub Pages: usar repositório como base
        return `/${repoName}${path}`;
    } else {
        // Desenvolvimento local
        const segs = window.location.pathname.split('/').filter(Boolean);
        const ups = Math.max(0, segs.length - 1);
        return '../'.repeat(ups) + path.replace(/^\//, '');
    }
}

// Checar autenticação após carregamento do DOM
function initAuthGuard() {
    try {
        // Se já está autenticado, permitir
        if (localStorage.getItem('logado') === 'true') {
            console.log('[Auth Guard] Usuário já autenticado');
            return;
        }

        // Se estamos na página de login, permitir
        if (window.isLoginPage) {
            console.log('[Auth Guard] Página de login detectada');
            return;
        }

        // Se a página atual tem um nameModal (dashboard), abra o modal
        const nameModal = document.getElementById('nameModal');
        if (nameModal) {
            console.log('[Auth Guard] Abrindo modal de autenticação');
            nameModal.classList.add('open');
            const input = document.getElementById('loginNameInput');
            if (input) {
                input.focus();
                input.value = '';
            }
            return;
        }

        // Se não encontrou o modal e não é a página de login, redirecionar
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login.html')) {
            console.log('[Auth Guard] Redirecionando para login...');
            window.location.href = _resolveRoot('/pages/auth/login.html');
        }
    } catch (err) {
        console.error('[Auth Guard] Erro:', err);
    }
}

// Aguardar o DOM estar totalmente pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGuard);
} else {
    // DOM já carregado
    initAuthGuard();
}