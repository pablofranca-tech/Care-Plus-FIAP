function abrirRadarHospitais(e) {
    if(e) e.preventDefault();
    
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    
    const modalRadar = document.getElementById('modal-radar');
    if (!modalRadar) return;

    const userLat = -23.693;
    const userLng = -46.565;
    
    const hospitais = [
        {
            nome: "Pronto Socorro CarePlus SBC",
            distancia: "1.2 km",
            tempoChegada: "5 min",
            espera: "15 min",
            status: "green",
            lat: -23.685, lng: -46.550
        },
        {
            nome: "Hospital e Maternidade Central",
            distancia: "3.8 km",
            tempoChegada: "12 min",
            espera: "45 min",
            status: "yellow",
            lat: -23.700, lng: -46.540
        },
        {
            nome: "CarePlus Emergência Sul",
            distancia: "5.1 km",
            tempoChegada: "18 min",
            espera: "2h+",
            status: "red",
            lat: -23.680, lng: -46.580
        }
    ];

    const listaHtml = hospitais.map(h => {
        let statusLabel = h.status === 'green' ? 'Fluxo Normal' : h.status === 'yellow' ? 'Atenção' : 'Lotado';
        
        return `
        <div class="hospital-card">
            <div class="h-header">
                <div class="h-title">${h.nome}</div>
                <div class="h-status status-${h.status}">
                    <div class="dot"></div>
                    ${statusLabel}
                </div>
            </div>
            
            <div class="h-details">
                <span><i class="bi bi-car-front-fill"></i> ${h.distancia} (${h.tempoChegada})</span>
                <span><i class="bi bi-clock-history"></i> Espera: ${h.espera}</span>
            </div>
            
            <div class="h-nav-pill">
                <a href="https://waze.com/ul?ll=${h.lat},${h.lng}&navigate=yes" target="_blank" class="h-pill-btn h-waze">
                    <span style="font-weight: 900; font-size: 16px;">w</span> Waze
                </a>
                <a href="https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${h.lat}&dropoff[longitude]=${h.lng}" target="_blank" class="h-pill-btn h-uber">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#fff"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="22" font-weight="bold" fill="#000">U</text></svg>
                    Uber
                </a>
            </div>
        </div>
        `;
    }).join('');

    document.getElementById('hospitais-list').innerHTML = listaHtml;
    modalRadar.classList.add('show');

    setTimeout(() => {
        if (!window.radarMapInstance && typeof L !== 'undefined') {
            window.radarMapInstance = L.map('radar-map', { zoomControl: false, attributionControl: false }).setView([userLat, userLng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.radarMapInstance);
            
            L.circleMarker([userLat, userLng], { radius: 8, color: '#fff', fillColor: '#4ADE80', fillOpacity: 1, weight: 2 }).addTo(window.radarMapInstance);
            
            hospitais.forEach(h => {
                L.circleMarker([h.lat, h.lng], { radius: 7, color: '#fff', fillColor: '#EF4444', fillOpacity: 1, weight: 2 }).addTo(window.radarMapInstance);
            });
        }
        if(window.radarMapInstance) window.radarMapInstance.invalidateSize();
    }, 300);
}

function fecharRadar() {
    const modalRadar = document.getElementById('modal-radar');
    if (modalRadar) modalRadar.classList.remove('show');
}

window.abrirRadarHospitais = abrirRadarHospitais;
window.fecharRadar = fecharRadar;