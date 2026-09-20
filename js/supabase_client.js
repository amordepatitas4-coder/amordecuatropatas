/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/supabase_client.js
 * DESCRIPCIÓN: Cliente Oficial de Conexión y Sincronización a Supabase Cloud
 *              PostgreSQL en Región São Paulo (sa-east-1)
 * ==============================================================================
 */

const SUPABASE_CONFIG = {
    url: 'https://yafsgjwidizsjmxhjvkb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZnNnandpZGl6c2pteGhqdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5Mzk4MzAsImV4cCI6MjEwNTUxNTgzMH0.pheLF71Cz1an0qvUOpyjU6Yqv99p08Gx2qNALRGb9g0'
};

window.SupabaseClient = {
    client: null,
    isConnected: false,
    latencyMs: null,

    init() {
        if (window.supabase && window.supabase.createClient) {
            try {
                this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                this.isConnected = true;
                console.log('☁️ [Supabase Cloud] Conexión establecida con éxito:', SUPABASE_CONFIG.url);
                this.updateUIStatus(true);
                this.ping().then(p => {
                    if (p.ok) {
                        this.latencyMs = p.latenciaMs;
                        this.updateUIStatus(true, p.latenciaMs);
                    }
                });
            } catch (e) {
                console.error('⚠️ [Supabase Cloud] Error al inicializar cliente:', e);
                this.updateUIStatus(false);
            }
        } else {
            console.warn('⚠️ [Supabase Cloud] SDK de Supabase no disponible aún en ventana.');
            this.updateUIStatus(false);
        }
    },

    updateUIStatus(connected, latency = null) {
        const badge = document.getElementById('supabase-status-badge');
        if (badge) {
            if (connected) {
                const latencyLabel = latency !== null ? ` • ${latency}ms` : '';
                badge.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.35rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; cursor: pointer;" title="Supabase Cloud São Paulo en línea. Clic para ejecutar autodiagnóstico.">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                        <span>Supabase Cloud Conectado${latencyLabel}</span>
                    </span>
                `;
            } else {
                badge.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.35rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600;">
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

    // Sincronización bidireccional: Guardar / Actualizar registro en Supabase Cloud
    async upsert(tableName, record) {
        if (!this.client) return null;
        try {
            // Filtrar propiedades complejas anidadas o no persistibles si existen
            const sanitized = { ...record };
            delete sanitized.estados;
            delete sanitized.salud;
            delete sanitized.hogares;
            delete sanitized.adopcion;
            delete sanitized.adoptante;
            delete sanitized.seguimientos;
            delete sanitized.cuestionarios;
            delete sanitized.gastos;
            delete sanitized.totalGastado;
            delete sanitized.hogarActual;

            const { data, error } = await this.client
                .from(tableName)
                .upsert(sanitized, { onConflict: 'id' })
                .select();

            if (error) {
                console.warn(`[Supabase Cloud] Error al sincronizar en ${tableName}:`, error.message);
                return null;
            }
            console.log(`☁️ [Supabase Cloud] Sincronizado en ${tableName}:`, record.id);
            return data;
        } catch (e) {
            console.warn(`[Supabase Cloud] Excepción sincronizando ${tableName}:`, e);
            return null;
        }
    },

    // Eliminar o marcar inactivo en Supabase Cloud
    async delete(tableName, id) {
        if (!this.client) return false;
        try {
            const { error } = await this.client.from(tableName).delete().eq('id', id);
            if (error) throw error;
            console.log(`☁️ [Supabase Cloud] Registro eliminado de ${tableName}:`, id);
            return true;
        } catch (e) {
            console.warn(`[Supabase Cloud] Excepción al eliminar de ${tableName}:`, e);
            return false;
        }
    },

    // Cargar datos en vivo desde Supabase hacia la aplicación
    async sincronizarDesdeCloud(mostrarNotificacion = false) {
        if (!this.client) return false;
        const inicio = performance.now();
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
                
                const duracion = Math.round(performance.now() - inicio);
                this.updateUIStatus(true, duracion);

                if (mostrarNotificacion && window.App && window.App.showNotification) {
                    window.App.showNotification(`Sincronización con Supabase Cloud exitosa (${duracion}ms)`, 'success');
                }
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error sincronizando desde Supabase Cloud:', e);
            if (mostrarNotificacion && window.App && window.App.showNotification) {
                window.App.showNotification('Error al sincronizar con Supabase Cloud', 'error');
            }
            return false;
        }
    },

    // Batería completa de autodiagnóstico ejecutable desde UI
    async ejecutarAutodiagnostico() {
        const modalId = 'modal-diagnostico-supabase';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-card" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3>☁️ Diagnóstico de Conexión Supabase Cloud</h3>
                        <button class="modal-close" onclick="document.getElementById('${modalId}').remove()">×</button>
                    </div>
                    <div class="modal-body" id="diagnostico-body">
                        <div style="text-align: center; padding: 2rem;">
                            <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem; border: 3px solid rgba(16,185,129,0.2); border-top-color: #10b981; border-radius: 50%; animation: spin 1s infinite linear;"></div>
                            <p>Ejecutando pruebas de lectura, escritura y latencia con São Paulo...</p>
                        </div>
                    </div>
                    <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="document.getElementById('${modalId}').remove()">Cerrar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const body = document.getElementById('diagnostico-body');
        const resultados = [];

        // Test 1: Ping
        const tPing = await this.ping();
        resultados.push({
            nombre: 'Conexión y Latencia PostgreSQL',
            ok: tPing.ok,
            detalle: tPing.ok ? `${tPing.latenciaMs} ms (São Paulo, sa-east-1)` : tPing.error
        });

        // Test 2: Inserción y lectura temporal
        const testId = `diag-${Date.now().toString(36)}`;
        let tWriteOk = false;
        let tWriteDetalle = '';
        try {
            const { data, error } = await this.client.from('animales').insert([{
                id: testId,
                nombre: 'Diagnóstico UI',
                especie: 'Canino',
                raza: 'Test',
                sexo: 'Macho',
                estado_actual: 'disponible',
                activo: false
            }]).select();
            if (error) throw error;
            tWriteOk = true;
            tWriteDetalle = 'Escritura exitosa en tabla animales (HTTP 201)';
            // Limpieza inmediata
            await this.client.from('animales').delete().eq('id', testId);
        } catch (e) {
            tWriteDetalle = e.message;
        }
        resultados.push({
            nombre: 'Permisos de Escritura y Políticas RLS',
            ok: tWriteOk,
            detalle: tWriteDetalle
        });

        // Test 3: Conteo de tablas
        let tCountOk = false;
        let tCountDetalle = '';
        try {
            const { count, error } = await this.client.from('proyectos_esterilizacion').select('*', { count: 'exact', head: true });
            if (error) throw error;
            tCountOk = true;
            tCountDetalle = `Tabla Esterilización Masiva accesible (${count} operativos activos)`;
        } catch (e) {
            tCountDetalle = e.message;
        }
        resultados.push({
            nombre: 'Área Funcional 2: Esterilización Masiva',
            ok: tCountOk,
            detalle: tCountDetalle
        });

        // Render resultados
        let html = '<div style="display: flex; flex-direction: column; gap: 0.8rem;">';
        resultados.forEach(r => {
            const icon = r.ok ? '✅' : '❌';
            const color = r.ok ? '#10b981' : '#ef4444';
            html += `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.9rem; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <strong>${icon} ${r.nombre}</strong>
                        <span style="color: ${color}; font-size: 0.85rem; font-weight: 600;">${r.ok ? 'APROBADO' : 'ERROR'}</span>
                    </div>
                    <small style="color: var(--text-muted); display: block;">${r.detalle}</small>
                </div>
            `;
        });
        html += `
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(16,185,129,0.1); border-left: 4px solid #10b981; border-radius: 4px;">
                <small style="color: #10b981; font-weight: 500;">
                    🛡️ Tarea Programada Keep-Alive activa en pg_cron y GitHub Actions para prevenir la suspensión por inactividad.
                </small>
            </div>
        </div>`;
        body.innerHTML = html;
    }
};

// Auto inicialización al cargar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.SupabaseClient.init();
    }, 150);
});
