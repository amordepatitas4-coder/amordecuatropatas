/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/esterilizaciones.js
 * DESCRIPCIÓN: Módulo de Gestión de Proyectos de Esterilización Masiva
 *              (Área Funcional 2 — Ficha Técnica Oficial §5)
 * ==============================================================================
 */

window.EsterilizacionesModule = {
    currentFilterEstado: 'todos',
    currentSearch: '',
    selectedProyectoId: null,

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Filtro por estado
        const filtroEstado = document.getElementById('filtro-esterilizaciones-estado');
        if (filtroEstado) {
            filtroEstado.addEventListener('change', (e) => {
                this.currentFilterEstado = e.target.value;
                this.renderProyectos();
            });
        }

        // Búsqueda por texto
        const busqueda = document.getElementById('buscar-esterilizaciones');
        if (busqueda) {
            busqueda.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase().trim();
                this.renderProyectos();
            });
        }

        // Formulario de creación/edición de Proyecto
        const formProyecto = document.getElementById('form-proyecto-esterilizacion');
        if (formProyecto) {
            formProyecto.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarProyecto();
            });
        }

        // Formulario de paciente en modo terreno
        const formPaciente = document.getElementById('form-paciente-esterilizacion');
        if (formPaciente) {
            formPaciente.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarPaciente();
            });
        }
    },

    render() {
        this.renderEstadisticas();
        this.renderProyectos();
    },

    renderEstadisticas() {
        const stats = window.DB.getEstadisticasEsterilizacion();
        
        const kpiOperativos = document.getElementById('kpi-est-total-operativos');
        const kpiAnimales = document.getElementById('kpi-est-total-animales');
        const kpiCaninos = document.getElementById('kpi-est-caninos');
        const kpiFelinos = document.getElementById('kpi-est-felinos');
        const kpiMicrochip = document.getElementById('kpi-est-microchips');
        const kpiCumplimiento = document.getElementById('kpi-est-cumplimiento');

        if (kpiOperativos) kpiOperativos.textContent = stats.totalOperativos;
        if (kpiAnimales) kpiAnimales.textContent = stats.totalAnimales;
        if (kpiCaninos) kpiCaninos.textContent = `${stats.totalCaninos} caninos`;
        if (kpiFelinos) kpiFelinos.textContent = `${stats.totalFelinos} felinos`;
        if (kpiMicrochip) kpiMicrochip.textContent = stats.totalConMicrochip;
        if (kpiCumplimiento) kpiCumplimiento.textContent = `${stats.porcentajeCumplimiento}%`;
    },

    renderProyectos() {
        const contenedor = document.getElementById('grid-proyectos-esterilizacion');
        if (!contenedor) return;

        let proyectos = window.DB.getProyectosEsterilizacion();

        // Filtrar por estado
        if (this.currentFilterEstado !== 'todos') {
            proyectos = proyectos.filter(p => p.estado.toLowerCase() === this.currentFilterEstado.toLowerCase());
        }

        // Filtrar por búsqueda
        if (this.currentSearch) {
            proyectos = proyectos.filter(p => 
                p.nombre.toLowerCase().includes(this.currentSearch) ||
                (p.sector && p.sector.toLowerCase().includes(this.currentSearch)) ||
                (p.veterinario_responsable && p.veterinario_responsable.toLowerCase().includes(this.currentSearch))
            );
        }

        if (proyectos.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-state-card" style="grid-column: 1 / -1; padding: 3rem; text-align: center; background: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✂️</div>
                    <h3 style="margin-bottom: 0.5rem;">No se encontraron operativos</h3>
                    <p style="color: var(--color-text-secondary); max-width: 450px; margin: 0 auto 1.5rem auto;">
                        No existen campañas que coincidan con el filtro actual o aún no se han registrado operativos comunitarios.
                    </p>
                    <button class="btn btn-primary" onclick="EsterilizacionesModule.abrirModalProyecto()">
                        ➕ Planificar Nuevo Operativo
                    </button>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = proyectos.map(p => {
            const pacientes = window.DB.getAnimalesEsterilizacion(p.id);
            const totalIntervenidos = pacientes.length;
            const meta = Number(p.meta_animales) || 0;
            const porcentaje = meta > 0 ? Math.min(100, Math.round((totalIntervenidos / meta) * 100)) : 0;
            
            let badgeClase = 'badge-primary';
            if (p.estado === 'Finalizado') badgeClase = 'badge-success';
            if (p.estado === 'En Ejecución') badgeClase = 'badge-warning';

            return `
                <div class="card card-operativo" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid var(--color-accent);">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                            <span class="badge ${badgeClase}" style="font-size: 0.8rem; padding: 0.35rem 0.75rem; text-transform: uppercase;">
                                ${p.estado}
                            </span>
                            <span style="font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 500;">
                                📅 ${p.fecha_inicio} ${p.fecha_fin ? 'al ' + p.fecha_fin : ''}
                            </span>
                        </div>

                        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-primary);">
                            ${p.nombre}
                        </h3>

                        <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                            <span>📍</span> <span>${p.sector || 'Sector no especificado'}</span>
                        </div>

                        <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                            <strong>🩺 Veterinario:</strong> ${p.veterinario_responsable || 'Por definir'}
                        </div>

                        ${p.entidad_financiamiento ? `
                        <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                            <strong>🏛️ Financiamiento:</strong> ${p.entidad_financiamiento}
                        </div>
                        ` : ''}

                        <!-- Barra de Avance de Meta -->
                        <div style="background: rgba(0,0,0,0.04); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem; font-weight: 600;">
                                <span>Avance del Operativo</span>
                                <span style="color: var(--color-accent);">${totalIntervenidos} / ${meta} animales (${porcentaje}%)</span>
                            </div>
                            <div style="background: #e2e8f0; height: 8px; border-radius: 999px; overflow: hidden;">
                                <div style="background: var(--color-accent); width: ${porcentaje}%; height: 100%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>

                        ${p.notas ? `
                        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem; font-style: italic;">
                            "${p.notas}"
                        </p>
                        ` : ''}
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid var(--color-border); padding-top: 1rem;">
                        <button class="btn btn-primary btn-sm full-width" onclick="EsterilizacionesModule.abrirDetalleOperativo('${p.id}')">
                            📋 Ver Nómina y Modo Terreno (${totalIntervenidos})
                        </button>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="EsterilizacionesModule.abrirModalProyecto('${p.id}')">
                                ✏️ Editar
                            </button>
                            ${p.drive_folder_url ? `
                            <a href="${p.drive_folder_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center; text-decoration: none;">
                                📁 Drive
                            </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    abrirModalProyecto(id = null) {
        const modal = document.getElementById('modal-proyecto-esterilizacion');
        const form = document.getElementById('form-proyecto-esterilizacion');
        const titulo = document.getElementById('modal-proyecto-esterilizacion-titulo');
        if (!modal || !form) return;

        form.reset();

        if (id) {
            const p = window.DB.getProyectoEsterilizacionById(id);
            if (p) {
                titulo.textContent = 'Editar Operativo de Esterilización';
                document.getElementById('proy-est-id').value = p.id;
                document.getElementById('proy-est-nombre').value = p.nombre || '';
                document.getElementById('proy-est-sector').value = p.sector || '';
                document.getElementById('proy-est-fecha-inicio').value = p.fecha_inicio || '';
                document.getElementById('proy-est-fecha-fin').value = p.fecha_fin || '';
                document.getElementById('proy-est-veterinario').value = p.veterinario_responsable || '';
                document.getElementById('proy-est-financiamiento').value = p.entidad_financiamiento || '';
                document.getElementById('proy-est-meta').value = p.meta_animales || 30;
                document.getElementById('proy-est-estado').value = p.estado || 'Planificado';
                document.getElementById('proy-est-drive').value = p.drive_folder_url || '';
                document.getElementById('proy-est-notas').value = p.notas || '';
            }
        } else {
            titulo.textContent = 'Nuevo Operativo de Esterilización Masiva';
            document.getElementById('proy-est-id').value = '';
            document.getElementById('proy-est-meta').value = 30;
            document.getElementById('proy-est-fecha-inicio').value = new Date().toISOString().split('T')[0];
            document.getElementById('proy-est-estado').value = 'Planificado';
        }

        modal.classList.add('active');
    },

    guardarProyecto() {
        const id = document.getElementById('proy-est-id').value;
        const nombre = document.getElementById('proy-est-nombre').value.trim();
        const sector = document.getElementById('proy-est-sector').value.trim();
        const fechaInicio = document.getElementById('proy-est-fecha-inicio').value;
        const fechaFin = document.getElementById('proy-est-fecha-fin').value;
        const veterinario = document.getElementById('proy-est-veterinario').value.trim();
        const financiamiento = document.getElementById('proy-est-financiamiento').value.trim();
        const meta = document.getElementById('proy-est-meta').value;
        const estado = document.getElementById('proy-est-estado').value;
        const drive = document.getElementById('proy-est-drive').value.trim();
        const notas = document.getElementById('proy-est-notas').value.trim();

        if (!nombre || !fechaInicio) {
            alert('Por favor complete el nombre y la fecha de inicio del operativo.');
            return;
        }

        window.DB.saveProyectoEsterilizacion({
            id: id || undefined,
            nombre,
            sector,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            veterinario_responsable: veterinario,
            entidad_financiamiento: financiamiento,
            meta_animales: meta,
            estado,
            drive_folder_url: drive,
            notas
        });

        document.getElementById('modal-proyecto-esterilizacion').classList.remove('active');
        this.render();
        if (window.App && window.App.showToast) {
            window.App.showToast('Operativo guardado correctamente');
        }
    },

    abrirDetalleOperativo(proyectoId) {
        this.selectedProyectoId = proyectoId;
        const p = window.DB.getProyectoEsterilizacionById(proyectoId);
        if (!p) return;

        const modal = document.getElementById('modal-detalle-operativo');
        if (!modal) return;

        document.getElementById('detalle-op-nombre').textContent = p.nombre;
        document.getElementById('detalle-op-sector').textContent = p.sector || 'Sector no informado';
        document.getElementById('detalle-op-veterinario').textContent = p.veterinario_responsable || 'No asignado';
        document.getElementById('detalle-op-fechas').textContent = `${p.fecha_inicio} al ${p.fecha_fin || p.fecha_inicio}`;
        
        // Reset form paciente
        const formPaciente = document.getElementById('form-paciente-esterilizacion');
        if (formPaciente) {
            formPaciente.reset();
            document.getElementById('pac-est-id').value = '';
            document.getElementById('pac-est-fecha').value = new Date().toISOString().split('T')[0];
        }

        this.renderTablaPacientes();
        modal.classList.add('active');
    },

    renderTablaPacientes() {
        if (!this.selectedProyectoId) return;
        const tbody = document.getElementById('tabla-pacientes-operativo-body');
        const contadorElem = document.getElementById('detalle-op-total-pacientes');
        if (!tbody) return;

        const pacientes = window.DB.getAnimalesEsterilizacion(this.selectedProyectoId);
        if (contadorElem) contadorElem.textContent = `${pacientes.length} pacientes registrados`;

        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                        Aún no se registran pacientes para este operativo. Utilice el formulario superior de ingreso rápido.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pacientes.map(pac => {
            const especieIcono = pac.especie === 'Canino' ? '🐶' : '🐱';
            const sexoIcono = pac.sexo === 'Macho' ? '♂️' : '♀️';
            
            let badgeDestino = 'badge-success';
            if (pac.estado_post === 'En observación temporal') badgeDestino = 'badge-warning';
            if (pac.estado_post === 'Derivado a rescate') badgeDestino = 'badge-danger';

            return `
                <tr>
                    <td style="font-weight: 700; font-family: monospace;">${pac.codigo_operativo}</td>
                    <td>
                        <span style="font-weight: 600;">${especieIcono} ${pac.especie}</span>
                        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${sexoIcono} ${pac.sexo}</div>
                    </td>
                    <td>
                        <div style="font-weight: 500;">${pac.descripcion_color || 'Sin descripción'}</div>
                    </td>
                    <td>
                        <div>${pac.tutor_vecino || 'Comunitario / Sin tutor'}</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${pac.telefono_contacto || ''}</div>
                    </td>
                    <td>
                        <span style="font-family: monospace; font-size: 0.85rem;">
                            ${pac.microchip ? '🏷️ ' + pac.microchip : '<span style="color: #94a3b8;">Sin chip</span>'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${badgeDestino}" style="font-size: 0.75rem;">
                            ${pac.estado_post}
                        </span>
                    </td>
                    <td style="text-align: right;">
                        <button class="btn btn-secondary btn-sm" onclick="EsterilizacionesModule.editarPaciente('${pac.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="EsterilizacionesModule.eliminarPaciente('${pac.id}')" title="Eliminar">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    guardarPaciente() {
        if (!this.selectedProyectoId) return;

        const id = document.getElementById('pac-est-id').value;
        const especie = document.getElementById('pac-est-especie').value;
        const sexo = document.getElementById('pac-est-sexo').value;
        const descripcion = document.getElementById('pac-est-descripcion').value.trim();
        const tutor = document.getElementById('pac-est-tutor').value.trim();
        const telefono = document.getElementById('pac-est-telefono').value.trim();
        const microchip = document.getElementById('pac-est-microchip').value.trim();
        const fecha = document.getElementById('pac-est-fecha').value;
        const estadoPost = document.getElementById('pac-est-estado-post').value;
        const observaciones = document.getElementById('pac-est-observaciones').value.trim();

        window.DB.saveAnimalEsterilizacion({
            id: id || undefined,
            proyecto_id: this.selectedProyectoId,
            especie,
            sexo,
            descripcion_color: descripcion,
            tutor_vecino: tutor,
            telefono_contacto: telefono,
            microchip,
            fecha_intervencion: fecha,
            estado_post: estadoPost,
            observaciones
        });

        // Resetear formulario para siguiente paciente ágil
        const form = document.getElementById('form-paciente-esterilizacion');
        form.reset();
        document.getElementById('pac-est-id').value = '';
        document.getElementById('pac-est-fecha').value = new Date().toISOString().split('T')[0];

        this.renderTablaPacientes();
        this.renderEstadisticas();
        this.renderProyectos();

        if (window.App && window.App.showToast) {
            window.App.showToast('Paciente guardado en la nómina');
        }
    },

    editarPaciente(pacienteId) {
        const pac = window.DB.getAnimalEsterilizacionById(pacienteId);
        if (!pac) return;

        document.getElementById('pac-est-id').value = pac.id;
        document.getElementById('pac-est-especie').value = pac.especie;
        document.getElementById('pac-est-sexo').value = pac.sexo;
        document.getElementById('pac-est-descripcion').value = pac.descripcion_color || '';
        document.getElementById('pac-est-tutor').value = pac.tutor_vecino || '';
        document.getElementById('pac-est-telefono').value = pac.telefono_contacto || '';
        document.getElementById('pac-est-microchip').value = pac.microchip || '';
        document.getElementById('pac-est-fecha').value = pac.fecha_intervencion || '';
        document.getElementById('pac-est-estado-post').value = pac.estado_post || 'Retornado a su sector';
        document.getElementById('pac-est-observaciones').value = pac.observaciones || '';

        document.getElementById('form-paciente-esterilizacion').scrollIntoView({ behavior: 'smooth' });
    },

    eliminarPaciente(pacienteId) {
        if (confirm('¿Está seguro de eliminar este registro de paciente del operativo?')) {
            window.DB.deleteAnimalEsterilizacion(pacienteId);
            this.renderTablaPacientes();
            this.renderEstadisticas();
            this.renderProyectos();
            if (window.App && window.App.showToast) {
                window.App.showToast('Registro de paciente eliminado');
            }
        }
    },

    exportarNominaCSV() {
        if (!this.selectedProyectoId) return;
        const p = window.DB.getProyectoEsterilizacionById(this.selectedProyectoId);
        const pacientes = window.DB.getAnimalesEsterilizacion(this.selectedProyectoId);

        let csv = '\uFEFF'; // BOM para soporte UTF-8 en Excel
        csv += `NÓMINA DE OPERATIVO DE ESTERILIZACIÓN MASIVA\r\n`;
        csv += `Proyecto: "${p ? p.nombre : ''}"\r\n`;
        csv += `Sector: "${p ? p.sector : ''}"\r\n`;
        csv += `Veterinario: "${p ? p.veterinario_responsable : ''}"\r\n\r\n`;
        csv += `Código,Especie,Sexo,Descripción,Tutor / Vecino Responsable,Teléfono,Microchip Ley 21.020,Fecha Intervención,Destino Post-Operatorio,Observaciones Clínicas\r\n`;

        pacientes.forEach(pac => {
            csv += `"${pac.codigo_operativo}","${pac.especie}","${pac.sexo}","${pac.descripcion_color || ''}","${pac.tutor_vecino || ''}","${pac.telefono_contacto || ''}","${pac.microchip || ''}","${pac.fecha_intervencion}","${pac.estado_post}","${pac.observaciones || ''}"\r\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `nomina_esterilizacion_${p ? p.nombre.replace(/[^a-zA-Z0-9]/g, '_') : 'operativo'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
