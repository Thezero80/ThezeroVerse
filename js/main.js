// Carga de datos reales y simulados

const NASA_API_KEY = 'sHAas24syO7ek8VV1nGFAhpEtGPw7VVz7bqxvMYr'; // Usa tu propia API key si tienes una

async function fetchAstronomicalData() {
    try {
        // Evento astronómico reciente (APOD)
        const apodRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
        const apodData = await apodRes.json();

        // Simulación de eventos futuros 2024-2025 con imágenes reales y accesibles
        const futureEvents = [
            {
                name: "Lluvia de meteoros Perseidas",
                date: "2025-08-12",
                description: "La lluvia de meteoros más activa del año, visible en todo el hemisferio norte. Los meteoros son fragmentos de cometas que entran en la atmósfera terrestre a alta velocidad, creando destellos brillantes en el cielo nocturno. Las Perseidas son conocidas por sus meteoros rápidos y brillantes, y se pueden ver hasta 100 meteoros por hora en su pico. Para observarlas, busca un lugar oscuro lejos de las luces de la ciudad y mira hacia el noreste. La mejor hora para verlas es entre la medianoche y el amanecer.",
                image: "https://media.es.wired.com/photos/64bad84f532fc59e0e8d51fa/16:9/w_2560%2Cc_limit/perseidas%25202023.jpg"
            },
            {
                name: "Eclipse lunar parcial",
                date: "2025-09-07",
                description: "Eclipse visible en América y Europa durante la madrugada. Durante un eclipse solar, la sombra de la Luna sobre la superficie de la Tierra mide solo unos 480 kilómetros (300 millas) de ancho. La sombra se compone de dos partes: la umbra, donde el Sol está completamente oculto, y la penumbra, donde el Sol está parcialmente oscurecido. Aunque la sombra es estrecha y el eclipse total dura solo unos minutos, la rotación de nuestro planeta es lo suficientemente rápida como para que esta sombra llegue a un tercio de la superficie de la Tierra antes de que la Luna salga de su alineación con el Sol.",
                image: "https://d2r4pvg3gvir7a.cloudfront.net/wp-content/uploads/2024/09/eclipse-lunar-de-septiembre.jpg"
            },
            {
                name: apodData.title ? "Imagen astronómica del día" : "Evento astronómico reciente",
                date: apodData.date || "2025-08-01",
                description: apodData.explanation
                    ? "Descripción (en inglés): " + apodData.explanation
                    : "Consulta la imagen astronómica del día en la NASA.",
                image: apodData.url || "https://via.placeholder.com/400x250?text=Sin+Imagen"
            }
        ];

        // Simulación de constelaciones y satélites
        const constellations = [
            { name: 'Orión', description: 'Visible en agosto 2025, con meteoros brillantes.', mainStars: 'Betelgeuse, Rigel' },
            { name: 'Osa Mayor', description: 'Guía estelar en el hemisferio norte.', mainStars: 'Dubhe, Merak' },
            { name: 'Casiopea', description: 'Destaca en noches claras de verano.', mainStars: 'Schedar, Caph' }
        ];
        const satellites = [
            { name: 'Starlink-1500', orbit: 'LEO (550 km)', status: 'Activo, lanzado 2025' },
            { name: 'Hubble', orbit: 'LEO (540 km)', status: 'Operativo' },
            { name: 'ISS', orbit: 'LEO (400 km)', status: 'Visible 01 Ago 2025 18:34-18:40' }
        ];

        return { constellations, satellites, events: futureEvents };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            constellations: [{ name: 'Error', description: 'Datos no disponibles', mainStars: 'N/A' }],
            satellites: [{ name: 'Error', orbit: 'N/A', status: 'N/A' }],
            events: [{
                name: 'Error',
                date: 'N/A',
                description: 'N/A',
                image: 'https://via.placeholder.com/400x250?text=Sin+Imagen'
            }]
        };
    }
}

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-canvas').appendChild(renderer.domElement);

// Create Stars with Animation
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true });
const starVertices = [];
for (let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0007;
    stars.material.opacity = Math.sin(Date.now() * 0.001) * 0.3 + 0.7;
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth Scroll for Start Button
document.getElementById('startButton').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('constellations').scrollIntoView({ behavior: 'smooth' });
    console.log('Botón "Comienza Ahora" clicado');
});

// Smooth Scroll for Navbar Links
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Populate Data
async function populateData() {
    const data = await fetchAstronomicalData();

    // Constellations
    const constellationList = document.getElementById('constellation-list');
    constellationList.innerHTML = '';
    data.constellations.forEach((constellation, index) => {
        setTimeout(() => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card p-4 animate__animated animate__fadeInUp animate__slower">
                    <div class="card-body">
                        <h5 class="card-title">${constellation.name}</h5>
                        <p class="card-text">${constellation.description}</p>
                        <p class="card-text"><small>Estrellas: ${constellation.mainStars}</small></p>
                    </div>
                </div>
            `;
            constellationList.appendChild(col);
        }, index * 400);
    });

    // Satellites
    const satelliteList = document.getElementById('satellite-list');
    satelliteList.innerHTML = '';
    data.satellites.forEach((satellite, index) => {
        setTimeout(() => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card p-4 animate__animated animate__fadeInUp animate__slower">
                    <div class="card-body">
                        <h5 class="card-title">${satellite.name}</h5>
                        <p class="card-text">Órbita: ${satellite.orbit}</p>
                        <p class="card-text"><small>Estado: ${satellite.status}</small></p>
                    </div>
                </div>
            `;
            satelliteList.appendChild(col);
        }, index * 400);
    });

    // Events
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';
    data.events.forEach((event, index) => {
        setTimeout(() => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch';
            col.innerHTML = `
                <div class="card h-100 p-0 animate__animated animate__fadeInUp animate__slower">
                    <img src="${event.image}" class="card-img-top img-fluid" alt="${event.name}" style="object-fit:cover; height:220px;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="color:#00ffff">${event.name}</h5>
                        <p class="card-text mb-1"><strong>Fecha:</strong> ${event.date}</p>
                        <p class="card-text flex-grow-1">${event.description}</p>
                    </div>
                </div>
            `;
            eventList.appendChild(col);
        }, index * 400);
    });
}

populateData();