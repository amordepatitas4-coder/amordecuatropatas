/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/app.js
 * DESCRIPCIÓN: Controlador Principal y Enrutador SPA (Single Page Application).
 * 
 * Responsabilidades:
 * 1. Inicialización de los módulos cuando el DOM está listo.
 * 2. Manejo de la navegación entre secciones (Dashboard, Fichas, Salud, Hogares, etc.).
 * 3. Apertura y cierre de modales de manera accesible.
 * 4. Sistema de notificaciones "Toast" para avisos de confirmación.
 * 5. Gestión de perfiles de usuario (Presidenta / Tesorera) con mismos permisos (RF-01).
 * ==============================================================================
 */

const App = {
    currentSection: 'section-dashboard',
    activeUser: '',
    currentUser: null,
    initialized: false,

    init() {
        if (this.initialized) {
            this.refreshAll();
            return;
        }
        this.initialized = true;
        console.log('🚀 Inicializando Sistema Web — Fundación Amor de Cuatro Patas...');

        this.bindNavigation();
        this.bindModals();
        this.bindMobileMenu();

        // Inicializar módulos del sistema
        if (window.AnimalsModule) window.AnimalsModule.init();
        if (window.HealthModule) window.HealthModule.init();
        if (window.HomesModule) window.HomesModule.init();
        if (window.AdoptionsModule) window.AdoptionsModule.init();
        if (window.EsterilizacionesModule) window.EsterilizacionesModule.init();
        if (window.ExpensesModule) window.ExpensesModule.init();
        if (window.DocumentsModule) window.DocumentsModule.init();
        if (window.DiffusionModule) window.DiffusionModule.init();
        if (window.ReportsModule) window.ReportsModule.init();

        console.log('✅ Todos los módulos inicializados correctamente.');
    },

    refreshAll() {
        if (window.AnimalsModule) window.AnimalsModule.render();
        if (window.HealthModule) window.HealthModule.render();
        if (window.HomesModule) window.HomesModule.render();
        if (window.AdoptionsModule) window.AdoptionsModule.render();
        if (window.EsterilizacionesModule) window.EsterilizacionesModule.render();
        if (window.ExpensesModule) window.ExpensesModule.render();
        if (window.DocumentsModule) window.DocumentsModule.render();
        if (window.ReportsModule) window.ReportsModule.render();
    },

    /**
     * Navegación SPA por secciones
     */
    bindNavigation() {
        document.querySelectorAll('.sidebar-nav-item, .quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSectionId = link.getAttribute('data-target');
                if (targetSectionId) {
                    this.navigateTo(targetSectionId);
                    this.closeMobileMenu();
                }
            });
        });
    },

    navigateTo(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));

        // Desactivar items de navegación
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-target') === sectionId);
        });

        // Mostrar sección destino
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            this.currentSection = sectionId;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Refrescar datos según la sección que se active
            if (sectionId === 'section-dashboard' && window.ReportsModule) {
                window.ReportsModule.render();
            } else if (sectionId === 'section-animales' && window.AnimalsModule) {
                window.AnimalsModule.render();
            } else if (sectionId === 'section-salud' && window.HealthModule) {
                window.HealthModule.render();
            } else if (sectionId === 'section-hogares' && window.HomesModule) {
                window.HomesModule.render();
            } else if (sectionId === 'section-adopciones' && window.AdoptionsModule) {
                window.AdoptionsModule.render();
            } else if (sectionId === 'section-esterilizaciones' && window.EsterilizacionesModule) {
                window.EsterilizacionesModule.render();
            } else if (sectionId === 'section-gastos' && window.ExpensesModule) {
                window.ExpensesModule.render();
            } else if (sectionId === 'section-documentos' && window.DocumentsModule) {
                window.DocumentsModule.render();
            } else if (sectionId === 'section-difusion' && window.DiffusionModule) {
                window.DiffusionModule.populateAnimalSelector();
            }
        }
    },

    /**
     * Gestión unificada de cierre de modales
     */
    bindModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });

        document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) modal.classList.remove('active');
            });
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            }
        });
    },

    bindMobileMenu() {
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('sidebar-open');
            document.getElementById('mobile-menu-toggle').setAttribute('aria-expanded', String(isOpen));
        });
        document.getElementById('sidebar-backdrop')?.addEventListener('click', () => this.closeMobileMenu());
    },

    closeMobileMenu() {
        document.body.classList.remove('sidebar-open');
        document.getElementById('mobile-menu-toggle')?.setAttribute('aria-expanded', 'false');
    },

    /**
     * Notificación Toast flotante
     */
    showNotification(message) {
        let toast = document.getElementById('app-toast-alert');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast-alert';
            toast.className = 'toast-alert';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 4000);
    },

    /**
     * Importa un archivo de respaldo JSON seleccionado por el usuario
     */
    handleImportBackup(event) {
        if (!window.AuthModule.requireSession()) return;
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = window.DB.importBackupJSON(e.target.result);
            if (success) {
                this.showNotification('🎉 ¡Respaldo importado y base de datos restaurada con éxito!');
                setTimeout(() => location.reload(), 1200);
            } else {
                alert('El archivo seleccionado no tiene el formato de respaldo válido de la Fundación.');
            }
        };
        reader.readAsText(file);
    },

    /**
     * Restablece los datos de demostración
     */
    resetDemoData() {
        if (!window.AuthModule.requireSession()) return;
        if (confirm('¿Deseas restaurar los datos semilla iniciales de la Fundación? Esta acción reiniciará los registros.')) {
            window.DB.resetToSeed();
            location.reload();
        }
    },

    exportBackup() {
        if (!window.AuthModule.requireSession()) return;
        window.DB.exportBackupJSON();
    }
};

window.App = App;

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.AuthModule.init();
});
