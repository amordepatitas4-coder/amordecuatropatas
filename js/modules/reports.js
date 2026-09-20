/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/reports.js
 * DESCRIPCIÓN: Módulo de Informes, Métricas y Estadísticas (RF-11).
 * 
 * Funcionalidades:
 * 1. Indicadores clave (KPIs): Rescatados totales, Tasa de adopción,
 *    Animales en hogares de paso, Animales en recuperación, Costo total.
 * 2. Distribución visual de animales por estado actual.
 * 3. Desglose financiero por categorías de gasto.
 * 4. Exportación del informe ejecutivo en formato imprimible.
 * ==============================================================================
 */

const ReportsModule = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        ['report-filter-from', 'report-filter-to', 'report-filter-status', 'report-filter-category'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.renderFilteredReport());
        });
        document.getElementById('btn-clear-report-filters')?.addEventListener('click', () => {
            ['report-filter-from', 'report-filter-to'].forEach(id => { document.getElementById(id).value = ''; });
            document.getElementById('report-filter-status').value = 'todos';
            document.getElementById('report-filter-category').value = 'todas';
            this.renderFilteredReport();
        });
    },

    render() {
        const stats = window.DB.getEstadisticasGenerales();

        // Actualizar KPIs del Dashboard
        this.setElementText('kpi-total-rescatados', stats.totalRescatados);
        this.setElementText('kpi-en-adopcion', stats.enAdopcion);
        this.setElementText('kpi-adoptados', stats.adoptados);
        this.setElementText('kpi-tasa-adopcion', `${stats.tasaAdopcionPorcentaje}%`);
        this.setElementText('kpi-en-hogar', stats.enHogarTemporal);
        this.setElementText('kpi-en-salud', stats.enCuarentenaTratamiento);
        this.setElementText('kpi-total-gastos', `$${stats.totalGastos.toLocaleString('es-CL')}`);

        // Renderizar desglose de gastos
        const containerGastos = document.getElementById('report-gastos-breakdown');
        if (containerGastos) {
            const items = Object.entries(stats.gastosPorCategoria);
            if (items.length === 0) {
                containerGastos.innerHTML = '<p class="text-muted">Sin gastos registrados.</p>';
            } else {
                containerGastos.innerHTML = items.map(([cat, total]) => {
                    const pct = stats.totalGastos > 0 ? Math.round((total / stats.totalGastos) * 100) : 0;
                    return `
                        <div class="report-bar-item">
                            <div class="report-bar-label">
                                <span>${ExpensesModule.formatCategoria(cat)}</span>
                                <strong>$${total.toLocaleString('es-CL')} (${pct}%)</strong>
                            </div>
                            <div class="progress-bar-wrap">
                                <div class="progress-bar-fill" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        this.renderFilteredReport();
    },

    renderFilteredReport() {
        const from = document.getElementById('report-filter-from')?.value || '';
        const to = document.getElementById('report-filter-to')?.value || '';
        const status = document.getElementById('report-filter-status')?.value || 'todos';
        const category = document.getElementById('report-filter-category')?.value || 'todas';
        const inRange = date => (!from || date >= from) && (!to || date <= to);
        const animals = window.DB.db.animales.filter(a => inRange(a.fecha_ingreso) && (status === 'todos' || a.estado_actual === status));
        const expenses = window.DB.db.gastos.filter(g => inRange(g.fecha) && (category === 'todas' || g.categoria === category));
        const total = expenses.reduce((sum, item) => sum + Number(item.monto), 0);

        this.setElementText('report-filtered-animals', animals.length);
        this.setElementText('report-filtered-status-label', status === 'todos' ? 'Todos los estados' : `Estado: ${status.replace('_', ' ')}`);
        this.setElementText('report-filtered-expenses', `$${total.toLocaleString('es-CL')}`);
        this.setElementText('report-filtered-expenses-count', `${expenses.length} registro(s)`);

        const body = document.getElementById('report-expenses-body');
        if (body) {
            body.innerHTML = expenses.length ? expenses
                .slice().sort((a, b) => b.fecha.localeCompare(a.fecha))
                .map(g => `<tr><td>${g.fecha}</td><td>${g.concepto}</td><td>${ExpensesModule.formatCategoria(g.categoria)}</td><td><strong>$${Number(g.monto).toLocaleString('es-CL')}</strong></td></tr>`)
                .join('') : '<tr><td colspan="4" class="text-center">Sin registros para los filtros seleccionados.</td></tr>';
        }
    },

    setElementText(id, text) {
        document.querySelectorAll(`#${id}`).forEach(el => { el.textContent = text; });
    },

    printReport() {
        window.print();
    }
};

window.ReportsModule = ReportsModule;
