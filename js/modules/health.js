/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/health.js
 * DESCRIPCIÓN: Módulo de Historial Sanitario y Controles Clínicos (RF-04).
 * 
 * Funcionalidades:
 * 1. Registro de atenciones veterinarias individuales (Desparasitaciones, Vacunas,
 *    Esterilizaciones, Tratamientos y Controles periódicos).
 * 2. Visualización general de atenciones realizadas en la Fundación.
 * 3. Alertas de próximos controles sanitarios.
 * ==============================================================================
 */

const HealthModule = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Formulario de nueva atención médica
        const formHealth = document.getElementById('form-add-health');
        if (formHealth) {
            formHealth.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveHealth();
            });
        }

        // Botón superior para agregar control médico
        const btnNewHealth = document.getElementById('btn-new-health-global');
        if (btnNewHealth) {
            btnNewHealth.addEventListener('click', () => {
                this.openAddHealthModal();
            });
        }
    },

    render() {
        const container = document.getElementById('health-table-body');
        if (!container) return;

        const atenciones = window.DB.db.historial_sanitario.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        if (atenciones.length === 0) {
            container.innerHTML = `<tr><td colspan="6" class="text-center">No hay atenciones sanitarias registradas.</td></tr>`;
            return;
        }

        container.innerHTML = atenciones.map(atn => {
            const animal = window.DB.db.animales.find(a => a.id === atn.animal_id);
            const nombreAnimal = animal ? animal.nombre : 'Animal no encontrado';

            return `
                <tr>
                    <td><strong>${atn.fecha}</strong></td>
                    <td>
                        <span class="animal-link" onclick="AnimalsModule.viewFicha('${atn.animal_id}')">
                            🐾 ${nombreAnimal}
                        </span>
                    </td>
                    <td><span class="badge-tag">${atn.tipo_evento}</span></td>
                    <td>${atn.descripcion}</td>
                    <td>${atn.veterinario || 'Sin especificar'}</td>
                    <td>${atn.proximo_control ? `🔔 ${atn.proximo_control}` : '-'}</td>
                </tr>
            `;
        }).join('');
    },

    openAddHealthModal(preselectedAnimalId = null) {
        const modal = document.getElementById('modal-health-form');
        const form = document.getElementById('form-add-health');
        const selectAnimal = document.getElementById('health-form-animal-select');

        if (!modal || !form || !selectAnimal) return;

        form.reset();
        document.getElementById('health-form-fecha').value = new Date().toISOString().split('T')[0];

        // Rellenar opciones de animales activos
        selectAnimal.innerHTML = window.DB.db.animales.map(a => `
            <option value="${a.id}" ${preselectedAnimalId === a.id ? 'selected' : ''}>
                ${a.nombre} (${a.especie} - ${a.raza})
            </option>
        `).join('');

        modal.classList.add('active');
    },

    handleSaveHealth() {
        const animal_id = document.getElementById('health-form-animal-select').value;
        const tipo_evento = document.getElementById('health-form-tipo').value;
        const fecha = document.getElementById('health-form-fecha').value;
        const veterinario = document.getElementById('health-form-vet').value.trim();
        const proximo_control = document.getElementById('health-form-proximo').value;
        const descripcion = document.getElementById('health-form-desc').value.trim();

        if (!animal_id || !descripcion) {
            alert('Por favor selecciona el animal e ingresa la descripción de la atención.');
            return;
        }

        window.DB.addHistorialSanitario({
            animal_id,
            tipo_evento,
            fecha,
            veterinario,
            proximo_control: proximo_control || null,
            descripcion
        });

        document.getElementById('modal-health-form').classList.remove('active');
        this.render();

        // Si la ficha integral está abierta, refrescarla
        const animal = window.DB.db.animales.find(a => a.id === animal_id);
        window.App.showNotification(`Atención médica registrada para ${animal ? animal.nombre : 'el animal'}.`);
        if (animal) AnimalsModule.viewFicha(animal_id);
    }
};

window.HealthModule = HealthModule;
