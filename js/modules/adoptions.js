/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/adoptions.js
 * DESCRIPCIÓN: Módulo de Adopciones, Adoptantes y Seguimientos Post-Adopción (RF-07, RF-08).
 * 
 * Funcionalidades:
 * 1. Proceso de concreción de adopciones (Vincular Mascota + Adoptante + Folio Contrato).
 * 2. Registro histórico de adoptantes responsables.
 * 3. Gestión acumulativa de seguimientos post-adopción (Llamadas, visitas, fotos, bienestar).
 * ==============================================================================
 */

const AdoptionsModule = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Formulario concretar adopción
        const formAdoption = document.getElementById('form-save-adoption');
        if (formAdoption) {
            formAdoption.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveAdoption();
            });
        }

        // Formulario nuevo seguimiento
        const formSeg = document.getElementById('form-add-seguimiento');
        if (formSeg) {
            formSeg.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveSeguimiento();
            });
        }
    },

    switchSubTab(tab) {
        const btnAdop = document.getElementById('subtab-btn-adopciones');
        const btnCue = document.getElementById('subtab-btn-cuestionarios');
        const contentAdop = document.getElementById('subtab-content-adopciones');
        const contentCue = document.getElementById('subtab-content-cuestionarios');

        if (tab === 'adopciones') {
            btnAdop?.classList.add('active');
            btnCue?.classList.remove('active');
            if (contentAdop) contentAdop.style.display = 'block';
            if (contentCue) contentCue.style.display = 'none';
        } else {
            btnCue?.classList.add('active');
            btnAdop?.classList.remove('active');
            if (contentCue) contentCue.style.display = 'block';
            if (contentAdop) contentAdop.style.display = 'none';
            this.renderCuestionarios();
        }
    },

    render() {
        // Actualizar contadores
        const countAdop = document.getElementById('count-adopciones');
        if (countAdop) countAdop.textContent = window.DB.db.adopciones.length;
        const countCue = document.getElementById('count-cuestionarios');
        if (countCue) countCue.textContent = (window.DB.db.cuestionarios_adopcion || []).length;

        // Renderizar tabla de adopciones
        const container = document.getElementById('adoptions-table-body');
        if (container) {
            const adopciones = window.DB.db.adopciones.slice().sort((a, b) => new Date(b.fecha_adopcion) - new Date(a.fecha_adopcion));

            if (adopciones.length === 0) {
                container.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay adopciones formalizadas aún.</td></tr>`;
            } else {
                container.innerHTML = adopciones.map(adop => {
                    const animal = window.DB.db.animales.find(a => a.id === adop.animal_id);
                    const adoptante = window.DB.db.adoptantes.find(adp => adp.id === adop.adoptante_id);
                    const seguimientos = window.DB.db.seguimientos.filter(s => s.adopcion_id === adop.id);

                    return `
                        <tr>
                            <td><strong>${adop.fecha_adopcion}</strong></td>
                            <td>
                                <span class="animal-link" onclick="AnimalsModule.viewFicha('${adop.animal_id}')">
                                    🐾 ${animal ? animal.nombre : 'Desconocido'}
                                </span>
                            </td>
                            <td>
                                <strong>${adoptante ? adoptante.nombre : 'Sin adoptante'}</strong><br>
                                <small class="text-muted">Tel: ${adoptante ? adoptante.telefono : '-'}</small>
                            </td>
                            <td><span class="badge-tag">${adop.contrato_folio}</span></td>
                            <td>
                                <span class="badge-ready">${seguimientos.length} Seguimiento(s)</span>
                            </td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="AdoptionsModule.openNewSeguimientoModal('${adop.id}', '${adop.animal_id}')">
                                    📝 + Seguimiento
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Renderizar tabla de cuestionarios
        this.renderCuestionarios();
    },

    renderCuestionarios() {
        const container = document.getElementById('cuestionarios-table-body');
        if (!container) return;

        const filtro = document.getElementById('cuestionario-filter-estado')?.value || 'todos';
        const lista = window.DB.getCuestionarios(filtro);

        const countCue = document.getElementById('count-cuestionarios');
        if (countCue) countCue.textContent = (window.DB.db.cuestionarios_adopcion || []).length;

        if (lista.length === 0) {
            container.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay postulaciones registradas en esta categoría.</td></tr>`;
            return;
        }

        container.innerHTML = lista.map(c => {
            const animal = window.DB.db.animales.find(a => a.id === c.animal_id);
            const badgeClass = c.estado_evaluacion === 'aprobado' ? 'badge-green' : (c.estado_evaluacion === 'requiere_entrevista' ? 'badge-amber' : 'badge-red');
            const badgeLabel = c.estado_evaluacion === 'aprobado' ? '🌟 Aprobado' : (c.estado_evaluacion === 'requiere_entrevista' ? '⚠️ Entrevista' : '❌ Observaciones');

            return `
                <tr>
                    <td><strong>${c.fecha_postulacion || '-'}</strong></td>
                    <td>
                        <strong>${c.nombre_postulante}</strong><br>
                        <small class="text-muted">RUT: ${c.rut || '-'}</small>
                    </td>
                    <td>
                        📞 ${c.telefono}<br>
                        <small class="text-muted">✉️ ${c.email || '-'}</small>
                    </td>
                    <td>
                        ${animal ? `
                            <span class="animal-link" onclick="AnimalsModule.viewFicha('${animal.id}')">
                                🐾 ${animal.nombre} (${animal.especie})
                            </span>
                        ` : '<span class="text-muted">Abierto a recomendación</span>'}
                    </td>
                    <td>
                        <span class="badge-tag ${badgeClass}">${badgeLabel}</span><br>
                        <small><strong>${c.puntaje ? `${c.puntaje}/100 pts` : ''}</strong> ${c.tipo_vivienda ? `• ${c.tipo_vivienda}` : ''}</small>
                    </td>
                    <td>
                        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                            <button class="btn btn-secondary btn-sm" onclick="AdoptionsModule.verDetalleCuestionario('${c.id}')" title="Ver cuestionario completo">
                                📋 Detalle
                            </button>
                            ${c.estado_evaluacion === 'aprobado' ? `
                                <button class="btn btn-accent btn-sm" onclick="AdoptionsModule.convertirPostulanteAAdopcion('${c.id}', '${c.animal_id || ''}')" title="Concretar adopción con este postulante">
                                    🤝 Formalizar
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openAdoptionModal(preselectedAnimalId = null) {
        const modal = document.getElementById('modal-adoption-form');
        const form = document.getElementById('form-save-adoption');
        const selectAnimal = document.getElementById('adoption-animal-select');

        if (!modal || !form || !selectAnimal) return;

        form.reset();
        document.getElementById('adoption-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('adoption-folio').value = `CONTRATO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        // Animales disponibles o en evaluación
        const candidatos = window.DB.db.animales.filter(a => a.estado_actual !== 'adoptado');
        selectAnimal.innerHTML = candidatos.map(a => `
            <option value="${a.id}" ${preselectedAnimalId === a.id ? 'selected' : ''}>
                ${a.nombre} (${a.especie} - ${a.raza})
            </option>
        `).join('');

        modal.classList.add('active');
    },

    handleSaveAdoption() {
        const animalId = document.getElementById('adoption-animal-select').value;
        const nombreAdoptante = document.getElementById('adoption-adoptante-nombre').value.trim();
        const rutAdoptante = document.getElementById('adoption-adoptante-rut').value.trim();
        const telAdoptante = document.getElementById('adoption-adoptante-tel').value.trim();
        const emailAdoptante = document.getElementById('adoption-adoptante-email').value.trim();
        const dirAdoptante = document.getElementById('adoption-adoptante-dir').value.trim();
        const folio = document.getElementById('adoption-folio').value.trim();
        const observaciones = document.getElementById('adoption-observaciones').value.trim();

        if (!animalId || !nombreAdoptante || !telAdoptante) {
            alert('Por favor completa los campos obligatorios del adoptante (Nombre y Teléfono).');
            return;
        }

        // Crear o registrar adoptante
        const nuevoAdoptante = window.DB.saveAdoptante({
            rut: rutAdoptante,
            nombre: nombreAdoptante,
            telefono: telAdoptante,
            email: emailAdoptante,
            direccion: dirAdoptante,
            evaluacion_estado: 'aprobado'
        });

        // Registrar adopción y actualizar estado de la mascota
        window.DB.concretarAdopcion(animalId, nuevoAdoptante.id, folio, observaciones);

        document.getElementById('modal-adoption-form').classList.remove('active');
        this.render();
        AnimalsModule.render();

        const animal = window.DB.db.animales.find(a => a.id === animalId);
        window.App.showNotification(`🎉 ¡Adopción de ${animal ? animal.nombre : 'la mascota'} completada exitosamente!`);
    },

    openNewSeguimientoModal(adopcionId, animalId) {
        const modal = document.getElementById('modal-seguimiento-form');
        const form = document.getElementById('form-add-seguimiento');
        if (!modal || !form) return;

        form.reset();
        document.getElementById('seg-adopcion-id').value = adopcionId;
        document.getElementById('seg-animal-id').value = animalId;
        document.getElementById('seg-fecha').value = new Date().toISOString().split('T')[0];

        modal.classList.add('active');
    },

    handleSaveSeguimiento() {
        const adopcion_id = document.getElementById('seg-adopcion-id').value;
        const animal_id = document.getElementById('seg-animal-id').value;
        const fecha = document.getElementById('seg-fecha').value;
        const medio_contacto = document.getElementById('seg-medio').value;
        const estado_mascota = document.getElementById('seg-estado').value;
        const observaciones = document.getElementById('seg-observaciones').value.trim();

        if (!observaciones) {
            alert('Por favor escribe las notas del seguimiento realizado.');
            return;
        }

        window.DB.addSeguimiento({
            adopcion_id,
            animal_id,
            fecha,
            medio_contacto,
            estado_mascota,
            observaciones
        });

        document.getElementById('modal-seguimiento-form').classList.remove('active');
        this.render();
        window.App.showNotification('✅ Registro de seguimiento post-adopción guardado.');

        // Refrescar ficha si estaba visible
        if (document.getElementById('modal-ficha-integral').classList.contains('active')) {
            AnimalsModule.viewFicha(animal_id);
        }
    },

    // =========================================================================
    // CUESTIONARIO DIGITAL DE POSTULACIÓN A ADOPCIÓN (Alternativa B)
    // =========================================================================

    openCuestionarioModal(preselectedAnimalId = null) {
        const modal = document.getElementById('modal-cuestionario-form');
        const form = document.getElementById('form-cuestionario-adopcion');
        const selectAnimal = document.getElementById('quest-animal-select');

        if (!modal || !form) return;
        form.reset();

        if (selectAnimal) {
            const disponibles = window.DB.db.animales.filter(a => a.estado_actual !== 'adoptado');
            selectAnimal.innerHTML = `
                <option value="">-- Sin preferencia específica / Abierto a recomendación --</option>
                ${disponibles.map(a => `<option value="${a.id}" ${preselectedAnimalId === a.id ? 'selected' : ''}>${a.nombre} (${a.especie} - ${a.raza})</option>`).join('')}
            `;
        }

        modal.classList.add('active');
    },

    handleProcessCuestionario() {
        const nombre = document.getElementById('quest-nombre').value.trim();
        const rut = document.getElementById('quest-rut').value.trim();
        const tel = document.getElementById('quest-tel').value.trim();
        const email = document.getElementById('quest-email').value.trim();
        const dir = document.getElementById('quest-dir').value.trim();
        const vivienda = document.getElementById('quest-vivienda').value;
        const propiedad = document.getElementById('quest-propiedad').value;
        const tiempo = document.getElementById('quest-tiempo').value;
        const consenso = document.getElementById('quest-consenso').value;
        const solvencia = document.getElementById('quest-solvencia').value;
        const animalId = document.getElementById('quest-animal-select').value;

        // Evaluación automática basada en parámetros de tenencia responsable
        let puntaje = 0;
        if (vivienda === 'casa_patio' || vivienda === 'dpto_mallas') puntaje += 25;
        if (propiedad === 'propio' || propiedad === 'arriendo_permite') puntaje += 20;
        if (tiempo === '0-4') puntaje += 20; else if (tiempo === '4-8') puntaje += 15;
        if (consenso === 'si') puntaje += 20;
        if (solvencia === 'pleno') puntaje += 15;

        let evaluacion_estado = 'aprobado';
        let feedbackMensaje = '';

        if (puntaje >= 80) {
            evaluacion_estado = 'aprobado';
            feedbackMensaje = `🌟 ¡Postulación APROBADA con ${puntaje}/100 puntos! El perfil cumple con todas las condiciones de tenencia responsable.`;
        } else if (puntaje >= 60) {
            evaluacion_estado = 'requiere_entrevista';
            feedbackMensaje = `⚠️ Postulación PENDIENTE DE ENTREVISTA (${puntaje}/100 puntos). Requiere verificar malla de seguridad o acuerdo familiar.`;
        } else {
            evaluacion_estado = 'no_recomendado';
            feedbackMensaje = `❌ Postulación con OBSERVACIONES (${puntaje}/100 puntos). Horas a solas o restricciones de arriendo desfavorables.`;
        }

        // Guardar adoptante evaluado
        const adoptante = window.DB.saveAdoptante({
            rut,
            nombre,
            telefono: tel,
            email,
            direccion: dir,
            evaluacion_estado,
            notas: `Puntaje: ${puntaje}/100. Vivienda: ${vivienda}, Tiempo a solas: ${tiempo}h. Consenso familiar: ${consenso}.`
        });

        // Guardar cuestionario completo en la base de datos (RF-07)
        const nuevoCuestionario = window.DB.saveCuestionario({
            animal_id: animalId || null,
            nombre_postulante: nombre,
            rut,
            telefono: tel,
            email,
            direccion: dir,
            tipo_vivienda: vivienda,
            tiene_patio_cerrado: vivienda === 'casa_patio' || vivienda === 'dpto_mallas',
            acuerdo_familia: consenso === 'si',
            presupuesto_veterinario: solvencia === 'pleno',
            experiencia_previa: `Propiedad: ${propiedad}. Tiempo solo: ${tiempo}h.`,
            motivo_adopcion: `Evaluación Ley 21.020. Vacaciones: ${document.getElementById('quest-vacaciones')?.value || 'Familiar'}`,
            estado_evaluacion,
            puntaje,
            notas_evaluacion: feedbackMensaje,
            fecha_postulacion: new Date().toISOString().split('T')[0]
        });

        document.getElementById('modal-cuestionario-form').classList.remove('active');
        this.render();
        alert(`${feedbackMensaje}\n\nEl postulante ${nombre} ha sido registrado exitosamente.`);
        window.App.showNotification(`Cuestionario procesado: ${nombre} (${evaluacion_estado})`);

        // Si fue aprobado y seleccionó un animal, ofrecer formalizar de inmediato
        if (evaluacion_estado === 'aprobado' && animalId) {
            if (confirm('¿Deseas formalizar la adopción de la mascota seleccionada con este postulante ahora?')) {
                this.convertirPostulanteAAdopcion(nuevoCuestionario.id, animalId);
            }
        }
    },

    convertirPostulanteAAdopcion(cuestionarioId, animalId = null) {
        const c = window.DB.getCuestionarioById(cuestionarioId);
        if (!c) return;

        const targetAnimalId = animalId || c.animal_id;
        if (targetAnimalId) {
            const anim = window.DB.db.animales.find(a => a.id === targetAnimalId);
            if (anim && anim.estado_actual === 'adoptado') {
                alert(`"${anim.nombre}" ya tiene un proceso de adopción formalizado.`);
                return;
            }
        }

        // Si la ficha integral estaba abierta, cerrarla para mostrar el modal de adopción
        const modalFicha = document.getElementById('modal-ficha-integral');
        if (modalFicha) modalFicha.classList.remove('active');

        this.openAdoptionModal(targetAnimalId);
        document.getElementById('adoption-adoptante-nombre').value = c.nombre_postulante;
        document.getElementById('adoption-adoptante-rut').value = c.rut || '';
        document.getElementById('adoption-adoptante-tel').value = c.telefono;
        document.getElementById('adoption-adoptante-email').value = c.email || '';
        document.getElementById('adoption-adoptante-dir').value = c.direccion;
        document.getElementById('adoption-observaciones').value = `Postulación evaluada y aprobada mediante Cuestionario Digital Ley 21.020 (Folio ${c.id}, ${c.puntaje || 85} pts).`;
    },

    verDetalleCuestionario(cuestionarioId) {
        const c = window.DB.getCuestionarioById(cuestionarioId);
        if (!c) return;
        const animal = window.DB.db.animales.find(a => a.id === c.animal_id);
        const detalle = `📋 DETALLE DE EVALUACIÓN SOCIO-AMBIENTAL (Ley 21.020)\n` +
            `===================================================\n` +
            `• Postulante: ${c.nombre_postulante} (RUT: ${c.rut || 'No registrado'})\n` +
            `• Teléfono: ${c.telefono} | Correo: ${c.email || 'No indicado'}\n` +
            `• Domicilio: ${c.direccion}\n` +
            `• Mascota postulada: ${animal ? `${animal.nombre} (${animal.especie} - ${animal.raza})` : 'Abierto a recomendación'}\n\n` +
            `DIMENSIONES EVALUADAS:\n` +
            `1. Tipo de Vivienda: ${c.tipo_vivienda}\n` +
            `2. Patio Seguro / Mallas: ${c.tiene_patio_cerrado ? 'Sí, verificado' : 'No cuenta'}\n` +
            `3. Acuerdo Familiar: ${c.acuerdo_familia ? 'Total acuerdo de los integrantes' : 'Parcial o en duda'}\n` +
            `4. Solvencia Veterinaria: ${c.presupuesto_veterinario ? 'Cuenta con presupuesto mensual y fondo de emergencias' : 'Básico'}\n` +
            `5. Experiencia / Notas: ${c.experiencia_previa || '-'}\n\n` +
            `DICTAMEN DE LA FUNDACIÓN:\n` +
            `• Estado: ${c.estado_evaluacion.toUpperCase()}\n` +
            `• Puntaje Tenencia Responsable: ${c.puntaje || 0}/100\n` +
            `• Observaciones: ${c.notas_evaluacion || 'Sin observaciones adicionales.'}`;
        alert(detalle);
    }
};

window.AdoptionsModule = AdoptionsModule;
