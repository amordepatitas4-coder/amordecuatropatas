/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/homes.js
 * DESCRIPCIÓN: Módulo de Gestión de Hogares Temporales (RF-05).
 * 
 * Funcionalidades:
 * 1. Registro y mantención de cuidadores temporales de paso.
 * 2. Visualización de animales actualmente alojados en cada hogar.
 * 3. Asignación de animales a hogares temporales con trazabilidad de fechas.
 * ==============================================================================
 */

const HomesModule = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Modal nuevo hogar
        const btnNewHome = document.getElementById('btn-new-home');
        if (btnNewHome) {
            btnNewHome.addEventListener('click', () => {
                this.openNewHomeModal();
            });
        }

        // Formulario nuevo hogar
        const formHome = document.getElementById('form-save-home');
        if (formHome) {
            formHome.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveHome();
            });
        }

        // Formulario de asignación animal a hogar
        const formAssign = document.getElementById('form-assign-home');
        if (formAssign) {
            formAssign.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveAssignment();
            });
        }
    },

    render() {
        const container = document.getElementById('homes-grid-container');
        if (!container) return;

        const hogares = window.DB.getHogaresTemporales();

        if (hogares.length === 0) {
            container.innerHTML = `<div class="empty-state-card"><p>No hay hogares temporales registrados.</p></div>`;
            return;
        }

        container.innerHTML = hogares.map(hogar => {
            // Obtener animales actualmente en este hogar
            const asignacionesActivas = window.DB.db.animal_hogares.filter(ah => ah.hogar_id === hogar.id && !ah.fecha_salida);
            const animalesOcupantes = asignacionesActivas.map(ah => {
                const anim = window.DB.db.animales.find(a => a.id === ah.animal_id);
                return anim ? { ...anim, fecha_ingreso: ah.fecha_ingreso } : null;
            }).filter(Boolean);

            return `
                <div class="card home-card">
                    <div class="home-card-header">
                        <div class="home-title">
                            <h3>🏡 ${hogar.nombre_cuidador}</h3>
                            <span class="home-type-badge">${hogar.tipo_vivienda || 'Hogar Temporal'}</span>
                        </div>
                        <span class="badge ${animalesOcupantes.length >= hogar.capacidad_maxima ? 'badge-rescate' : 'badge-ready'}">
                            ${animalesOcupantes.length} / ${hogar.capacidad_maxima} Ocupados
                        </span>
                    </div>
                    
                    <div class="home-card-details">
                        <p><strong>📞 Teléfono:</strong> ${hogar.telefono || 'Sin teléfono'}</p>
                        <p><strong>📍 Dirección:</strong> ${hogar.direccion || 'Sin dirección'}</p>
                        <p class="text-muted"><em>${hogar.notas || ''}</em></p>
                    </div>

                    <div class="home-occupants-section">
                        <h4>Mascotas Alojadas Actualmente:</h4>
                        ${animalesOcupantes.length === 0 ? '<p class="text-muted small">Sin animales hospedados actualmente.</p>' : `
                            <div class="occupants-chips">
                                ${animalesOcupantes.map(a => `
                                    <span class="occupant-chip" onclick="AnimalsModule.viewFicha('${a.id}')">
                                        🐾 ${a.nombre} (Desde ${a.fecha_ingreso})
                                    </span>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <div class="home-card-footer">
                        <button class="btn btn-secondary btn-sm" onclick="HomesModule.openAssignModal(null, '${hogar.id}')">
                            ➕ Hospedar Mascota
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    openNewHomeModal() {
        const modal = document.getElementById('modal-home-form');
        const form = document.getElementById('form-save-home');
        if (!modal || !form) return;
        form.reset();
        modal.classList.add('active');
    },

    handleSaveHome() {
        const nombre_cuidador = document.getElementById('home-form-nombre').value.trim();
        const telefono = document.getElementById('home-form-tel').value.trim();
        const direccion = document.getElementById('home-form-dir').value.trim();
        const tipo_vivienda = document.getElementById('home-form-tipo').value;
        const capacidad_maxima = parseInt(document.getElementById('home-form-capacidad').value, 10) || 1;
        const notas = document.getElementById('home-form-notas').value.trim();

        if (!nombre_cuidador) {
            alert('Por favor ingresa el nombre de la persona o familia cuidadora.');
            return;
        }

        window.DB.saveHogarTemporal({
            nombre_cuidador,
            telefono,
            direccion,
            tipo_vivienda,
            capacidad_maxima,
            notas
        });

        document.getElementById('modal-home-form').classList.remove('active');
        this.render();
        window.App.showNotification(`Hogar temporal de ${nombre_cuidador} registrado.`);
    },

    openAssignModal(preselectedAnimalId = null, preselectedHomeId = null) {
        const modal = document.getElementById('modal-assign-home');
        const selectAnimal = document.getElementById('assign-animal-select');
        const selectHome = document.getElementById('assign-home-select');

        if (!modal || !selectAnimal || !selectHome) return;

        // Cargar animales disponibles o en cuarentena
        selectAnimal.innerHTML = window.DB.db.animales.map(a => `
            <option value="${a.id}" ${preselectedAnimalId === a.id ? 'selected' : ''}>
                ${a.nombre} (${a.estado_actual})
            </option>
        `).join('');

        // Cargar hogares
        selectHome.innerHTML = window.DB.getHogaresTemporales().map(h => `
            <option value="${h.id}" ${preselectedHomeId === h.id ? 'selected' : ''}>
                ${h.nombre_cuidador} (${h.tipo_vivienda} - Cap: ${h.capacidad_maxima})
            </option>
        `).join('');

        modal.classList.add('active');
    },

    handleSaveAssignment() {
        const animalId = document.getElementById('assign-animal-select').value;
        const hogarId = document.getElementById('assign-home-select').value;
        const observaciones = document.getElementById('assign-observaciones').value.trim();

        if (!animalId || !hogarId) {
            alert('Debes seleccionar tanto la mascota como el hogar receptor.');
            return;
        }

        try {
            window.DB.asignarAnimalAHogar(animalId, hogarId, observaciones);
        } catch (error) {
            alert(error.message);
            return;
        }
        document.getElementById('modal-assign-home').classList.remove('active');
        this.render();
        AnimalsModule.render();

        const anim = window.DB.db.animales.find(a => a.id === animalId);
        window.App.showNotification(`Mascota "${anim ? anim.nombre : ''}" asignada al hogar con éxito.`);
    }
};

window.HomesModule = HomesModule;
