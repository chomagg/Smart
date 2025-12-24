// ========================================
// MAPA INTERACTIVO - UNICA SMART PARKING
// DATOS REALES DE SANTA CRUZ DE LA SIERRA
// ========================================

// Estacionamientos reales de Santa Cruz de la Sierra
const estacionamientos = [
    // PRIMER ANILLO
    {
        id: "SCZ-PA-001",
        nombre: "Parkeo Plaza",
        ubicacion: "Centro - Calle Bolívar",
        direccion: "Bolívar 27-100",
        lat: -17.7827364,
        lng: -63.1809411,
        espacios: 35,
        capacidad_total: 75,
        precio_hora: 8,
        horario: "07:00-21:00",
        contacto: "3-3446789"
    },
    {
        id: "SCZ-PA-002",
        nombre: "Parqueatescz",
        ubicacion: "Centro - Ñuflo de Chávez",
        direccion: "Calle Ñuflo de Chávez #349",
        lat: -17.7845000,
        lng: -63.1820000,
        espacios: 28,
        capacidad_total: 60,
        precio_hora: 8,
        horario: "06:00-22:00",
        contacto: "70939279"
    },
    {
        id: "SCZ-PA-003",
        nombre: "Estacionamiento Pinocho 24/7",
        ubicacion: "Centro - Zona cercana a catedral",
        direccion: "Centro, cerca de catedral",
        lat: -17.7822652,
        lng: -63.1851418,
        espacios: 40,
        capacidad_total: 85,
        precio_hora: 10,
        horario: "24 horas",
        contacto: "77063347"
    },
    {
        id: "SCZ-PA-004",
        nombre: "PARQUEO CAÑOTO",
        ubicacion: "Centro - Avenida Cañoto",
        direccion: "Av. Cañoto 558",
        lat: -17.7859783,
        lng: -63.1889258,
        espacios: 18,
        capacidad_total: 50,
        precio_hora: 10,
        horario: "06:00-22:00",
        contacto: "3-4455667"
    },
    {
        id: "SCZ-PA-005",
        nombre: "Parkings Estacionamiento",
        ubicacion: "Centro - Calle Seoane",
        direccion: "Seoane 28",
        lat: -17.7796210,
        lng: -63.1822660,
        espacios: 25,
        capacidad_total: 65,
        precio_hora: 9,
        horario: "24 horas",
        contacto: "3-3789456"
    },
    
    // SEGUNDO ANILLO
    {
        id: "SCZ-PA-006",
        nombre: "Estacionamiento Publico (Sur)",
        ubicacion: "Barrio Urbano",
        direccion: "Av. Mario R. Gutiérrez",
        lat: -17.8054757,
        lng: -63.2002616,
        espacios: 50,
        capacidad_total: 120,
        precio_hora: 7,
        horario: "06:00-20:00",
        contacto: "3-4789012"
    },
    {
        id: "SCZ-PA-007",
        nombre: "Parqueo Velasco",
        ubicacion: "Zona El Parí",
        direccion: "Velasco 49",
        lat: -17.7880000,
        lng: -63.1890000,
        espacios: 15,
        capacidad_total: 45,
        precio_hora: 6,
        horario: "07:00-19:30",
        contacto: "3-3567890"
    },
    {
        id: "SCZ-PA-008",
        nombre: "Parqueo RR",
        ubicacion: "Zona Central-Sur",
        direccion: "Manuel Ignacio Salvatierra 591",
        lat: -17.7876700,
        lng: -63.1771217,
        espacios: 32,
        capacidad_total: 70,
        precio_hora: 8,
        horario: "24 horas",
        contacto: "6219667"
    },
    {
        id: "SCZ-PA-009",
        nombre: "Parqueo Oruro",
        ubicacion: "Zona Los Peñocos",
        direccion: "Los Peñocos",
        lat: -17.8015000,
        lng: -63.1950000,
        espacios: 22,
        capacidad_total: 55,
        precio_hora: 6,
        horario: "06:00-21:00",
        contacto: "3-3921456"
    },
    
    // TERCER ANILLO Y MÁS ALLÁ
    {
        id: "SCZ-PA-010",
        nombre: "Soccer Land",
        ubicacion: "Zona Norte - 7mo Anillo",
        direccion: "Calle 5 Oeste - Zona Norte",
        lat: -17.7180100,
        lng: -63.1707000,
        espacios: 60,
        capacidad_total: 150,
        precio_hora: 5,
        horario: "08:00-22:00",
        contacto: "79898876"
    },
    {
        id: "SCZ-PA-011",
        nombre: "Parqueo Público Viedma",
        ubicacion: "Zona Centro-Este",
        direccion: "Teniente H. Balcázar 19",
        lat: -17.7892207,
        lng: -63.1708389,
        espacios: 35,
        capacidad_total: 80,
        precio_hora: 6,
        horario: "24 horas",
        contacto: "69166550"
    },
    {
        id: "SCZ-PA-012",
        nombre: "Terminal de Buses",
        ubicacion: "Estación Bimodal",
        direccion: "Av. Intermodal",
        lat: -17.7895591,
        lng: -63.1618173,
        espacios: 80,
        capacidad_total: 200,
        precio_hora: 5,
        horario: "05:00-23:00",
        contacto: "3-4567890"
    }
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
        const porcentaje = Math.round((parking.espacios / parking.capacidad_total) * 100);
        
        // Icono personalizado verde
        const iconoVerde = L.divIcon({
            className: 'custom-marker-green',
            html: `
                <div style="
                    background-color: #16A34A;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 3px solid rgba(22, 163, 74, 0.3);
                    box-shadow: 0 0 0 8px rgba(22, 163, 74, 0.15);
                "></div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        
        const marker = L.marker([parking.lat, parking.lng], { icon: iconoVerde }).addTo(mapa);
        
        marker.bindPopup(`
            <div style="text-align: left; padding: 8px; font-family: 'Inter', sans-serif; min-width: 220px;">
                <b style="color: #16A34A; font-size: 15px; font-weight: 600;">${parking.nombre}</b><br>
                <div style="color: #6B7280; font-size: 13px; margin-top: 8px; line-height: 1.6;">
                    <p style="margin: 4px 0;"><strong>📍</strong> ${parking.direccion}</p>
                    <p style="margin: 4px 0;"><strong>⏰</strong> ${parking.horario}</p>
                    <p style="margin: 4px 0;"><strong>💰</strong> Bs. ${parking.precio_hora}/hora</p>
                    <p style="margin: 4px 0;"><strong>📞</strong> ${parking.contacto}</p>
                    <div style="margin-top: 8px; padding: 8px; background: ${porcentaje >= 50 ? '#D1FAE5' : porcentaje >= 20 ? '#FED7AA' : '#FEE2E2'}; border-radius: 6px;">
                        <strong style="color: #111827; font-size: 13px;">🚗 ${parking.espacios} espacios disponibles</strong><br>
                        <span style="font-size: 11px; color: #6B7280;">${parking.capacidad_total} espacios totales (${porcentaje}%)</span>
                    </div>
                </div>
                <a href="#descarga-app" style="display: inline-block; margin-top: 8px; color: #16A34A; font-weight: 600; text-decoration: none; font-size: 13px;">
                    📱 Reservar ahora →
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
                        html: '<div style="background: #16A34A; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                        iconSize: [22, 22],
                        iconAnchor: [11, 11]
                    })
                }).addTo(mapa);
                marcadorUsuario.bindPopup('<div style="text-align: center; padding: 4px;"><b style="color: #16A34A;">📍 Tu ubicación actual</b></div>').openPopup();

                // Agregar círculo de radio
                if (circuloRadio) {
                    mapa.removeLayer(circuloRadio);
                }
                circuloRadio = L.circle([latUsuario, lngUsuario], {
                    color: '#16A34A',
                    fillColor: '#16A34A',
                    fillOpacity: 0.1,
                    radius: 1500 // 1.5 km de radio
                }).addTo(mapa);

                // Actualizar información de ubicación
                obtenerNombreCiudad(latUsuario, lngUsuario);
                calcularParkingsCercanos(latUsuario, lngUsuario);
            },
            (error) => {
                console.error('Error al obtener ubicación:', error);
                const ciudadElement = document.getElementById('ciudad-actual');
                const parkingsElement = document.getElementById('parkings-cercanos');
                
                if (ciudadElement) {
                    ciudadElement.textContent = 'Santa Cruz de la Sierra, Bolivia';
                }
                if (parkingsElement) {
                    const totalEspacios = estacionamientos.reduce((sum, p) => sum + p.espacios, 0);
                    parkingsElement.textContent = `${estacionamientos.length} estacionamientos • ${totalEspacios} espacios disponibles`;
                }
            }
        );
    } else {
        const ciudadElement = document.getElementById('ciudad-actual');
        const parkingsElement = document.getElementById('parkings-cercanos');
        
        if (ciudadElement) {
            ciudadElement.textContent = 'Geolocalización no disponible';
        }
        if (parkingsElement) {
            const totalEspacios = estacionamientos.reduce((sum, p) => sum + p.espacios, 0);
            parkingsElement.textContent = `${estacionamientos.length} estacionamientos disponibles`;
        }
    }
}

// Obtener nombre de ciudad usando Nominatim (OpenStreetMap)
function obtenerNombreCiudad(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`)
        .then(response => response.json())
        .then(data => {
            const ciudad = data.address.city || data.address.town || data.address.state || 'Santa Cruz de la Sierra';
            const pais = data.address.country || 'Bolivia';
            const ciudadElement = document.getElementById('ciudad-actual');
            if (ciudadElement) {
                ciudadElement.textContent = `${ciudad}, ${pais}`;
            }
        })
        .catch(error => {
            console.error('Error al obtener nombre de ciudad:', error);
            const ciudadElement = document.getElementById('ciudad-actual');
            if (ciudadElement) {
                ciudadElement.textContent = 'Santa Cruz de la Sierra, Bolivia';
            }
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
    const parkingsElement = document.getElementById('parkings-cercanos');
    
    if (parkingsElement) {
        parkingsElement.textContent = `${total} estacionamientos cercanos • ${espacios} espacios disponibles`;
    }
}

// Actualizar sidebar con ubicaciones destacadas
function actualizarSidebar() {
    const sidebar = document.querySelector('.map-sidebar');
    if (!sidebar) return;
    
    // Mantener solo el título original
    const contenidoOriginal = sidebar.innerHTML;
    const tituloMatch = contenidoOriginal.match(/<h3[^>]*>.*?<\/h3>/);
    
    if (tituloMatch) {
        sidebar.innerHTML = tituloMatch[0];
    }
    
    // Ubicaciones destacadas
    const destacados = [
        estacionamientos.find(e => e.id === "SCZ-PA-012"), // Terminal
        estacionamientos.find(e => e.id === "SCZ-PA-003"), // Pinocho 24/7
        estacionamientos.find(e => e.id === "SCZ-PA-010"), // Soccer Land
        estacionamientos.find(e => e.id === "SCZ-PA-001")  // Parkeo Plaza
    ];
    
    destacados.forEach(est => {
        if (!est) return;
        
        const item = document.createElement('div');
        item.className = 'location-item';
        item.style.cursor = 'pointer';
        
        item.innerHTML = `
            <div class="location-info">
                <h4>${est.nombre}</h4>
                <p>${est.ubicacion}</p>
            </div>
            <span class="availability-badge">✓ Disponible</span>
        `;
        
        item.addEventListener('click', () => {
            mapa.setView([est.lat, est.lng], 16);
            
            mapa.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    const latlng = layer.getLatLng();
                    if (Math.abs(latlng.lat - est.lat) < 0.0001 && Math.abs(latlng.lng - est.lng) < 0.0001) {
                        layer.openPopup();
                    }
                }
            });
        });
        
        sidebar.appendChild(item);
    });
    
    // Mensaje de descarga
    const mensajeDiv = sidebar.querySelector('div[style*="margin-top: 24px"]');
    if (!mensajeDiv) {
        const nuevoMensaje = document.createElement('div');
        nuevoMensaje.style.cssText = 'margin-top: 24px; padding: 16px; background: #F3F4F6; border-radius: 8px;';
        nuevoMensaje.innerHTML = `
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 12px;">
                📱 Para ver disponibilidad en tiempo real, descarga la app
            </p>
            <a href="#descarga-app" class="btn-text">Descargar ahora →</a>
        `;
        sidebar.appendChild(nuevoMensaje);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa
    initMapa();
    
    // Actualizar sidebar
    setTimeout(actualizarSidebar, 1000);

    // Botón para centrar en ubicación del usuario
    const btnUbicacion = document.getElementById('btn-mi-ubicacion');
    if (btnUbicacion) {
        btnUbicacion.addEventListener('click', () => {
            obtenerUbicacion();
        });
    }
});