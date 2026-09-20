/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/animals.js
 * DESCRIPCIÓN: Módulo de Gestión de Fichas de Animales y Trazabilidad (RF-02, RF-03).
 * 
 * Funcionalidades:
 * 1. Renderizado de tarjetas de animales con fotos, estado, raza y edad.
 * 2. Filtrado interactivo por estado del flujo de rescate y barra de búsqueda.
 * 3. Modal para registrar un nuevo animal o editar antecedentes existentes.
 * 4. Modal de "Ficha Integral del Rescatado" con navegación por pestañas:
 *    - Datos Generales y Personalidad
 *    - Historial Sanitario (Vacunas, Desparasitaciones, Cirugías)
 *    - Hogares Temporales (Permanencia histórica y actual)
 *    - Trazabilidad de Estados (Timeline cronológico)
 *    - Gastos Asociados (Costos acumulados de su rescate)
 * ==============================================================================
 */

const AnimalsModule = {
    currentFilter: 'todos',
    searchQuery: '',

    /**
     * Inicializa los escuchadores de eventos del módulo de animales
     */
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Filtro por botones de estado
        const filterContainer = document.getElementById('animal-status-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.status;
                    this.render();
                }
            });
        }

        // Campo de búsqueda en vivo
        const searchInput = document.getElementById('animal-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                this.render();
            });
        }

        // Botón para abrir modal de registro de nuevo animal
        const btnNewAnimal = document.getElementById('btn-new-animal');
        if (btnNewAnimal) {
            btnNewAnimal.addEventListener('click', () => {
                this.openAnimalModal();
            });
        }

        // Formulario de guardado de animal
        const formAnimal = document.getElementById('form-save-animal');
        if (formAnimal) {
            formAnimal.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveAnimal();
            });
        }

        // Compresión y carga de Foto 1 (Principal)
        const file1 = document.getElementById('animal-file-foto1');
        if (file1) {
            file1.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    window.App.showNotification('⏳ Comprimiendo y optimizando Foto 1...');
                    const compressed = await this.compressImage(file);
                    document.getElementById('animal-form-foto').value = compressed;
                    this.updatePhotoPreview('preview-foto1', compressed);
                    window.App.showNotification('✅ Foto 1 optimizada para almacenamiento.');
                } catch (err) {
                    alert('Error procesando imagen: ' + err.message);
                }
            });
        }

        // Compresión y carga de Foto 2 (Secundaria)
        const file2 = document.getElementById('animal-file-foto2');
        if (file2) {
            file2.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    window.App.showNotification('⏳ Comprimiendo y optimizando Foto 2...');
                    const compressed = await this.compressImage(file);
                    document.getElementById('animal-form-foto2').value = compressed;
                    this.updatePhotoPreview('preview-foto2', compressed);
                    window.App.showNotification('✅ Foto 2 optimizada para almacenamiento.');
                } catch (err) {
                    alert('Error procesando imagen: ' + err.message);
                }
            });
        }

        const urlInput1 = document.getElementById('animal-form-foto');
        if (urlInput1) {
            urlInput1.addEventListener('input', (e) => this.updatePhotoPreview('preview-foto1', e.target.value.trim()));
        }
        const urlInput2 = document.getElementById('animal-form-foto2');
        if (urlInput2) {
            urlInput2.addEventListener('input', (e) => this.updatePhotoPreview('preview-foto2', e.target.value.trim()));
        }
    },

    /**
     * Comprime y redimensiona una imagen en el cliente mediante HTML5 Canvas (Sección 10 del Word)
     */
    compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                return reject(new Error('El archivo seleccionado no es una imagen válida.'));
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth || h > maxHeight) {
                        if (w > h) {
                            h = Math.round((h * maxWidth) / w);
                            w = maxWidth;
                        } else {
                            w = Math.round((w * maxHeight) / h);
                            h = maxHeight;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    updatePhotoPreview(containerId, url) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (url) {
            container.innerHTML = `
                <div class="photo-preview-item">
                    <img src="${url}" class="photo-preview-thumb" alt="Vista previa">
                    <button type="button" class="btn-clear-photo" onclick="AnimalsModule.clearPhoto('${containerId}')" title="Quitar foto">✕</button>
                </div>
            `;
        } else {
            container.innerHTML = '';
        }
    },

    clearPhoto(containerId) {
        if (containerId === 'preview-foto1') {
            document.getElementById('animal-form-foto').value = '';
            document.getElementById('animal-file-foto1').value = '';
            this.updatePhotoPreview('preview-foto1', '');
        } else {
            document.getElementById('animal-form-foto2').value = '';
            document.getElementById('animal-file-foto2').value = '';
            this.updatePhotoPreview('preview-foto2', '');
        }
    },

    /**
     * Renderiza la grilla de tarjetas de animales según filtros activos
     */
    render() {
        const container = document.getElementById('animals-grid-container');
        if (!container) return;

        const animales = window.DB.getAnimales(this.currentFilter, this.searchQuery);

        if (animales.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <div class="empty-icon">🐾</div>
                    <h3>No se encontraron animales</h3>
                    <p>No hay registros que coincidan con el filtro o término de búsqueda seleccionado.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = animales.map(animal => {
            const estadoBadge = this.getStatusBadge(animal.estado_actual);
            const foto = animal.foto_operativa_url || animal.foto_secundaria_url || 'https://via.placeholder.com/400x300?text=Sin+Fotograf%C3%ADa';
            const tieneFotos = Boolean(animal.foto_operativa_url || animal.foto_secundaria_url);

            const esterilBadge = animal.esterilizado === 'si'
                ? '<span class="badge-mini badge-green" title="Esterilizado/a">🩺 Esterilizado/a</span>'
                : (animal.esterilizado === 'no'
                    ? '<span class="badge-mini badge-amber" title="No Esterilizado">⚠️ No Esterilizado</span>'
                    : '<span class="badge-mini badge-gray" title="Esterilización pendiente">⏳ Esteril. Pendiente</span>');

            const chipBadge = animal.microchip 
                ? `<span class="badge-mini badge-blue" title="Microchip Ley 21.020: ${animal.microchip}">🏷️ Chip: ${animal.microchip.slice(-4)}</span>` 
                : '';

            return `
                <div class="card animal-card" data-id="${animal.id}">
                    <div class="animal-card-img-wrap">
                        <img src="${foto}" alt="${animal.nombre}" class="animal-card-img" onerror="this.src='https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'">
                        <span class="animal-status-badge ${estadoBadge.class}">${estadoBadge.label}</span>
                    </div>
                    <div class="animal-card-body">
                        <div class="animal-card-header">
                            <h3 class="animal-name">${animal.nombre}</h3>
                            <span class="animal-specie-badge">${animal.especie} • ${animal.sexo}</span>
                        </div>
                        <p class="animal-meta"><strong>Raza:</strong> ${animal.raza} | <strong>Edad:</strong> ${animal.edad_aprox}</p>
                        
                        <div class="animal-tags-row">
                            ${esterilBadge}
                            ${chipBadge}
                            <span class="badge-mini badge-purple">⚡ ${animal.nivel_energia || 'Medio'}</span>
                        </div>

                        <p class="animal-desc">${animal.descripcion ? animal.descripcion.substring(0, 95) + '...' : 'Sin descripción registrada.'}</p>
                        
                        <div class="animal-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="AnimalsModule.viewFicha('${animal.id}')">
                                📋 Ver Ficha
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="AnimalsModule.openAnimalModal('${animal.id}')">
                                ✏️ Editar
                            </button>
                            ${animal.estado_actual === 'adoptado' && tieneFotos ? `
                                <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); AnimalsModule.liberarFotos('${animal.id}')" title="Liberar fotos operativas de almacenamiento (Sección 10 del Word)">
                                    🧹 Liberar Fotos
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Devuelve el texto y clase de estilo según el estado del animal
     */
    getStatusBadge(estado) {
        const map = {
            'rescate': { label: 'Rescate Inicial', class: 'badge-rescate' },
            'cuarentena': { label: 'Cuarentena / Salud', class: 'badge-cuarentena' },
            'hogar_temporal': { label: 'En Hogar Temporal', class: 'badge-hogar' },
            'disponible': { label: 'Disponible para Adopción', class: 'badge-disponible' },
            'evaluacion': { label: 'En Evaluación', class: 'badge-evaluacion' },
            'adoptado': { label: 'Adoptado (Histórico)', class: 'badge-adoptado' }
        };
        return map[estado] || { label: estado, class: 'badge-default' };
    },

    /**
     * Libera las fotos operativas de un animal adoptado (RF-10 / Sección 10 Ficha Oficial)
     */
    liberarFotos(animalId) {
        const animal = window.DB.db.animales.find(a => a.id === animalId);
        if (!animal) return;
        const confirmMsg = `¿Deseas liberar las fotografías operativas de "${animal.nombre}"?\n\n` +
            `• Conforme a la Sección 10 de la Ficha Oficial, esto libera espacio de almacenamiento en el servidor.\n` +
            `• La ficha, historia clínica, adoptante, seguimientos y enlaces de Google Drive permanecerán 100% intactos.`;
        if (confirm(confirmMsg)) {
            window.DB.liberarFotosAnimal(animalId);
            this.render();
            if (document.getElementById('modal-ficha-integral').classList.contains('active')) {
                this.viewFicha(animalId);
            }
            window.App.showNotification(`🧹 Almacenamiento de fotos liberado para "${animal.nombre}". Ficha conservada.`);
        }
    },

    /**
     * Abre el modal para crear o editar un animal
     */
    openAnimalModal(animalId = null) {
        const modal = document.getElementById('modal-animal-form');
        const title = document.getElementById('modal-animal-title');
        const form = document.getElementById('form-save-animal');

        if (!modal || !form) return;

        form.reset();
        document.getElementById('animal-form-id').value = '';
        this.updatePhotoPreview('preview-foto1', '');
        this.updatePhotoPreview('preview-foto2', '');

        if (animalId) {
            title.textContent = '✏️ Editar Ficha de Animal';
            const animal = window.DB.db.animales.find(a => a.id === animalId);
            if (animal) {
                document.getElementById('animal-form-id').value = animal.id;
                document.getElementById('animal-form-nombre').value = animal.nombre;
                document.getElementById('animal-form-especie').value = animal.especie;
                document.getElementById('animal-form-raza').value = animal.raza;
                document.getElementById('animal-form-sexo').value = animal.sexo;
                document.getElementById('animal-form-edad').value = animal.edad_aprox;
                document.getElementById('animal-form-peso').value = animal.peso_kg;
                document.getElementById('animal-form-tamano').value = animal.tamano;
                document.getElementById('animal-form-estado').value = animal.estado_actual;
                document.getElementById('animal-form-foto').value = animal.foto_operativa_url || '';
                document.getElementById('animal-form-foto2').value = animal.foto_secundaria_url || '';
                document.getElementById('animal-form-esterilizado').value = animal.esterilizado || 'pendiente';
                document.getElementById('animal-form-microchip').value = animal.microchip || '';
                document.getElementById('animal-form-energia').value = animal.nivel_energia || 'Medio';
                document.getElementById('animal-form-ninos').checked = animal.sociable_ninos !== false;
                document.getElementById('animal-form-perros').checked = animal.sociable_perros !== false;
                document.getElementById('animal-form-gatos').checked = animal.sociable_gatos === true;
                document.getElementById('animal-form-drive').value = animal.drive_multimedia_url || '';
                document.getElementById('animal-form-desc').value = animal.descripcion || '';
                document.getElementById('animal-form-personalidad').value = animal.personalidad || '';

                if (animal.foto_operativa_url) this.updatePhotoPreview('preview-foto1', animal.foto_operativa_url);
                if (animal.foto_secundaria_url) this.updatePhotoPreview('preview-foto2', animal.foto_secundaria_url);
            }
        } else {
            title.textContent = '🐾 Registrar Nuevo Rescate';
            document.getElementById('animal-form-estado').value = 'rescate';
            document.getElementById('animal-form-esterilizado').value = 'pendiente';
            document.getElementById('animal-form-energia').value = 'Medio';
            document.getElementById('animal-form-ninos').checked = true;
            document.getElementById('animal-form-perros').checked = true;
            document.getElementById('animal-form-gatos').checked = false;
        }

        modal.classList.add('active');
    },

    /**
     * Procesa y guarda los datos ingresados en el formulario
     */
    handleSaveAnimal() {
        const id = document.getElementById('animal-form-id').value;
        const nombre = document.getElementById('animal-form-nombre').value.trim();
        const especie = document.getElementById('animal-form-especie').value;
        const raza = document.getElementById('animal-form-raza').value.trim() || 'Mestizo';
        const sexo = document.getElementById('animal-form-sexo').value;
        const edad_aprox = document.getElementById('animal-form-edad').value.trim() || 'Desconocida';
        const peso_kg = parseFloat(document.getElementById('animal-form-peso').value) || 0;
        const tamano = document.getElementById('animal-form-tamano').value;
        const estado_actual = document.getElementById('animal-form-estado').value;
        const foto_operativa_url = document.getElementById('animal-form-foto').value.trim();
        const foto_secundaria_url = document.getElementById('animal-form-foto2').value.trim();
        const esterilizado = document.getElementById('animal-form-esterilizado').value;
        const microchip = document.getElementById('animal-form-microchip').value.trim();
        const nivel_energia = document.getElementById('animal-form-energia').value;
        const sociable_ninos = document.getElementById('animal-form-ninos').checked;
        const sociable_perros = document.getElementById('animal-form-perros').checked;
        const sociable_gatos = document.getElementById('animal-form-gatos').checked;
        const drive_multimedia_url = document.getElementById('animal-form-drive').value.trim();
        const descripcion = document.getElementById('animal-form-desc').value.trim();
        const personalidad = document.getElementById('animal-form-personalidad').value.trim();

        if (!nombre) {
            alert('Por favor indica al menos el nombre del animal.');
            return;
        }

        const data = {
            id: id || undefined,
            nombre,
            especie,
            raza,
            sexo,
            edad_aprox,
            peso_kg,
            tamano,
            estado_actual,
            foto_operativa_url,
            foto_secundaria_url,
            esterilizado,
            microchip,
            nivel_energia,
            sociable_ninos,
            sociable_perros,
            sociable_gatos,
            drive_multimedia_url,
            descripcion,
            personalidad
        };

        window.DB.saveAnimal(data);
        document.getElementById('modal-animal-form').classList.remove('active');
        this.render();

        // Notificación de éxito
        window.App.showNotification(`Ficha de "${nombre}" guardada exitosamente.`);
    },

    /**
     * Muestra la Ficha Integral del Animal en un modal completo con pestañas
     */
    viewFicha(animalId) {
        const ficha = window.DB.getFichaCompletaAnimal(animalId);
        if (!ficha) return;

        const modal = document.getElementById('modal-ficha-integral');
        const content = document.getElementById('ficha-integral-content');
        if (!modal || !content) return;

        const { animal, estados, salud, hogares, hogarActual, adopcion, adoptante, seguimientos, cuestionarios = [], gastos, totalGastado } = ficha;
        const estadoBadge = this.getStatusBadge(animal.estado_actual);
        const tieneFotos = Boolean(animal.foto_operativa_url || animal.foto_secundaria_url);

        const esterilLabel = animal.esterilizado === 'si'
            ? '✅ Sí, Esterilizado/a'
            : (animal.esterilizado === 'no' ? '❌ No Esterilizado/a' : '⏳ Pendiente / En tratamiento');

        content.innerHTML = `
            ${animal.estado_actual === 'adoptado' && tieneFotos ? `
                <div class="liberacion-storage-alert">
                    <div class="alert-icon">💡</div>
                    <div class="alert-text">
                        <strong>Mascota Adoptada (Sección 10 del Word):</strong> Puedes liberar el almacenamiento de sus fotografías operativas para dar cupo a nuevos rescates, conservando todo el historial clínico, adoptante y enlaces Drive.
                    </div>
                    <button class="btn btn-warning btn-sm" onclick="AnimalsModule.liberarFotos('${animal.id}')">
                        🧹 Liberar Fotos de Servidor
                    </button>
                </div>
            ` : ''}

            <div class="ficha-header-banner">
                <div class="ficha-photos-cluster">
                    <img src="${animal.foto_operativa_url || 'https://via.placeholder.com/600x400?text=Sin+Foto+Principal'}" class="ficha-avatar" alt="Foto 1: ${animal.nombre}" title="Foto 1: Principal">
                    ${animal.foto_secundaria_url ? `
                        <img src="${animal.foto_secundaria_url}" class="ficha-avatar ficha-avatar-secondary" alt="Foto 2: ${animal.nombre}" title="Foto 2: Secundaria">
                    ` : ''}
                </div>
                <div class="ficha-hero-info">
                    <div class="ficha-title-row">
                        <h2>${animal.nombre}</h2>
                        <span class="animal-status-badge ${estadoBadge.class}">${estadoBadge.label}</span>
                    </div>
                    <p class="ficha-sub">${animal.especie} • ${animal.raza} • ${animal.sexo} • ${animal.edad_aprox} • ${animal.peso_kg} kg</p>
                    <p class="ficha-date">📅 Fecha de Ingreso: ${animal.fecha_ingreso}</p>
                    ${animal.drive_multimedia_url ? `<a href="${animal.drive_multimedia_url}" target="_blank" class="ficha-drive-link">📁 Ver Carpeta Multimedia en Google Drive</a>` : ''}
                </div>
            </div>

            <!-- Navegación por pestañas de la ficha -->
            <div class="ficha-tabs-nav">
                <button class="ficha-tab-btn active" onclick="AnimalsModule.switchFichaTab(event, 'tab-general')">Antecedentes</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-salud')">Historial Sanitario (${salud.length})</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-hogares')">Hogares Temporales (${hogares.length})</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-postulaciones')">Postulaciones (${cuestionarios.length})</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-adopcion')">Adopción y Seguimiento</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-gastos')">Gastos ($${totalGastado.toLocaleString('es-CL')})</button>
                <button class="ficha-tab-btn" onclick="AnimalsModule.switchFichaTab(event, 'tab-timeline')">Trazabilidad</button>
            </div>

            <!-- Contenidos de las pestañas -->
            <div class="ficha-tabs-content">
                <!-- Pestaña 1: General -->
                <div id="tab-general" class="ficha-tab-panel active">
                    <!-- FICHA SANITARIA Y LEY 21.020 -->
                    <div class="ficha-data-grid">
                        <div class="data-item">
                            <span class="data-label">🩺 Esterilización:</span>
                            <span class="data-value">${esterilLabel}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">🏷️ Microchip (Ley 21.020):</span>
                            <span class="data-value">${animal.microchip || '<em class="text-muted">No implantado</em>'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">⚡ Nivel de Energía:</span>
                            <span class="data-value">${animal.nivel_energia || 'Medio'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">👶 Apto con Niños:</span>
                            <span class="data-value">${animal.sociable_ninos !== false ? '✅ Sí' : '❌ No recomendado'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">🐕 Convivencia Perros:</span>
                            <span class="data-value">${animal.sociable_perros !== false ? '✅ Sociable' : '❌ No sociable'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">🐈 Convivencia Gatos:</span>
                            <span class="data-value">${animal.sociable_gatos ? '✅ Apto con gatos' : '⚠️ No testeado / No recomendado'}</span>
                        </div>
                    </div>

                    <h4 style="margin-top:1.5rem;">Historia del Rescate</h4>
                    <p>${animal.descripcion || 'Sin antecedentes específicos de rescate.'}</p>
                    
                    <h4 style="margin-top:1.5rem;">Carácter y Personalidad</h4>
                    <p>${animal.personalidad || 'Información de comportamiento pendiente de evaluar.'}</p>

                    ${hogarActual ? `
                        <div class="info-box-highlight">
                            <strong>🏡 Hogar Temporal Actual:</strong> ${hogarActual.hogar ? hogarActual.hogar.nombre_cuidador : 'Asignado'} (Desde: ${hogarActual.fecha_ingreso})
                            <br><small>Dirección: ${hogarActual.hogar ? hogarActual.hogar.direccion : ''} | Tel: ${hogarActual.hogar ? hogarActual.hogar.telefono : ''}</small>
                        </div>
                    ` : '<p class="text-muted" style="margin-top:1rem;">Actualmente no se encuentra asignado a un hogar temporal.</p>'}
                </div>

                <!-- Pestaña 2: Salud -->
                <div id="tab-salud" class="ficha-tab-panel">
                    <div class="section-actions-header">
                        <h4>Atenciones Sanitarias Cronológicas</h4>
                        <button class="btn btn-primary btn-sm" onclick="HealthModule.openAddHealthModal('${animal.id}')">+ Nueva Atención</button>
                    </div>
                    ${salud.length === 0 ? '<p class="text-muted">No registra antecedentes sanitarios.</p>' : `
                        <div class="timeline-container">
                            ${salud.map(s => `
                                <div class="timeline-item">
                                    <div class="timeline-dot dot-health"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-header">
                                            <span class="timeline-type">${s.tipo_evento}</span>
                                            <span class="timeline-date">📅 ${s.fecha}</span>
                                        </div>
                                        <p class="timeline-body">${s.descripcion}</p>
                                        <div class="timeline-meta">
                                            <span>🩺 Profesional: ${s.veterinario || 'No especificado'}</span>
                                            ${s.proximo_control ? `<span>⏰ Próximo control: ${s.proximo_control}</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <!-- Pestaña 3: Hogares Temporales -->
                <div id="tab-hogares" class="ficha-tab-panel">
                    <div class="section-actions-header">
                        <h4>Historial de Permanencia en Hogares</h4>
                        <button class="btn btn-primary btn-sm" onclick="HomesModule.openAssignModal('${animal.id}')">Asignar a Hogar</button>
                    </div>
                    ${hogares.length === 0 ? '<p class="text-muted">No ha sido registrado en hogares temporales.</p>' : `
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Cuidador / Hogar</th>
                                        <th>Fecha Ingreso</th>
                                        <th>Fecha Salida</th>
                                        <th>Estado</th>
                                        <th>Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${hogares.map(h => `
                                        <tr>
                                            <td><strong>${h.hogar ? h.hogar.nombre_cuidador : 'Hogar no encontrado'}</strong></td>
                                            <td>${h.fecha_ingreso}</td>
                                            <td>${h.fecha_salida || '<span class="badge-ready">Actualmente aquí</span>'}</td>
                                            <td>${!h.fecha_salida ? 'Vigente' : 'Finalizado'}</td>
                                            <td>${h.observaciones || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- Pestaña Postulaciones y Cuestionarios Digitales -->
                <div id="tab-postulaciones" class="ficha-tab-panel">
                    <div class="section-actions-header">
                        <h4>Postulaciones y Evaluaciones de Cuestionario</h4>
                        <button class="btn btn-secondary btn-sm" onclick="AdoptionsModule.openCuestionarioModal('${animal.id}')">
                            📝 Evaluar Nuevo Postulante
                        </button>
                    </div>
                    ${cuestionarios.length === 0 ? `
                        <p class="text-muted">No se registran cuestionarios de postulación vinculados directamente a esta mascota.</p>
                    ` : `
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Postulante</th>
                                        <th>Contacto</th>
                                        <th>Vivienda</th>
                                        <th>Evaluación</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cuestionarios.map(c => `
                                        <tr>
                                            <td>${c.fecha_postulacion || '-'}</td>
                                            <td><strong>${c.nombre_postulante}</strong><br><small class="text-muted">RUT: ${c.rut || '-'}</small></td>
                                            <td>${c.telefono}<br><small>${c.email || ''}</small></td>
                                            <td>${c.tipo_vivienda || '-'}</td>
                                            <td>
                                                <span class="badge-tag ${c.estado_evaluacion === 'aprobado' ? 'badge-green' : (c.estado_evaluacion === 'requiere_entrevista' ? 'badge-amber' : 'badge-red')}">
                                                    ${c.estado_evaluacion === 'aprobado' ? '🌟 Aprobado' : (c.estado_evaluacion === 'requiere_entrevista' ? '⚠️ Entrevista' : '❌ Observaciones')}
                                                </span>
                                            </td>
                                            <td>
                                                ${c.estado_evaluacion === 'aprobado' && animal.estado_actual !== 'adoptado' ? `
                                                    <button class="btn btn-accent btn-sm" onclick="AdoptionsModule.convertirPostulanteAAdopcion('${c.id}', '${animal.id}')">
                                                        🤝 Formalizar
                                                    </button>
                                                ` : `
                                                    <span class="text-muted">-</span>
                                                `}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- Pestaña 4: Adopción y Seguimiento -->
                <div id="tab-adopcion" class="ficha-tab-panel">
                    ${!adopcion ? `
                        <div class="empty-adopcion-box">
                            <p>Este animal aún no ha sido adoptado.</p>
                            <button class="btn btn-accent btn-sm" onclick="AdoptionsModule.openAdoptionModal('${animal.id}')">
                                🤝 Concretar Proceso de Adopción
                            </button>
                        </div>
                    ` : `
                        <div class="adopcion-summary-card">
                            <h4>Datos de la Adopción Concretada</h4>
                            <p><strong>Fecha de Entrega:</strong> ${adopcion.fecha_adopcion}</p>
                            <p><strong>Folio Contrato:</strong> ${adopcion.contrato_folio}</p>
                            <div class="adoptante-info-box">
                                <h5>Adoptante Responsable:</h5>
                                <p><strong>Nombre:</strong> ${adoptante ? adoptante.nombre : 'No especificado'}</p>
                                <p><strong>Teléfono:</strong> ${adoptante ? adoptante.telefono : '-'}</p>
                                <p><strong>Dirección:</strong> ${adoptante ? adoptante.direccion : '-'}</p>
                                <p><strong>Email:</strong> ${adoptante ? adoptante.email : '-'}</p>
                            </div>
                        </div>

                        <div class="section-actions-header" style="margin-top:2rem;">
                            <h4>Historial de Seguimientos Post-Adopción</h4>
                            <button class="btn btn-secondary btn-sm" onclick="AdoptionsModule.openNewSeguimientoModal('${adopcion.id}', '${animal.id}')">+ Nuevo Seguimiento</button>
                        </div>

                        <div class="timeline-container">
                            ${seguimientos.map(seg => `
                                <div class="timeline-item">
                                    <div class="timeline-dot dot-followup"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-header">
                                            <span><strong>Medio:</strong> ${seg.medio_contacto}</span>
                                            <span class="timeline-date">📅 ${seg.fecha}</span>
                                        </div>
                                        <p><strong>Estado de la mascota:</strong> <span class="badge-ready">${seg.estado_mascota}</span></p>
                                        <p class="timeline-body">${seg.observaciones}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <!-- Pestaña 5: Gastos -->
                <div id="tab-gastos" class="ficha-tab-panel">
                    <div class="section-actions-header">
                        <h4>Gastos Relacionados con ${animal.nombre}</h4>
                        <span class="badge-total-gasto">Total Invertido: $${totalGastado.toLocaleString('es-CL')}</span>
                    </div>
                    ${gastos.length === 0 ? '<p class="text-muted">No hay gastos directos registrados para este animal.</p>' : `
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Concepto</th>
                                        <th>Categoría</th>
                                        <th>Tipo Asignación</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${gastos.map(g => `
                                        <tr>
                                            <td>${g.fecha}</td>
                                            <td>${g.concepto}</td>
                                            <td><span class="badge-tag">${g.categoria}</span></td>
                                            <td>${g.tipo_asignacion === 'multiples_animales' ? 'Compartido con otros' : 'Exclusivo'}</td>
                                            <td><strong>$${Number(g.monto).toLocaleString('es-CL')}</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- Pestaña 6: Trazabilidad de Estados -->
                <div id="tab-timeline" class="ficha-tab-panel">
                    <h4>Flujo de Estados Registrados</h4>
                    <div class="timeline-container">
                        ${estados.map(est => `
                            <div class="timeline-item">
                                <div class="timeline-dot dot-state"></div>
                                <div class="timeline-content">
                                    <div class="timeline-header">
                                        <span class="animal-status-badge ${AnimalsModule.getStatusBadge(est.estado).class}">
                                            ${AnimalsModule.getStatusBadge(est.estado).label}
                                        </span>
                                        <span class="timeline-date">📅 ${est.fecha}</span>
                                    </div>
                                    <p class="timeline-body">${est.observaciones || 'Sin comentarios registrados.'}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    },

    /**
     * Permite alternar entre pestañas dentro de la Ficha Integral
     */
    switchFichaTab(event, tabId) {
        document.querySelectorAll('.ficha-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.ficha-tab-panel').forEach(panel => panel.classList.remove('active'));

        event.currentTarget.classList.add('active');
        const targetPanel = document.getElementById(tabId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }
};

window.AnimalsModule = AnimalsModule;
