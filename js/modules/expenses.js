/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/expenses.js
 * DESCRIPCIÓN: Módulo de Gestión de Gastos y Finanzas (RF-09).
 * 
 * Permite registrar y clasificar:
 * 1. Gastos asociados a un animal individual (ej. urgencia, cirugía).
 * 2. Gastos prorrateados entre varios animales (ej. sacos de alimento).
 * 3. Gastos generales de administración de la Fundación (ej. insumos).
 * ==============================================================================
 */

const ExpensesModule = {
    filtroCategoria: 'todas',
    filtroDesde: '',
    filtroHasta: '',
    filtroAnimal: 'todos',

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Filtro por categoría
        const selectFilter = document.getElementById('expense-filter-categoria');
        if (selectFilter) {
            selectFilter.addEventListener('change', (e) => {
                this.filtroCategoria = e.target.value;
                this.render();
            });
        }

        ['expense-filter-from', 'expense-filter-to', 'expense-filter-animal'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                this.filtroDesde = document.getElementById('expense-filter-from').value;
                this.filtroHasta = document.getElementById('expense-filter-to').value;
                this.filtroAnimal = document.getElementById('expense-filter-animal').value;
                this.render();
            });
        });

        // Modal nuevo gasto
        const btnNewGasto = document.getElementById('btn-new-expense');
        if (btnNewGasto) {
            btnNewGasto.addEventListener('click', () => {
                this.openNewExpenseModal();
            });
        }

        // Formulario nuevo gasto
        const formGasto = document.getElementById('form-save-expense');
        if (formGasto) {
            formGasto.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveExpense();
            });
        }

        // Tipo de asignación dinámico
        const selectTipoAsig = document.getElementById('expense-form-tipo-asig');
        if (selectTipoAsig) {
            selectTipoAsig.addEventListener('change', (e) => {
                const groupAnimals = document.getElementById('expense-animals-group');
                if (groupAnimals) {
                    groupAnimals.style.display = e.target.value === 'general_fundacion' ? 'none' : 'block';
                }
            });
        }
    },

    render() {
        const tbody = document.getElementById('expenses-table-body');
        const totalSpan = document.getElementById('expenses-total-amount');
        if (!tbody) return;

        const animalFilter = document.getElementById('expense-filter-animal');
        if (animalFilter && animalFilter.options.length <= 1) {
            animalFilter.insertAdjacentHTML('beforeend', window.DB.db.animales
                .map(a => `<option value="${a.id}">${a.nombre}</option>`).join(''));
        }

        const gastos = window.DB.getGastos(this.filtroCategoria)
            .filter(g => !this.filtroDesde || g.fecha >= this.filtroDesde)
            .filter(g => !this.filtroHasta || g.fecha <= this.filtroHasta)
            .filter(g => this.filtroAnimal === 'todos' || (g.animales_ids || []).includes(this.filtroAnimal))
            .slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const totalMonto = gastos.reduce((sum, g) => sum + Number(g.monto), 0);
        if (totalSpan) {
            totalSpan.textContent = `$${totalMonto.toLocaleString('es-CL')}`;
        }

        if (gastos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay gastos registrados en esta categoría.</td></tr>`;
            return;
        }

        tbody.innerHTML = gastos.map(g => {
            let asignadoTexto = 'Gasto General';
            if (g.tipo_asignacion === 'animal_unico' && g.animales_ids.length > 0) {
                const a = window.DB.db.animales.find(anim => anim.id === g.animales_ids[0]);
                asignadoTexto = a ? `🐾 ${a.nombre}` : 'Animal individual';
            } else if (g.tipo_asignacion === 'multiples_animales') {
                asignadoTexto = `👥 ${g.animales_ids.length} animales vinculados`;
            }

            return `
                <tr>
                    <td><strong>${g.fecha}</strong></td>
                    <td>${g.concepto}</td>
                    <td><span class="badge-tag">${this.formatCategoria(g.categoria)}</span></td>
                    <td>${asignadoTexto}</td>
                    <td><strong class="text-accent">$${Number(g.monto).toLocaleString('es-CL')}</strong></td>
                    <td>
                        ${g.comprobante_url ? `<a href="${g.comprobante_url}" target="_blank" class="table-link">📄 Boleta</a>` : '<span class="text-muted">-</span>'}
                    </td>
                </tr>
            `;
        }).join('');
    },

    formatCategoria(cat) {
        const map = {
            'veterinaria': 'Atención Veterinaria',
            'alimento': 'Alimento',
            'medicamentos': 'Medicamentos',
            'transporte': 'Transporte / Traslados',
            'insumos_generales': 'Insumos Generales'
        };
        return map[cat] || cat;
    },

    openNewExpenseModal() {
        const modal = document.getElementById('modal-expense-form');
        const form = document.getElementById('form-save-expense');
        const selectAnimals = document.getElementById('expense-form-animals');

        if (!modal || !form || !selectAnimals) return;

        form.reset();
        document.getElementById('expense-form-fecha').value = new Date().toISOString().split('T')[0];

        // Llenar select múltiple de animales
        selectAnimals.innerHTML = window.DB.db.animales.map(a => `
            <option value="${a.id}">${a.nombre} (${a.especie})</option>
        `).join('');

        modal.classList.add('active');
    },

    handleSaveExpense() {
        const fecha = document.getElementById('expense-form-fecha').value;
        const concepto = document.getElementById('expense-form-concepto').value.trim();
        const categoria = document.getElementById('expense-form-categoria').value;
        const monto = parseFloat(document.getElementById('expense-form-monto').value) || 0;
        const tipo_asignacion = document.getElementById('expense-form-tipo-asig').value;
        const comprobante_url = document.getElementById('expense-form-comprobante').value.trim();

        const selectAnimals = document.getElementById('expense-form-animals');
        const animales_ids = Array.from(selectAnimals.selectedOptions).map(opt => opt.value);

        if (!concepto || monto <= 0) {
            alert('Por favor indica un concepto válido y un monto mayor a cero.');
            return;
        }

        window.DB.addGasto({
            fecha,
            concepto,
            categoria,
            monto,
            tipo_asignacion,
            animales_ids: tipo_asignacion === 'general_fundacion' ? [] : animales_ids,
            comprobante_url
        });

        document.getElementById('modal-expense-form').classList.remove('active');
        this.render();
        window.App.showNotification(`Gasto "$${monto.toLocaleString('es-CL')}" registrado exitosamente.`);
    }
};

window.ExpensesModule = ExpensesModule;
