// ========================================
// MAPA INTERACTIVO - UNICA SMART PARKING
// ========================================

// Estacionamientos de ejemplo en Santa Cruz de la Sierra
const estacionamientos = [
    { nombre: "Aeropuerto Internacional Viru Viru", lat: -17.6448, lng: -63.1356, espacios: 45 },
    { nombre: "Estación Bimodal Terrestre y Ferroviaria", lat: -17.7539, lng: -63.1812, espacios: 120 },
    { nombre: "Ex Terminal de Buses", lat: -17.7853, lng: -63.1821, espacios: 80 },
    { nombre: "Centro Comercial Ventura Mall", lat: -17.7836, lng: -63.1821, espacios: 200 },
    { nombre: "Plaza 24 de Septiembre", lat: -17.7833, lng: -63.1821, espacios: 50 },
    { nombre: "INGRESO LA PRADERA", lat: -17.7644, lng: -63.1947, espacios: 60 },
    { nombre: "PARADA FINAL LINEA 8", lat: -17.7529, lng: -63.1425, espacios: 150 }
];

let mapa;
let marcadorUsuario;
let circuloRadio;
let latUsuario, lngUsuario;

// Inicializar mapa
function initMapa() {
    // Coordenadas por defecto: Santa Cruz de la Sierra
    const defaultLat = -17.7833;
    const defaultLng = -63.1821;

    mapa = L.map('mapa').setView([defaultLat, defaultLng], 13);

    // Usar mapa oscuro (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapa);

    // Agregar marcadores de estacionamientos
    estacionamientos.forEach(parking => {
        const marker = L.marker([parking.lat, parking.lng]).addTo(mapa);
        marker.bindPopup(`
            <div style="text-align: center; padding: 5px;">
                <b style="color: #00b67a; font-size: 1.1rem;">${parking.nombre}</b><br>
                <span style="font-size: 0.95rem;">🚗 ${parking.espacios} espacios disponibles</span><br>
                <a href="#descarga-app" style="color: #00b67a; font-weight: bold; text-decoration: none; font-size: 0.9rem;">
                    📱 Reservar ahora
                </a>
            </div>
        `);
    });

    // Intentar obtener ubicación del usuario
    obtenerUbicacion();
}

// Obtener ubicación del usuario
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latUsuario = position.coords.latitude;
                lngUsuario = position.coords.longitude;

                // Centrar mapa en ubicación del usuario
                mapa.setView([latUsuario, lngUsuario], 14);

                // Agregar marcador del usuario
                if (marcadorUsuario) {
                    mapa.removeLayer(marcadorUsuario);
                }
                marcadorUsuario = L.marker([latUsuario, lngUsuario], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #00b67a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                        iconSize: [20, 20]
                    })
                }).addTo(mapa);
                marcadorUsuario.bindPopup('<b>📍 Tu ubicación actual</b>').openPopup();

                // Agregar círculo de radio
                if (circuloRadio) {
                    mapa.removeLayer(circuloRadio);
                }
                circuloRadio = L.circle([latUsuario, lngUsuario], {
                    color: '#00b67a',
                    fillColor: '#00b67a',
                    fillOpacity: 0.1,
                    radius: 2000 // 2 km de radio
                }).addTo(mapa);

                // Actualizar información de ubicación
                obtenerNombreCiudad(latUsuario, lngUsuario);
                calcularParkingsCercanos(latUsuario, lngUsuario);
            },
            (error) => {
                console.error('Error al obtener ubicación:', error);
                document.getElementById('ciudad-actual').textContent = 'Santa Cruz de la Sierra, Bolivia (ubicación por defecto)';
                document.getElementById('parkings-cercanos').textContent = `${estacionamientos.length} estacionamientos disponibles`;
            }
        );
    } else {
        document.getElementById('ciudad-actual').textContent = 'Geolocalización no disponible en este navegador';
        document.getElementById('parkings-cercanos').textContent = `${estacionamientos.length} estacionamientos disponibles`;
    }
}

// Obtener nombre de ciudad usando Nominatim (OpenStreetMap)
function obtenerNombreCiudad(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`)
        .then(response => response.json())
        .then(data => {
            const ciudad = data.address.city || data.address.town || data.address.state || 'Santa Cruz de la Sierra';
            const pais = data.address.country || 'Bolivia';
            document.getElementById('ciudad-actual').textContent = `${ciudad}, ${pais}`;
        })
        .catch(error => {
            console.error('Error al obtener nombre de ciudad:', error);
            document.getElementById('ciudad-actual').textContent = 'Santa Cruz de la Sierra, Bolivia';
        });
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
             Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calcular parkings cercanos
function calcularParkingsCercanos(lat, lng) {
    const cercanos = estacionamientos.filter(parking => {
        const distancia = calcularDistancia(lat, lng, parking.lat, parking.lng);
        return distancia <= 5; // Dentro de 5 km
    });

    const total = cercanos.length;
    const espacios = cercanos.reduce((sum, p) => sum + p.espacios, 0);
    document.getElementById('parkings-cercanos').textContent = 
        `${total} estacionamientos cercanos • ${espacios} espacios disponibles`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa
    initMapa();

    // Botón para centrar en ubicación del usuario
    const btnUbicacion = document.getElementById('btn-mi-ubicacion');
    if (btnUbicacion) {
        btnUbicacion.addEventListener('click', () => {
            obtenerUbicacion();
        });
    }
});