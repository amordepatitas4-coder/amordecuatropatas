/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/supabase_client.js
 * DESCRIPCIÓN: Cliente Oficial de Conexión a Supabase Cloud (PostgreSQL en São Paulo)
 * ==============================================================================
 */

const SUPABASE_CONFIG = {
    url: 'https://yafsgjwidizsjmxhjvkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZnNnandpZGl6c2pteGhqdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5Mzk4MzAsImV4cCI6MjEwNTUxNTgzMH0.pheLF71Cz1an0qvUOpyjU6Yqv99p08Gx2qNALRGb9g0'
};

window.SupabaseClient = {
    client: null,
    isConnected: false,

    init() {
        if (window.supabase && window.supabase.createClient) {
            try {
                this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                this.isConnected = true;
                console.log('☁️ [Supabase Cloud] Conexión establecida con éxito:', SUPABASE_CONFIG.url);
                this.updateUIStatus(true);
            } catch (e) {
                console.error('⚠️ [Supabase Cloud] Error al inicializar cliente:', e);
                this.updateUIStatus(false);
            }
        } else {
            console.warn('⚠️ [Supabase Cloud] SDK de Supabase no disponible aún en ventana.');
            this.updateUIStatus(false);
        }
    },

    updateUIStatus(connected) {
        const badge = document.getElementById('supabase-status-badge');
        if (badge) {
            if (connected) {
                badge.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                        <span>Supabase Cloud Conectado</span>
                    </span>
                `;
            } else {
                badge.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span>
                        <span>Modo Local Offline</span>
                    </span>
                `;
            }
        }
    },

    // Consulta de salud y prueba de latencia
    async ping() {
        if (!this.client) return { ok: false, error: 'Cliente no inicializado' };
        const inicio = performance.now();
        try {
            const { data, error } = await this.client.from('animales').select('id').limit(1);
            const duracion = Math.round(performance.now() - inicio);
            if (error) throw error;
            return { ok: true, latenciaMs: duracion, data };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    },

    // Cargar datos en vivo desde Supabase hacia la aplicación
    async sincronizarDesdeCloud() {
        if (!this.client) return false;
        try {
            console.log('🔄 Sincronizando datos desde Supabase Cloud hacia la vista...');
            const [
                resAnimales,
                resSalud,
                resHogares,
                resAdopciones,
                resCuestionarios,
                resProyectosEst,
                resAnimalesEst,
                resGastos,
                resDocumentos
            ] = await Promise.all([
                this.client.from('animales').select('*').order('creado_el', { ascending: false }),
                this.client.from('historial_sanitario').select('*'),
                this.client.from('hogares_temporales').select('*'),
                this.client.from('adopciones').select('*'),
                this.client.from('cuestionarios_adopcion').select('*'),
                this.client.from('proyectos_esterilizacion').select('*'),
                this.client.from('animales_esterilizacion').select('*'),
                this.client.from('gastos').select('*'),
                this.client.from('documentos').select('*')
            ]);

            if (resAnimales.data && window.DB) {
                window.DB.db.animales = resAnimales.data;
                if (resSalud.data) window.DB.db.historial_sanitario = resSalud.data;
                if (resHogares.data) window.DB.db.hogares_temporales = resHogares.data;
                if (resAdopciones.data) window.DB.db.adopciones = resAdopciones.data;
                if (resCuestionarios.data) window.DB.db.cuestionarios_adopcion = resCuestionarios.data;
                if (resProyectosEst.data) window.DB.db.proyectos_esterilizacion = resProyectosEst.data;
                if (resAnimalesEst.data) window.DB.db.animales_esterilizacion = resAnimalesEst.data;
                if (resGastos.data) window.DB.db.gastos = resGastos.data;
                if (resDocumentos.data) window.DB.db.documentos = resDocumentos.data;

                window.DB.save();
                if (window.App && window.App.refreshAll) window.App.refreshAll();
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error sincronizando desde Supabase Cloud:', e);
            return false;
        }
    }
};

// Auto inicialización al cargar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.SupabaseClient.init();
    }, 150);
});
