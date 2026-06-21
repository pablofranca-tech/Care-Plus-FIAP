# 🔧 SOLUÇÃO: Tela Branca no GitHub Pages

## ❌ Problema
Ao abrir o site no GitHub Pages, você vê uma tela branca em vez do dashboard.

## 🔍 Causa
O arquivo `JavaScript/auth/auth-guard.js` está verificando se o usuário está autenticado via localStorage:

```javascript
if (localStorage.getItem('logado') !== 'true') {
    window.location.href = _resolveRoot('/pages/auth/login.html');
}
```

Como o localStorage está vazio na primeira vez, ele tenta redirecionar para a página de login, mas pode haver erro no caminho relativo.

## ✅ Solução Recomendada

### Opção 1: Corrigir auth-guard.js (RECOMENDADO)

Editar `JavaScript/auth/auth-guard.js`:

```javascript
function _resolveRoot(path) {
    // Detectar se está em produção (GitHub Pages)
    const isProduction = window.location.hostname.includes('github.io');
    
    if (isProduction) {
        // GitHub Pages: use o nome do repositório como base
        const repoName = window.location.pathname.split('/')[1];
        return `/${repoName}${path}`;
    } else {
        // Desenvolvimento local
        const segs = window.location.pathname.split('/').filter(Boolean);
        const ups = Math.max(0, segs.length - 1);
        return '../'.repeat(ups) + path.replace(/^\//, '');
    }
}

// Permitir acesso inicialmente, autenticação será feita na página de login
if (localStorage.getItem('logado') !== 'true') {
    // Redirecionar apenas se não estiver na página de login
    const currentPage = window.location.pathname;
    if (!currentPage.includes('login.html')) {
        window.location.href = _resolveRoot('/pages/auth/login.html');
    }
}
```

### Opção 2: Definir localStorage no index.html

Adicionar antes do script `auth-guard.js` em `index.html`:

```html
<script>
    // Verificar se é primeira vez ou sessão expirada
    if (!localStorage.getItem('logado')) {
        localStorage.setItem('logado', 'true');
        localStorage.setItem('nome', localStorage.getItem('nome') || 'Usuário');
    }
</script>

<script src="JavaScript/auth/auth-guard.js"></script>
```

### Opção 3: Desabilitar Auth Temporariamente

Comentar o conteúdo de `JavaScript/auth/auth-guard.js`:

```javascript
// function _resolveRoot(path) {
//     const segs = window.location.pathname.split('/').filter(Boolean);
//     const ups = Math.max(0, segs.length - 1);
//     return '../'.repeat(ups) + path.replace(/^\//, '');
// }

// if (localStorage.getItem('logado') !== 'true') {
//     window.location.href = _resolveRoot('/pages/auth/login.html');
// }
```

## 🎯 Passo a Passo - Opção 1 (Recomendada)

1. Abra `JavaScript/auth/auth-guard.js`
2. Substitua todo o conteúdo pelo código acima
3. Faça commit: `git add . && git commit -m "Fix: Melhorar resolução de caminhos em produção"`
4. Faça push: `git push`
5. Aguarde 1-2 minutos para GitHub Pages atualizar
6. Recarregue a página

## 🧪 Teste

Após fazer as alterações:

1. **Localmente**: `python -m http.server` (ou `npx http-server`)
2. **GitHub Pages**: Aguarde build e acesse seu repositório

Se ainda ver tela branca:
- Abra DevTools (F12)
- Vá para Console
- Procure por erros em vermelho
- Verifique paths dos arquivos CSS/JS

## 📋 Checklist Final

- [ ] Página de login carrega (sem tela branca)
- [ ] Ao clicar em "Paciente" ou "Médico", vai para dashboard
- [ ] Dashboard mostra conteúdo (não é branco)
- [ ] Sidebar funciona em mobile
- [ ] Sem erros no console (F12)

---

**Dúvidas?** Verifique:
1. Nome do repositório no GitHub
2. Branch está em "main" ou "master"?
3. GitHub Pages está habilitado?
4. Verificar erro com `git log` e `git status`
