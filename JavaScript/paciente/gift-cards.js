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

let userPts = parseInt(localStorage.getItem('carePoints') || '40');
document.getElementById('userPtsDisplay').textContent = userPts;

function savePoints() { localStorage.setItem('carePoints', userPts); }

const PARTNERS = [
    { id:'levis',      section:'flash',     cat:'moda',      name:"Levi's",      emoji:'👖', bg:'#CC0000', textColor:'#fff',
        tagline:"Jeans icônicos com desconto exclusivo",
        ribbon:'40% OFF', cost:20,
        benefits:["40% OFF em toda a linha de jeans","Frete grátis acima de R$200","Válido em lojas parceiras"],
        badgeType:'badge-sale', badgeText:'40% OFF' },

    { id:'oakley',     section:'flash',     cat:'esporte',   name:'Oakley',      emoji:'🕶️', bg:'#1a1a1a', textColor:'#fff',
        tagline:"Óculos e acessórios esportivos premium",
        ribbon:'25% OFF', cost:25,
        benefits:["25% OFF em armações e lentes","Troca grátis em 30 dias","Garantia de 1 ano"],
        badgeType:'badge-sale', badgeText:'25% OFF' },

    { id:'adidas',     section:'flash',     cat:'esporte',   name:'Adidas',      emoji:'👟', bg:'#000',    textColor:'#fff',
        tagline:"Sneakers e roupas esportivas com desconto",
        ribbon:'30% OFF', cost:30, badgeNew:true,
        benefits:["30% OFF na linha Originals","Envio expresso grátis","Personalização gratuita"],
        badgeType:'badge-sale', badgeText:'30% OFF' },

    { id:'lacoste',    section:'alta',      cat:'moda',      name:'Lacoste',      emoji:'🐊', bg:'#00A650', textColor:'#fff',
        tagline:"Polo shirts e acessórios exclusivos",
        cost:35,
        benefits:["15% de desconto em peças selecionadas","Acesso a coleções exclusivas","Brinde especial nas compras acima de R$400"],
        badgeType:'badge-pts', badgeText:'35 pts' },

    { id:'tommy',      section:'alta',      cat:'moda',      name:'Tommy Hilfiger',emoji:'🧢', bg:'#C8102E', textColor:'#fff',
        tagline:"Moda americana clássica e sofisticada",
        cost:40,
        benefits:["20% OFF na linha casual","Acesso antecipado a lançamentos","Embrulho de presente grátis"],
        badgeType:'badge-pts', badgeText:'40 pts' },

    { id:'reserva',    section:'alta',      cat:'moda',      name:'Reserva',      emoji:'👔', bg:'#1D3557', textColor:'#fff',
        tagline:"Moda masculina moderna e sustentável",
        cost:25, badgeNew:true,
        benefits:["15% OFF em coleção completa","Frete grátis acima de R$150","Programa de fidelidade exclusivo"],
        badgeType:'badge-pts', badgeText:'25 pts' },

    { id:'starbucks',  section:'local',     cat:'food',      name:'Starbucks',    emoji:'☕', bg:'#00704A', textColor:'#fff',
        tagline:"Cafés e bebidas especiais com você",
        cost:20,
        benefits:["R$20 em crédito Starbucks","Válido em qualquer bebida","Acúmulo de Stars no app"],
        badgeType:'badge-local', badgeText:'Próximo' },

    { id:'kopenhagen', section:'local',     cat:'food',      name:'Kopenhagen',   emoji:'🍫', bg:'#7B3F00', textColor:'#fff',
        tagline:"Chocolates e doces artesanais premium",
        cost:25,
        benefits:["R$25 em produtos Kopenhagen","Trufas e bombons exclusivos","Embalagem especial inclusa"],
        badgeType:'badge-local', badgeText:'Próximo' },

    { id:'ifood',      section:'local',     cat:'food',      name:'iFood',        emoji:'🛵', bg:'#EA1D2C', textColor:'#fff',
        tagline:"Delivery rápido com crédito exclusivo",
        cost:30,
        benefits:["R$30 em créditos iFood","Sem pedido mínimo","Válido por 90 dias"],
        badgeType:'badge-local', badgeText:'Próximo' },

    { id:'smartfit',   section:'alta',      cat:'bem-estar', name:'Smart Fit',    emoji:'💪', bg:'#FFE000', textColor:'#000',
        tagline:"Academia com mensalidade gratuita",
        cost:50,
        benefits:["1 mês grátis na Smart Fit","Acesso a todas as unidades","Aula de avaliação física inclusa"],
        badgeType:'badge-pts', badgeText:'50 pts' },

    { id:'rappi',      section:'local',     cat:'food',      name:'Rappi',        emoji:'🦊', bg:'#FF441F', textColor:'#fff',
        tagline:"Tudo que você precisa, entregue rápido",
        cost:20,
        benefits:["R$20 em créditos Rappi","Entrega em até 30 min","Válido em restaurantes e farmácias"],
        badgeType:'badge-local', badgeText:'Próximo' },

    { id:'americanas', section:'flash',     cat:'tech',      name:'Americanas',   emoji:'🛒', bg:'#C8102E', textColor:'#fff',
        tagline:"Eletrônicos e muito mais com desconto",
        ribbon:'10% OFF', cost:15,
        benefits:["10% OFF em eletrônicos","Frete grátis em compras acima de R$100","Parcelamento sem juros"],
        badgeType:'badge-sale', badgeText:'10% OFF' },
];

const SECTIONS = [
    { id:'flash', title:'Promoção relâmpago', icon:'⚡' },
    { id:'alta',  title:'Ofertas em alta',    icon:'🔥' },
    { id:'local', title:'Perto de você',      icon:'📍' },
];

let activeFilter  = 'all';
let activePartner = null;

function renderSections(query='', filter='all') {
    const wrap  = document.getElementById('sectionsWrap');
    const empty = document.getElementById('emptyState');
    wrap.innerHTML = '';

    const q = query.toLowerCase().trim();
    let totalShown = 0;

    SECTIONS.forEach((sec, si) => {
        let items = PARTNERS.filter(p => p.section === sec.id);
        if (filter !== 'all') items = items.filter(p => p.cat === filter);
        if (q) items = items.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.cat.toLowerCase().includes(q)
            );
            if (!items.length) return;
            totalShown += items.length;
        
            const section = document.createElement('div');
            section.className = 'section';
            section.style.animation = `fadeUp .5s ${.3+si*.1}s cubic-bezier(.22,1,.36,1) both`;
            section.innerHTML = `
                <div class="section-head">
                    <div class="section-title">${sec.icon} ${sec.title}</div>
                    <a class="ver-mais" href="#">Ver mais <i class="bi bi-arrow-right"></i></a>
                </div>
                <div class="cards-row" id="row-${sec.id}"></div>`;
                wrap.appendChild(section);

            const row = section.querySelector(`#row-${sec.id}`);
            items.forEach((p, pi) => {
            const card = document.createElement('div');
            card.className = 'partner-card';
            card.style.animation = `fadeUp .45s ${.35+pi*.07}s cubic-bezier(.22,1,.36,1) both`;
            card.innerHTML = `
                ${p.ribbon ? `<div class="ribbon">${p.ribbon}</div>` : ''}
                ${p.badgeNew ? `<div class="badge-new">NOVO</div>` : ''}
                <div class="card-logo" style="background:${p.bg};">
                    <div class="logo-text" style="color:${p.textColor};">${p.emoji} ${p.name}</div>
                </div>
                <div class="card-footer">
                    <span class="card-badge ${p.badgeType}">
                        <i class="bi bi-${p.badgeType==='badge-sale'?'tag-fill':p.badgeType==='badge-local'?'geo-alt-fill':'star-fill'}"></i>
                        ${p.badgeText}
                    </span>
                    <span class="card-cost">${p.cost} pts</span>
                </div>`;
            card.addEventListener('click', e => { addRipple(e, card); openGiftModal(p); });
            row.appendChild(card);
        });
    });

    empty.style.display = totalShown === 0 ? 'flex' : 'none';
}

function addRipple(e, el) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const r = document.createElement('span');
    r.className = 'ripple-circle';
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    el.appendChild(r); setTimeout(()=>r.remove(),550);
}

function setFilter(cat, btn) {
    activeFilter = cat;
    document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    renderSections(document.getElementById('searchInput').value, cat);
}

document.getElementById('searchInput').addEventListener('input', function() {
    const clearBtn = document.getElementById('clearSearch');
    clearBtn.style.opacity = this.value ? '1' : '0';
    renderSections(this.value, activeFilter);
});
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.opacity = '0';
    renderSections('', activeFilter);
}

function openGiftModal(p) {
    activePartner = p;
    const canBuy  = userPts >= p.cost;

    document.getElementById('modalBrandHeader').style.background = p.bg;
    document.getElementById('modalBrandHeader').innerHTML =
        `<span style="font-size:44px;font-weight:900;color:${p.textColor};text-align:center;">${p.emoji} ${p.name}</span>`;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalSub').textContent   = p.tagline;
    document.getElementById('modalCost').textContent  = `${p.cost} pts`;
    document.getElementById('modalPtsBalance').textContent = `Você tem: ${userPts} pts`;

    const benefits = document.getElementById('modalBenefits');
    benefits.innerHTML = p.benefits.map(b =>
        `<div class="benefit-row">
            <i class="bi bi-check-circle-fill" style="color:#4ADE80;"></i>
            <span>${b}</span>
        </div>`
    ).join('');

    const btn = document.getElementById('modalRedeemBtn');
    if (canBuy) {
        btn.className = 'btn-redeem can';
        btn.innerHTML = '<i class="bi bi-gift-fill"></i> Resgatar gift card';
    } else {
        btn.className = 'btn-redeem cannot';
        btn.innerHTML = `<i class="bi bi-lock-fill"></i> Faltam ${p.cost - userPts} pts para resgatar`;
    }

    document.getElementById('giftModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeGiftModal() {
    document.getElementById('giftModal').classList.remove('open');
    document.body.style.overflow = '';
    activePartner = null;
}

document.getElementById('giftModal').addEventListener('click', e => {
    if (e.target === document.getElementById('giftModal')) closeGiftModal();
});
document.addEventListener('keydown', e => { if(e.key==='Escape') closeGiftModal(); });

function doRedeem() {
    if (!activePartner || userPts < activePartner.cost) return;
    userPts -= activePartner.cost;
    savePoints();
    document.getElementById('userPtsDisplay').textContent = userPts;
    closeGiftModal();
    showToast(`🎁 ${activePartner.name} resgatado! −${activePartner.cost} pts`);
    renderSections(document.getElementById('searchInput').value, activeFilter);
}

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(40px);background:linear-gradient(135deg,rgba(0,121,200,.95),rgba(0,59,98,.95));color:#fff;font-family:Montserrat,sans-serif;font-size:14px;font-weight:700;padding:13px 26px;border-radius:50px;box-shadow:0 8px 28px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.2);z-index:9999;transition:all .4s cubic-bezier(.22,1,.36,1);opacity:0;white-space:nowrap;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; },50);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(30px)'; setTimeout(()=>t.remove(),400); },2800);
}

renderSections();