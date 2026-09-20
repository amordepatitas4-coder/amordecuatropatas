/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/diffusion.js
 * DESCRIPCIÓN: Módulo local de difusión y generador de flyers (preintegración RF-12).
 * 
 * Cumple con:
 * 1. Asistente de IA: Genera borradores de publicaciones emotivas para redes
 *    sociales a partir de los datos autorizados de la ficha del animal.
 *    (Con revisión y edición humana garantizada).
 * 2. Generador de Flyer: Utiliza HTML5 Canvas para componer la fotografía real
 *    del animal + datos + insignia de la Fundación + llamada a la acción.
 * 3. Descarga directa en formato imagen (PNG) sin consumo de espacio en servidor.
 * ==============================================================================
 */

const DiffusionModule = {
    selectedAnimal: null,

    init() {
        this.bindEvents();
        this.populateAnimalSelector();
    },

    bindEvents() {
        // Selector de animal para difusión
        const selectAnimal = document.getElementById('diffusion-animal-select');
        if (selectAnimal) {
            selectAnimal.addEventListener('change', (e) => {
                const id = e.target.value;
                this.selectedAnimal = window.DB.db.animales.find(a => a.id === id) || null;
                this.updatePreview();
            });
        }

        // Botón generar texto con IA
        const btnGenerateAI = document.getElementById('btn-generate-ai-text');
        if (btnGenerateAI) {
            btnGenerateAI.addEventListener('click', () => {
                this.generateAIText();
            });
        }

        // Botón copiar texto al portapapeles
        const btnCopy = document.getElementById('btn-copy-ai-text');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const text = document.getElementById('diffusion-ai-result').value;
                if (!text) return;
                navigator.clipboard.writeText(text);
                window.App.showNotification('📋 ¡Texto copiado al portapapeles!');
            });
        }

        // Botón renderizar flyer
        const btnRenderFlyer = document.getElementById('btn-render-flyer');
        if (btnRenderFlyer) {
            btnRenderFlyer.addEventListener('click', () => {
                this.drawFlyer();
            });
        }

        // Botón descargar flyer
        const btnDownload = document.getElementById('btn-download-flyer');
        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                this.downloadFlyerPNG();
            });
        }
    },

    populateAnimalSelector() {
        const selectAnimal = document.getElementById('diffusion-animal-select');
        if (!selectAnimal) return;

        // Seleccionar preferentemente animales en adopción o activos
        const candidatos = window.DB.db.animales.filter(a => a.estado_actual !== 'adoptado');
        selectAnimal.innerHTML = `
            <option value="">-- Selecciona una mascota para difundir --</option>
            ${candidatos.map(a => `<option value="${a.id}">${a.nombre} (${a.especie} - ${a.raza})</option>`).join('')}
        `;

        if (candidatos.length > 0) {
            selectAnimal.value = candidatos[0].id;
            this.selectedAnimal = candidatos[0];
            this.updatePreview();
        }
    },

    updatePreview() {
        if (!this.selectedAnimal) return;
        const animal = this.selectedAnimal;

        // Cargar datos en el generador
        document.getElementById('flyer-input-name').value = animal.nombre;
        document.getElementById('flyer-input-age').value = animal.edad_aprox;
        document.getElementById('flyer-input-traits').value = animal.personalidad || animal.raza;

        this.drawFlyer();
    },

    /**
     * Generador local de borradores mediante plantillas editables.
     * La IA remota se conectará después mediante un servicio autenticado.
     */
    generateAIText() {
        if (!this.selectedAnimal) {
            alert('Por favor selecciona una mascota primero.');
            return;
        }

        const animal = this.selectedAnimal;
        const tono = document.getElementById('diffusion-tone-select').value;
        const canal = document.getElementById('diffusion-channel-select').value;
        const output = document.getElementById('diffusion-ai-result');

        output.value = '⏳ Preparando borrador local para revisión...';

        setTimeout(() => {
            let borrador = '';
            const hashtagEspecie = animal.especie.toLowerCase() === 'canino' ? '#PerritoEnAdopción #AdoptaNoCompres' : '#GatitoEnAdopción #MichiEnAdopción';

            if (tono === 'emotivo') {
                borrador = `🐾 ¡HOLA, ME LLAMO ${animal.nombre.toUpperCase()} Y SUEÑO CON UN HOGAR! 🏡❤️\n\n` +
                    `Mi historia no empezó fácil... ${animal.descripcion || 'Fui rescatada con mucho amor por la Fundación Amor de Cuatro Patas.'} ` +
                    `Hoy tengo ${animal.edad_aprox}, peso ${animal.peso_kg}kg y mi corazón está lleno de ternura para dar.\n\n` +
                    `✨ ¿Cómo soy? ${animal.personalidad || 'Muy cariñosa, tranquila y agradecida de la vida.'}\n` +
                    `🩺 Cuento con mis vacunas, controles al día y esterilización lista.\n\n` +
                    `Si sientes que puedo ser parte de tu familia, envíanos un mensaje o contáctanos para iniciar el proceso de adopción responsable. 💌\n\n` +
                    `Comparte para que llegue a su familia ideal ✨🐶🐱\n` +
                    `${hashtagEspecie} #FundaciónAmorDeCuatroPatas #Talca #Chile`;
            } else if (tono === 'alegre') {
                borrador = `🎉 ¡CONOCE A ${animal.nombre.toUpperCase()}! LA ALEGRÍA DE LA CASA 🐾✨\n\n` +
                    `¿Buscas un compañero fiel, juguetón y lleno de vida? ¡Aquí estoy yo! 🐶\n` +
                    `• Edad: ${animal.edad_aprox}\n` +
                    `• Raza/Tamaño: ${animal.raza} (${animal.tamano})\n` +
                    `• Mi superpoder: ${animal.personalidad || 'Hacerte sonreír todos los días y dar amor incondicional.'}\n\n` +
                    `¡Estoy 100% listo para mudarme a un hogar que me ame para siempre! 🏡\n` +
                    `Escríbenos por interno o solicita el formulario de postulación.\n\n` +
                    `${hashtagEspecie} #AdopciónResponsable #AmorDeCuatroPatas`;
            } else {
                borrador = `📢 ADOPCIÓN RESPONSABLE — ${animal.nombre.toUpperCase()}\n\n` +
                    `La Fundación Amor de Cuatro Patas busca familia definitiva para ${animal.nombre}.\n\n` +
                    `📋 Ficha del Animal:\n` +
                    `- Especie: ${animal.especie}\n` +
                    `- Raza: ${animal.raza}\n` +
                    `- Sexo: ${animal.sexo}\n` +
                    `- Edad aproximada: ${animal.edad_aprox}\n` +
                    `- Estado sanitario: Carnet veterinario al día y esterilización al día.\n` +
                    `- Características: ${animal.personalidad || animal.descripcion}\n\n` +
                    `📍 Requisitos: Tenencia responsable, espacio seguro y seguimiento post-adopción.\n` +
                    `📩 Interesados enviar mensaje privado a la Fundación.`;
            }

            if (canal === 'instagram') {
                borrador += `\n\n. \n. \n. \n#instapet #adopcionchile #mascotasfelices`;
            }

            output.value = borrador;
            window.App.showNotification('✨ Borrador local listo para revisión humana.');
        }, 500);
    },

    /**
     * Dibuja el Flyer publicitario en el Canvas de HTML5
     */
    drawFlyer() {
        const canvas = document.getElementById('flyer-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const width = canvas.width;
        const height = canvas.height;

        const theme = (document.getElementById('flyer-select-theme') ? document.getElementById('flyer-select-theme').value : 'institucional');

        // Paletas de color según tema seleccionado
        const themes = {
            'institucional': {
                bg1: '#1e1b4b', bg2: '#312e81', bg3: '#0f172a',
                accent: '#6366f1', badge: '#4f46e5', border: '#818cf8',
                footer: '#10b981', footerText: '¡ADOPTA O COMPARTE! 💌 Contáctanos',
                sub: '🐾 Buscando un Hogar Responsable 🐾'
            },
            'urgente': {
                bg1: '#450a0a', bg2: '#7c2d12', bg3: '#18181b',
                accent: '#ef4444', badge: '#dc2626', border: '#f87171',
                footer: '#ea580c', footerText: '🚨 ¡HOGAR O ADOPCIÓN URGENTE! 🚨',
                sub: '⚠️ CASO DE ALTA PRIORIDAD ⚠️'
            },
            'cachorro': {
                bg1: '#3b0764', bg2: '#701a75', bg3: '#0f172a',
                accent: '#ec4899', badge: '#db2777', border: '#f472b6',
                footer: '#d946ef', footerText: '💖 ¡DALE UN FUTURO LLENO DE AMOR! 💖',
                sub: '✨ Dulce Bebé Busca Familia Amorosa ✨'
            },
            'senior': {
                bg1: '#064e3b', bg2: '#047857', bg3: '#0f172a',
                accent: '#10b981', badge: '#059669', border: '#34d399',
                footer: '#0d9488', footerText: '💚 ADOPCIÓN SENIOR CON CORAZÓN 💚',
                sub: '🌿 Compañero Noble, Tranquilo y Leal 🌿'
            }
        };

        const activeTheme = themes[theme] || themes['institucional'];

        // Limpiar lienzo con fondo degradado del tema
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, activeTheme.bg1);
        bgGrad.addColorStop(0.5, activeTheme.bg2);
        bgGrad.addColorStop(1, activeTheme.bg3);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Barra superior decorativa
        ctx.fillStyle = activeTheme.accent;
        ctx.fillRect(0, 0, width, 12);

        // Título de la Fundación
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FUNDACIÓN AMOR DE CUATRO PATAS', width / 2, 45);

        ctx.font = '600 15px "Inter", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(activeTheme.sub, width / 2, 70);

        // Marco de la Fotografía
        const photoX = 50;
        const photoY = 95;
        const photoWidth = width - 100;
        const photoHeight = 340;

        // Intentar dibujar la foto real del animal
        const animal = this.selectedAnimal;
        const photoUrl = animal && animal.foto_operativa_url 
            ? animal.foto_operativa_url 
            : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Fondo con bordes redondeados para la foto
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 16);
            ctx.clip();
            ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
            ctx.restore();

            // Sombra y marco exterior
            ctx.strokeStyle = activeTheme.border;
            ctx.lineWidth = 4;
            ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

            // Detalles inferiores
            this.drawFlyerDetails(ctx, width, height, activeTheme);
        };
        img.onerror = () => {
            ctx.fillStyle = '#334155';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px "Inter", sans-serif';
            ctx.fillText('Foto de la mascota', width / 2, photoY + 170);
            this.drawFlyerDetails(ctx, width, height, activeTheme);
        };
        img.src = photoUrl;
    },

    drawFlyerDetails(ctx, width, height, activeTheme = null) {
        const theme = activeTheme || {
            badge: '#4f46e5',
            footer: '#10b981',
            footerText: '¡ADOPTA O COMPARTE! 💌 Contáctanos'
        };

        const name = document.getElementById('flyer-input-name').value.toUpperCase() || 'MI MASCOTA';
        const age = document.getElementById('flyer-input-age').value || 'Adulto';
        const traits = document.getElementById('flyer-input-traits').value || 'Cariñoso, esterilizado y con vacunas al día';

        // Badge con el nombre
        ctx.fillStyle = theme.badge;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 160, 455, 320, 50, 25);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(name, width / 2, 490);

        // Edad y tamaño
        ctx.font = '600 18px "Inter", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`Edad: ${age}`, width / 2, 530);

        // Cualidades / Rasgos
        ctx.font = '400 15px "Inter", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(traits, width / 2, 560);

        // Franja inferior de contacto
        ctx.fillStyle = theme.footer;
        ctx.fillRect(30, 600, width - 60, 55);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 17px "Inter", sans-serif';
        ctx.fillText(theme.footerText, width / 2, 634);
    },

    downloadFlyerPNG() {
        const canvas = document.getElementById('flyer-canvas');
        if (!canvas) return;

        const name = (this.selectedAnimal ? this.selectedAnimal.nombre : 'adopcion').toLowerCase();
        const link = document.createElement('a');
        link.download = `flyer_adopcion_${name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        window.App.showNotification('🎉 ¡Flyer descargado exitosamente en tu equipo!');
    }
};

window.DiffusionModule = DiffusionModule;
