/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/db.js
 * DESCRIPCIÓN: Capa de Base de Datos y Persistencia de Datos.
 * 
 * Este archivo actúa como el motor central de almacenamiento (Data Access Layer).
 * Implementa persistencia local en `localStorage` con estructura relacional idéntica
 * a las tablas propuestas para PostgreSQL en Supabase.
 * 
 * De esta forma:
 * 1. El sistema funciona inmediatamente sin dependencias externas ni servidores.
 * 2. Mantiene la integridad y relaciones de todas las entidades (Animales, Salud, etc.).
 * 3. Permite exportar/importar datos en formato JSON para respaldos.
 * 4. Deja la estructura lista para conectarse directamente a la API de Supabase.
 * ==============================================================================
 */

// Clave principal utilizada en localStorage
const DB_STORAGE_KEY = 'fundacion_amor_cuatro_patas_db_v1';

/**
 * Datos semilla (Seed Data) iniciales para demostrar el funcionamiento
 * con casos realistas basados en los requerimientos de la Fundación.
 */
const INITIAL_DATABASE_STATE = {
    // 1. Tabla: Animales (Entidad Central)
    animales: [
        {
            id: 'anim-001',
            nombre: 'Luna',
            especie: 'Canino',
            raza: 'Mestiza',
            sexo: 'Hembra',
            edad_aprox: '1 año 4 meses',
            peso_kg: 14.5,
            tamano: 'Mediano',
            estado_actual: 'disponible', // rescate | cuarentena | hogar_temporal | disponible | evaluacion | adoptado
            descripcion: 'Rescatada en la carretera con signos de desnutrición. Muy sociable, cariñosa y juguetona.',
            personalidad: 'Tranquila con niños, amigable con otros perros, enérgica para paseos.',
            foto_operativa_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
            foto_secundaria_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
            esterilizado: 'si',
            microchip: '941000028192831',
            nivel_energia: 'Medio',
            sociable_ninos: true,
            sociable_perros: true,
            sociable_gatos: false,
            drive_multimedia_url: 'https://drive.google.com/drive/folders/ejemplo_luna',
            fecha_ingreso: '2026-06-10',
            activo: true // Principio de trazabilidad: nunca se elimina físicamente
        },
        {
            id: 'anim-002',
            nombre: 'Rocky',
            especie: 'Canino',
            raza: 'Quiltro / Cruce Pastor',
            sexo: 'Macho',
            edad_aprox: '3 años',
            peso_kg: 22.0,
            tamano: 'Grande',
            estado_actual: 'hogar_temporal',
            descripcion: 'Encontrado en sitio eriazo con herida en pata delantera izquierda. Ya recuperado al 100%.',
            personalidad: 'Guardián, noble, leal y muy obediente.',
            foto_operativa_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
            foto_secundaria_url: '',
            esterilizado: 'no',
            microchip: '941000039281744',
            nivel_energia: 'Alto',
            sociable_ninos: true,
            sociable_perros: true,
            sociable_gatos: false,
            drive_multimedia_url: 'https://drive.google.com/drive/folders/ejemplo_rocky',
            fecha_ingreso: '2026-07-02',
            activo: true
        },
        {
            id: 'anim-003',
            nombre: 'Mimi',
            especie: 'Felino',
            raza: 'Común Europeo',
            sexo: 'Hembra',
            edad_aprox: '8 meses',
            peso_kg: 3.2,
            tamano: 'Pequeño',
            estado_actual: 'adoptado',
            descripcion: 'Rescatada de una techumbre junto a sus hermanos cuando tenía 2 meses.',
            personalidad: 'Curiosa, ronroneadora, acostumbrada a vivir en departamento.',
            foto_operativa_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
            foto_secundaria_url: '',
            esterilizado: 'si',
            microchip: '941000048192003',
            nivel_energia: 'Bajo',
            sociable_ninos: true,
            sociable_perros: false,
            sociable_gatos: true,
            drive_multimedia_url: '',
            fecha_ingreso: '2026-05-15',
            activo: true
        }
    ],

    // 2. Tabla: Historial de Estados (Trazabilidad del flujo del rescate)
    historial_estados: [
        {
            id: 'est-001',
            animal_id: 'anim-001',
            estado: 'rescate',
            fecha: '2026-06-10',
            observaciones: 'Ingreso inicial por aviso comunitario.'
        },
        {
            id: 'est-002',
            animal_id: 'anim-001',
            estado: 'cuarentena',
            fecha: '2026-06-11',
            observaciones: 'Evaluación veterinaria inicial y aislamiento preventivo.'
        },
        {
            id: 'est-003',
            animal_id: 'anim-001',
            estado: 'disponible',
            fecha: '2026-07-15',
            observaciones: 'Vacunación y esterilización completadas. Lista para difusión.'
        },
        {
            id: 'est-004',
            animal_id: 'anim-003',
            estado: 'adoptado',
            fecha: '2026-08-01',
            observaciones: 'Adopción concretada con firma de compromiso responsable.'
        }
    ],

    // 3. Tabla: Historial Sanitario (RF-04: Controles, Vacunas, Desparasitaciones)
    historial_sanitario: [
        {
            id: 'san-001',
            animal_id: 'anim-001',
            fecha: '2026-06-12',
            tipo_evento: 'Desparasitación', // Desparasitación | Vacunación | Control veterinario | Esterilización | Tratamiento
            descripcion: 'Antiparasitario interno amplio espectro (Endogard 1 comp).',
            veterinario: 'Dra. Andrea Morales',
            proximo_control: '2026-09-12'
        },
        {
            id: 'san-002',
            animal_id: 'anim-001',
            fecha: '2026-06-25',
            tipo_evento: 'Vacunación',
            descripcion: 'Vacuna Óctuple canina + Antirrábica obligatoria.',
            veterinario: 'Dr. Felipe Soto',
            proximo_control: '2027-06-25'
        },
        {
            id: 'san-003',
            animal_id: 'anim-001',
            fecha: '2026-07-05',
            tipo_evento: 'Esterilización',
            descripcion: 'Ovariohisterectomía sin complicaciones. Recuperación post-quirúrgica excelente.',
            veterinario: 'Clínica Veterinaria Central',
            proximo_control: '2026-07-15'
        },
        {
            id: 'san-004',
            animal_id: 'anim-002',
            fecha: '2026-07-03',
            tipo_evento: 'Tratamiento',
            descripcion: 'Curación de herida traumática y sutura. Antibióticos y antiinflamatorios por 7 días.',
            veterinario: 'Dra. Andrea Morales',
            proximo_control: '2026-07-12'
        }
    ],

    // 4. Tabla: Hogares Temporales (RF-05)
    hogares_temporales: [
        {
            id: 'hog-001',
            nombre_cuidador: 'Marta Valenzuela',
            telefono: '+56 9 8765 4321',
            direccion: 'Av. Las Palmas 450, Talca',
            tipo_vivienda: 'Casa con patio cerrado',
            capacidad_maxima: 2,
            notas: 'Excelente disponibilidad para perros medianos y cachorros.'
        },
        {
            id: 'hog-002',
            nombre_cuidador: 'Carlos Sepúlveda',
            telefono: '+56 9 7654 3210',
            direccion: 'Calle Los Notros 123, Maule',
            tipo_vivienda: 'Parcela',
            capacidad_maxima: 3,
            notas: 'Ideal para perros grandes o con necesidades de rehabilitación física.'
        }
    ],

    // 5. Tabla: Historial Animal-Hogar (RF-05: Fechas de permanencia)
    animal_hogares: [
        {
            id: 'ah-001',
            animal_id: 'anim-002',
            hogar_id: 'hog-002',
            fecha_ingreso: '2026-07-10',
            fecha_salida: null, // null indica que se encuentra actualmente en este hogar
            observaciones: 'En proceso de adaptación en parcela, convive bien con otros animales.'
        },
        {
            id: 'ah-002',
            animal_id: 'anim-001',
            hogar_id: 'hog-001',
            fecha_ingreso: '2026-06-15',
            fecha_salida: '2026-07-20',
            observaciones: 'Permaneció mientras cicatrizaba la esterilización.'
        }
    ],
 
    // 6. Tabla: Cuestionarios de Adopción (RF-07: Evaluación de Postulantes)
    cuestionarios_adopcion: [
        {
            id: 'cue-001',
            animal_id: 'anim-001',
            nombre_postulante: 'Roberto Morales Varas',
            rut: '15.432.198-7',
            telefono: '+56 9 8234 5678',
            email: 'roberto.morales@example.com',
            direccion: 'Calle Los Ciruelos 45, Talca',
            tipo_vivienda: 'Casa con patio cerrado',
            tiene_patio_cerrado: true,
            acuerdo_familia: true,
            presupuesto_veterinario: true,
            experiencia_previa: 'Ha tenido perros antes por más de 12 años.',
            motivo_adopcion: 'Buscamos una compañera para paseos familiares y brindarle amor.',
            estado_evaluacion: 'aprobado', // pendiente | aprobado | rechazado
            notas_evaluacion: 'Excelente perfil. Patio totalmente seguro con cierre perimetral de 2 metros.',
            fecha_postulacion: '2026-08-20'
        },
        {
            id: 'cue-002',
            animal_id: 'anim-002',
            nombre_postulante: 'Valeria Castro Ruiz',
            rut: '18.765.432-1',
            telefono: '+56 9 7654 3219',
            email: 'valeria.castro@example.com',
            direccion: 'Condominio El Roble, Casa 12, Maule',
            tipo_vivienda: 'Casa con patio cerrado',
            tiene_patio_cerrado: true,
            acuerdo_familia: true,
            presupuesto_veterinario: true,
            experiencia_previa: 'Primer perro propio como adulta responsable.',
            motivo_adopcion: 'Quiero darle una segunda oportunidad a un perrito rescatado.',
            estado_evaluacion: 'pendiente',
            notas_evaluacion: 'Pendiente visita técnica previa al hogar para validar cierre.',
            fecha_postulacion: '2026-09-01'
        }
    ],

    // 7. Tabla: Adoptantes (RF-07)
    adoptantes: [
        {
            id: 'adp-001',
            rut: '16.890.123-4',
            nombre: 'Camila González Pino',
            telefono: '+56 9 9123 4567',
            email: 'camila.gonzalez@example.com',
            direccion: 'Pasaje Los Aromos 78, Talca',
            evaluacion_estado: 'aprobado',
            notas: 'Familia con experiencia previa en gatos. Dpto con mallas de seguridad.'
        }
    ],

    // 7. Tabla: Adopciones (RF-07)
    adopciones: [
        {
            id: 'adop-001',
            animal_id: 'anim-003',
            adoptante_id: 'adp-001',
            fecha_adopcion: '2026-08-01',
            contrato_folio: 'CONTRATO-2026-003',
            contrato_drive_url: 'https://drive.google.com/file/d/ejemplo_contrato_mimi',
            observaciones: 'Se entregó con carnet sanitario completo y chip al día.'
        }
    ],

    // 8. Tabla: Seguimientos Post-Adopción (RF-08: Historial acumulativo)
    seguimientos: [
        {
            id: 'seg-001',
            adopcion_id: 'adop-001',
            animal_id: 'anim-003',
            fecha: '2026-08-15',
            medio_contacto: 'WhatsApp / Fotos',
            estado_mascota: 'Excelente',
            observaciones: 'Mimi se adaptó perfectamente a su cama rascador. Envían fotos comiendo y jugando.'
        },
        {
            id: 'seg-002',
            adopcion_id: 'adop-001',
            animal_id: 'anim-003',
            fecha: '2026-09-01',
            medio_contacto: 'Llamada telefónica',
            estado_mascota: 'Muy bien',
            observaciones: 'Confirmaron control veterinario preventivo para fines de mes. Caso sin inconvenientes.'
        }
    ],

    // 9. Tabla: Gastos (RF-09: Finanzas de la Fundación)
    gastos: [
        {
            id: 'gst-001',
            fecha: '2026-06-12',
            concepto: 'Atención de urgencia y desparasitación Luna',
            categoria: 'veterinaria', // veterinaria | alimento | medicamentos | transporte | insumos_generales
            monto: 35000,
            tipo_asignacion: 'animal_unico', // animal_unico | multiples_animales | general_fundacion
            animales_ids: ['anim-001'],
            comprobante_url: 'https://drive.google.com/file/d/boleta-001'
        },
        {
            id: 'gst-002',
            fecha: '2026-07-01',
            concepto: 'Saco de alimento balanceado perros adultos 20kg',
            categoria: 'alimento',
            monto: 48990,
            tipo_asignacion: 'multiples_animales',
            animales_ids: ['anim-001', 'anim-002'],
            comprobante_url: 'https://drive.google.com/file/d/boleta-002'
        },
        {
            id: 'gst-003',
            fecha: '2026-07-05',
            concepto: 'Cirugía de esterilización Luna',
            categoria: 'veterinaria',
            monto: 60000,
            tipo_asignacion: 'animal_unico',
            animales_ids: ['anim-001'],
            comprobante_url: 'https://drive.google.com/file/d/boleta-003'
        },
        {
            id: 'gst-004',
            fecha: '2026-07-15',
            concepto: 'Insumos de limpieza y desinfección para hogares de paso',
            categoria: 'insumos_generales',
            monto: 22500,
            tipo_asignacion: 'general_fundacion',
            animales_ids: [],
            comprobante_url: ''
        }
    ],

    // 10. Documentos Digitales (RF-10)
    documentos: [
        {
            id: 'doc-001',
            titulo: 'Formulario Oficial de Postulación y Evaluación Socio-Ambiental de Adopción (Ley 21.020)',
            categoria: 'formulario',
            url: 'https://drive.google.com/file/d/formulario_oficial',
            descripcion: 'Instrumento exhaustivo de 15 dimensiones para la verificación de condiciones habitacionales, seguridad perimetral y solvencia del adoptante.'
        },
        {
            id: 'doc-002',
            titulo: 'Contrato Solemne de Adopción Definitiva y Compromiso de Tenencia Responsable',
            categoria: 'legal',
            url: 'https://drive.google.com/file/d/contrato_modelo',
            descripcion: 'Instrumento privado vinculante con cláusulas legales de tutela, prohibición de reventa o abandono, visitas y restitución conforme a la Ley 21.020.'
        },
        {
            id: 'doc-003',
            titulo: 'Protocolo Clínico de Triage e Ingreso Sanitario de Rescate',
            categoria: 'administrativo',
            url: 'https://drive.google.com/file/d/protocolo_ingreso',
            descripcion: 'Norma técnica institucional de bioseguridad: escala de triage de urgencia veterinaria, examen ECOG, cuarentena de 15 días e inmunización.'
        }
    ],

    // 11. Tabla: Proyectos de Esterilización Masiva (Área Funcional 2 — Ficha Técnica §5)
    proyectos_esterilizacion: [
        {
            id: 'proy-est-001',
            nombre: 'Operativo Comunitario Las Américas',
            sector: 'Sede Social Junta de Vecinos N° 14, Sector Norte, Talca',
            fecha_inicio: '2026-08-15',
            fecha_fin: '2026-08-16',
            veterinario_responsable: 'Dra. Camila Fuentes (Colmevet N° 4512)',
            entidad_financiamiento: 'Subdere — Programa Tenencia Responsable',
            meta_animales: 40,
            estado: 'Finalizado', // Planificado | En Ejecución | Finalizado
            drive_folder_url: 'https://drive.google.com/drive/folders/operativo_las_americas_2026',
            notas: 'Operativo exitoso en conjunto con dirigentes vecinales. Animales comunitarios retornados.',
            activo: true
        },
        {
            id: 'proy-est-002',
            nombre: 'Campaña Sanitaria Rural San Clemente',
            sector: 'Posta Rural Los Montes, Ruta K-25',
            fecha_inicio: '2026-09-25',
            fecha_fin: '2026-09-26',
            veterinario_responsable: 'Dr. Marcelo Valenzuela (Colmevet N° 3890)',
            entidad_financiamiento: 'Fondos Concursables Regionales Maule',
            meta_animales: 50,
            estado: 'Planificado',
            drive_folder_url: 'https://drive.google.com/drive/folders/campana_san_clemente_2026',
            notas: 'Inscripciones previas con dirigentes vecinales. Foco en caninos comunitarios de parcelas.',
            activo: true
        }
    ],

    // 12. Tabla: Animales Atendidos en Operativos de Esterilización Masiva
    animales_esterilizacion: [
        {
            id: 'anim-est-001',
            proyecto_id: 'proy-est-001',
            codigo_operativo: 'OP-AME-001',
            especie: 'Canino',
            sexo: 'Hembra',
            descripcion_color: 'Quiltra mediana barcina con pecho blanco',
            tutor_vecino: 'Marta Poblete (Cuidadora comunitaria)',
            telefono_contacto: '+56 9 8451 2309',
            microchip: '941000084519201',
            observaciones: 'Cirugía sin incidentes. Se administró antibioterapia y analgesia de depósito.',
            estado_post: 'Retornado a su sector', // Retornado a su sector | En observación temporal | Derivado a rescate
            fecha_intervencion: '2026-08-15',
            activo: true
        },
        {
            id: 'anim-est-002',
            proyecto_id: 'proy-est-001',
            codigo_operativo: 'OP-AME-002',
            especie: 'Canino',
            sexo: 'Macho',
            descripcion_color: 'Mestizo de pastor, negro con manchas fuego',
            tutor_vecino: 'Gonzalo Araya (Vecino pasaje 4)',
            telefono_contacto: '+56 9 7123 9081',
            microchip: '941000084519202',
            observaciones: 'Se extrajo espiga de oreja derecha. Buen despertar anestésico.',
            estado_post: 'Retornado a su sector',
            fecha_intervencion: '2026-08-15',
            activo: true
        },
        {
            id: 'anim-est-003',
            proyecto_id: 'proy-est-001',
            codigo_operativo: 'OP-AME-003',
            especie: 'Felino',
            sexo: 'Hembra',
            descripcion_color: 'Gata romana atigrada de colonia comunitaria plaza',
            tutor_vecino: 'Junta de Vecinos N° 14',
            telefono_contacto: '+56 9 9012 3456',
            microchip: '941000084519203',
            observaciones: 'Preñez incipiente interrumpida según protocolo TNR. Marcaje de oreja izquierda.',
            estado_post: 'Retornado a su sector',
            fecha_intervencion: '2026-08-16',
            activo: true
        }
    ]
};

/**
 * Clase controladora de la Base de Datos (Data Store)
 * Proporciona métodos CRUD para cada entidad relacional.
 */
class DatabaseManager {
    constructor() {
        this.db = null;
        this.init();
    }

    /**
     * Inicializa la base de datos leyendo localStorage o cargando los datos iniciales.
     */
    init() {
        try {
            const stored = localStorage.getItem(DB_STORAGE_KEY);
            if (stored) {
                this.db = JSON.parse(stored);
                // Garantizar existencia y actualización de documentos oficiales institucionales
                if (!this.db.documentos || this.db.documentos.length < 3) {
                    this.db.documentos = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.documentos));
                    this.save();
                } else {
                    // Actualizar títulos y descripciones a la versión oficial rigurosa
                    const d1 = this.db.documentos.find(d => d.id === 'doc-001');
                    if (d1) {
                        d1.titulo = 'Formulario Oficial de Postulación y Evaluación Socio-Ambiental de Adopción (Ley 21.020)';
                        d1.descripcion = 'Instrumento exhaustivo de 15 dimensiones para la verificación de condiciones habitacionales, seguridad perimetral y solvencia del adoptante.';
                    }
                    const d2 = this.db.documentos.find(d => d.id === 'doc-002');
                    if (d2) {
                        d2.titulo = 'Contrato Solemne de Adopción Definitiva y Compromiso de Tenencia Responsable';
                        d2.descripcion = 'Instrumento privado vinculante con cláusulas legales de tutela, prohibición de reventa o abandono, visitas y restitución conforme a la Ley 21.020.';
                    }
                    const d3 = this.db.documentos.find(d => d.id === 'doc-003');
                    if (d3) {
                        d3.titulo = 'Protocolo Clínico de Triage e Ingreso Sanitario de Rescate';
                        d3.descripcion = 'Norma técnica institucional de bioseguridad: escala de triage de urgencia veterinaria, examen ECOG, cuarentena de 15 días e inmunización.';
                    }
                    this.save();
                }
                this.db.documentos.forEach(doc => {
                    if (!doc.entidad_tipo) doc.entidad_tipo = 'general';
                    if (!Object.prototype.hasOwnProperty.call(doc, 'entidad_id')) doc.entidad_id = null;
                });

                // Migración para cuestionarios_adopcion si no existían
                if (!this.db.cuestionarios_adopcion || this.db.cuestionarios_adopcion.length === 0) {
                    this.db.cuestionarios_adopcion = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.cuestionarios_adopcion));
                }

                // Migración para nuevos campos en animales
                if (this.db.animales) {
                    this.db.animales.forEach(a => {
                        if (a.foto_secundaria_url === undefined) a.foto_secundaria_url = '';
                        if (a.esterilizado === undefined) a.esterilizado = 'pendiente';
                        if (a.microchip === undefined) a.microchip = '';
                        if (a.nivel_energia === undefined) a.nivel_energia = 'Medio';
                        if (a.sociable_ninos === undefined) a.sociable_ninos = true;
                        if (a.sociable_perros === undefined) a.sociable_perros = true;
                        if (a.sociable_gatos === undefined) a.sociable_gatos = false;
                    });
                }

                // Migración para esterilizaciones masivas (Área Funcional 2 — Ficha Técnica §5)
                if (!this.db.proyectos_esterilizacion || this.db.proyectos_esterilizacion.length === 0) {
                    this.db.proyectos_esterilizacion = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.proyectos_esterilizacion));
                }
                if (!this.db.animales_esterilizacion || this.db.animales_esterilizacion.length === 0) {
                    this.db.animales_esterilizacion = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE.animales_esterilizacion));
                }

                this.save();
            } else {
                this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE));
                this.save();
            }
        } catch (error) {
            console.error('[DB] Error cargando datos desde almacenamiento:', error);
            this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE));
        }
    }

    /**
     * Guarda el estado actual en localStorage.
     */
    save() {
        try {
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.db));
        } catch (error) {
            console.error('[DB] Error guardando estado:', error);
        }
    }

    /**
     * Restaura los datos semilla originales (Reset).
     */
    resetToSeed() {
        this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE));
        this.save();
        return this.db;
    }

    /**
     * Genera un identificador único con prefijo
     */
    generateId(prefix = 'item') {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    }

    /**
     * Sincronización asíncrona hacia Supabase Cloud
     */
    syncCloudRecord(table, record) {
        if (window.SupabaseClient && typeof window.SupabaseClient.upsert === 'function') {
            window.SupabaseClient.upsert(table, record);
        }
    }

    // =========================================================================
    // MÉTODOS: GESTIÓN DE ANIMALES (RF-02, RF-03)
    // =========================================================================

    /**
     * Retorna la lista de animales, con filtros opcionales
     */
    getAnimales(filtroEstado = 'todos', busqueda = '') {
        return this.db.animales.filter(a => {
            const coincideEstado = (filtroEstado === 'todos') || (a.estado_actual === filtroEstado);
            const coincideBusqueda = !busqueda || 
                a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                a.raza.toLowerCase().includes(busqueda.toLowerCase()) ||
                a.especie.toLowerCase().includes(busqueda.toLowerCase());
            return coincideEstado && coincideBusqueda;
        });
    }

    /**
     * Obtiene un animal por ID con todas sus entidades vinculadas (Ficha Integral)
     */
    getFichaCompletaAnimal(animalId) {
        const animal = this.db.animales.find(a => a.id === animalId);
        if (!animal) return null;

        // Historial de cambios de estado
        const estados = this.db.historial_estados
            .filter(e => e.animal_id === animalId)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Historial sanitario cronológico
        const salud = this.db.historial_sanitario
            .filter(s => s.animal_id === animalId)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Historial de hogares temporales vinculados
        const asignacionesHogar = this.db.animal_hogares
            .filter(ah => ah.animal_id === animalId)
            .map(ah => {
                const hogar = this.db.hogares_temporales.find(h => h.id === ah.hogar_id);
                return { ...ah, hogar };
            })
            .sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso));

        // Adopción y datos de adoptante si aplica
        const adopcion = this.db.adopciones.find(ad => ad.animal_id === animalId);
        let adoptante = null;
        let seguimientos = [];
        if (adopcion) {
            adoptante = this.db.adoptantes.find(adp => adp.id === adopcion.adoptante_id);
            seguimientos = this.db.seguimientos
                .filter(seg => seg.animal_id === animalId)
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        }

        // Gastos asociados a este animal
        const gastos = this.db.gastos
            .filter(g => g.animales_ids && g.animales_ids.includes(animalId))
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const totalGastado = gastos.reduce((sum, g) => {
            const factor = (g.tipo_asignacion === 'multiples_animales' && g.animales_ids.length > 0)
                ? (g.monto / g.animales_ids.length)
                : g.monto;
            return sum + factor;
        }, 0);

        // Cuestionarios de adopción vinculados a este animal
        const cuestionarios = (this.db.cuestionarios_adopcion || [])
            .filter(c => c.animal_id === animalId)
            .sort((a, b) => new Date(b.fecha_postulacion || 0) - new Date(a.fecha_postulacion || 0));

        return {
            animal,
            estados,
            salud,
            hogares: asignacionesHogar,
            hogarActual: asignacionesHogar.find(h => !h.fecha_salida) || null,
            adopcion,
            adoptante,
            seguimientos,
            cuestionarios,
            gastos,
            totalGastado
        };
    }

    /**
     * Libera las fotos operativas de un animal (RF-10 / Sección 10 Ficha Oficial).
     * Permite eliminar fotos de trabajo de un animal adoptado para optimizar almacenamiento
     * sin comprometer la ficha, la trazabilidad ni el historial médico.
     */
    liberarFotosAnimal(animalId) {
        const animal = this.db.animales.find(a => a.id === animalId);
        if (!animal) return null;
        animal.foto_operativa_url = '';
        animal.foto_secundaria_url = '';
        this.save();
        return animal;
    }

    /**
     * Guarda o actualiza un animal
     */
    saveAnimal(animalData) {
        if (animalData.id) {
            // Actualización
            const index = this.db.animales.findIndex(a => a.id === animalData.id);
            if (index !== -1) {
                // Verificar si cambió de estado para registrar en historial
                const estadoPrevio = this.db.animales[index].estado_actual;
                if (estadoPrevio !== animalData.estado_actual) {
                    this.addEstadoHistorial(animalData.id, animalData.estado_actual, 'Cambio de estado desde edición de ficha');
                }
                this.db.animales[index] = { ...this.db.animales[index], ...animalData };
                this.save();
                this.syncCloudRecord('animales', this.db.animales[index]);
                return this.db.animales[index];
            }
        } else {
            // Creación
            const nuevoAnimal = {
                ...animalData,
                id: this.generateId('anim'),
                activo: true,
                fecha_ingreso: animalData.fecha_ingreso || new Date().toISOString().split('T')[0]
            };
            this.db.animales.unshift(nuevoAnimal);
            // Registrar estado inicial
            this.addEstadoHistorial(nuevoAnimal.id, nuevoAnimal.estado_actual || 'rescate', 'Ingreso inicial a la Fundación');
            this.save();
            this.syncCloudRecord('animales', nuevoAnimal);
            return nuevoAnimal;
        }
    }

    /**
     * Cambia el estado del animal y registra la trazabilidad histórica
     */
    updateEstadoAnimal(animalId, nuevoEstado, observaciones = '') {
        const animal = this.db.animales.find(a => a.id === animalId);
        if (!animal) return null;

        animal.estado_actual = nuevoEstado;
        this.addEstadoHistorial(animalId, nuevoEstado, observaciones);
        this.save();
        this.syncCloudRecord('animales', animal);
        return animal;
    }

    addEstadoHistorial(animalId, estado, observaciones = '') {
        const registro = {
            id: this.generateId('est'),
            animal_id: animalId,
            estado,
            fecha: new Date().toISOString().split('T')[0],
            observaciones
        };
        this.db.historial_estados.unshift(registro);
        this.save();
        return registro;
    }

    // =========================================================================
    // MÉTODOS: HISTORIAL SANITARIO (RF-04)
    // =========================================================================

    addHistorialSanitario(eventoData) {
        const nuevo = {
            ...eventoData,
            id: this.generateId('san'),
            fecha: eventoData.fecha || new Date().toISOString().split('T')[0]
        };
        this.db.historial_sanitario.unshift(nuevo);
        this.save();
        return nuevo;
    }

    // =========================================================================
    // MÉTODOS: HOGARES TEMPORALES (RF-05)
    // =========================================================================

    getHogaresTemporales() {
        return this.db.hogares_temporales;
    }

    saveHogarTemporal(hogarData) {
        if (hogarData.id) {
            const index = this.db.hogares_temporales.findIndex(h => h.id === hogarData.id);
            if (index !== -1) {
                this.db.hogares_temporales[index] = { ...this.db.hogares_temporales[index], ...hogarData };
                this.save();
                return this.db.hogares_temporales[index];
            }
        } else {
            const nuevo = { ...hogarData, id: this.generateId('hog') };
            this.db.hogares_temporales.push(nuevo);
            this.save();
            return nuevo;
        }
    }

    asignarAnimalAHogar(animalId, hogarId, observaciones = '') {
        const asignacionPrevia = this.db.animal_hogares.find(ah => ah.animal_id === animalId && !ah.fecha_salida);
        if (asignacionPrevia?.hogar_id === hogarId) {
            throw new Error('La mascota ya está asignada a este hogar.');
        }

        const hogar = this.db.hogares_temporales.find(h => h.id === hogarId);
        if (!hogar) throw new Error('El hogar seleccionado no existe.');

        const ocupacionActual = this.db.animal_hogares.filter(ah => ah.hogar_id === hogarId && !ah.fecha_salida).length;
        if (ocupacionActual >= hogar.capacidad_maxima) {
            throw new Error(`El hogar de ${hogar.nombre_cuidador} ya alcanzó su capacidad máxima.`);
        }

        // Cerrar cualquier asignación activa previa solo después de validar el cupo receptor.
        const hoy = new Date().toISOString().split('T')[0];
        if (asignacionPrevia) {
            asignacionPrevia.fecha_salida = hoy;
        }

        const nueva = {
            id: this.generateId('ah'),
            animal_id: animalId,
            hogar_id: hogarId,
            fecha_ingreso: hoy,
            fecha_salida: null,
            observaciones
        };
        this.db.animal_hogares.unshift(nueva);

        // Actualizar estado del animal a hogar_temporal
        const animal = this.db.animales.find(a => a.id === animalId);
        if (animal && animal.estado_actual !== 'hogar_temporal') {
            animal.estado_actual = 'hogar_temporal';
            this.addEstadoHistorial(animalId, 'hogar_temporal', `Asignado a hogar temporal.`);
        }

        this.save();
        return nueva;
    }

    // =========================================================================
    // MÉTODOS: ADOPCIONES Y SEGUIMIENTO (RF-07, RF-08)
    // =========================================================================

    getAdoptantes() {
        return this.db.adoptantes;
    }

    saveAdoptante(adoptanteData) {
        if (adoptanteData.id) {
            const idx = this.db.adoptantes.findIndex(a => a.id === adoptanteData.id);
            if (idx !== -1) {
                this.db.adoptantes[idx] = { ...this.db.adoptantes[idx], ...adoptanteData };
                this.save();
                return this.db.adoptantes[idx];
            }
        } else {
            const nuevo = { ...adoptanteData, id: this.generateId('adp') };
            this.db.adoptantes.push(nuevo);
            this.save();
            return nuevo;
        }
    }

    concretarAdopcion(animalId, adoptanteId, contratoFolio, observaciones = '') {
        const hoy = new Date().toISOString().split('T')[0];
        const nuevaAdopcion = {
            id: this.generateId('adop'),
            animal_id: animalId,
            adoptante_id: adoptanteId,
            fecha_adopcion: hoy,
            contrato_folio: contratoFolio || `CONTRATO-${Date.now().toString().slice(-4)}`,
            contrato_drive_url: '',
            observaciones
        };
        this.db.adopciones.unshift(nuevaAdopcion);

        // Cerrar hogar temporal activo si existía
        const hogarActivo = this.db.animal_hogares.find(ah => ah.animal_id === animalId && !ah.fecha_salida);
        if (hogarActivo) hogarActivo.fecha_salida = hoy;

        // Actualizar estado del animal a adoptado
        this.updateEstadoAnimal(animalId, 'adoptado', `Adopción concretada. Folio: ${nuevaAdopcion.contrato_folio}`);

        // Crear primer hito de seguimiento inicial
        this.addSeguimiento({
            adopcion_id: nuevaAdopcion.id,
            animal_id: animalId,
            fecha: hoy,
            medio_contacto: 'Presencial / Entrega',
            estado_mascota: 'Excelente',
            observaciones: 'Mascota entregada al adoptante con contrato firmado y recomendaciones sanitarias.'
        });

        this.save();
        return nuevaAdopcion;
    }

    addSeguimiento(seguimientoData) {
        const nuevo = {
            ...seguimientoData,
            id: this.generateId('seg'),
            fecha: seguimientoData.fecha || new Date().toISOString().split('T')[0]
        };
        this.db.seguimientos.unshift(nuevo);
        this.save();
        return nuevo;
    }

    // =========================================================================
    // MÉTODOS: CUESTIONARIOS DE POSTULACIÓN / EVALUACIÓN (RF-07)
    // =========================================================================

    getCuestionarios(filtroEstado = 'todos') {
        if (!this.db.cuestionarios_adopcion) this.db.cuestionarios_adopcion = [];
        return this.db.cuestionarios_adopcion.filter(c => {
            return filtroEstado === 'todos' || c.estado_evaluacion === filtroEstado;
        }).sort((a, b) => new Date(b.fecha_postulacion || 0) - new Date(a.fecha_postulacion || 0));
    }

    getCuestionarioById(id) {
        if (!this.db.cuestionarios_adopcion) return null;
        return this.db.cuestionarios_adopcion.find(c => c.id === id) || null;
    }

    saveCuestionario(cuestionarioData) {
        if (!this.db.cuestionarios_adopcion) this.db.cuestionarios_adopcion = [];
        if (cuestionarioData.id) {
            const idx = this.db.cuestionarios_adopcion.findIndex(c => c.id === cuestionarioData.id);
            if (idx !== -1) {
                this.db.cuestionarios_adopcion[idx] = { ...this.db.cuestionarios_adopcion[idx], ...cuestionarioData };
                this.save();
                this.syncCloudRecord('cuestionarios_adopcion', this.db.cuestionarios_adopcion[idx]);
                return this.db.cuestionarios_adopcion[idx];
            }
        }
        const nuevo = {
            ...cuestionarioData,
            id: this.generateId('cue'),
            fecha_postulacion: cuestionarioData.fecha_postulacion || new Date().toISOString().split('T')[0],
            estado_evaluacion: cuestionarioData.estado_evaluacion || 'pendiente'
        };
        this.db.cuestionarios_adopcion.unshift(nuevo);
        this.save();
        this.syncCloudRecord('cuestionarios_adopcion', nuevo);
        return nuevo;
    }

    updateEstadoCuestionario(id, nuevoEstado, notasEvaluacion = '') {
        const item = this.getCuestionarioById(id);
        if (!item) return null;
        item.estado_evaluacion = nuevoEstado;
        if (notasEvaluacion) item.notas_evaluacion = notasEvaluacion;
        this.save();
        this.syncCloudRecord('cuestionarios_adopcion', item);
        return item;
    }

    // =========================================================================
    // MÉTODOS: GESTIÓN FINANCIERA Y GASTOS (RF-09)
    // =========================================================================

    getGastos(categoria = 'todas') {
        if (categoria === 'todas') return this.db.gastos;
        return this.db.gastos.filter(g => g.categoria === categoria);
    }

    addGasto(gastoData) {
        const nuevo = {
            ...gastoData,
            id: this.generateId('gst'),
            fecha: gastoData.fecha || new Date().toISOString().split('T')[0],
            monto: Number(gastoData.monto) || 0,
            animales_ids: Array.isArray(gastoData.animales_ids) ? gastoData.animales_ids : []
        };
        this.db.gastos.unshift(nuevo);
        this.save();
        return nuevo;
    }

    // =========================================================================
    // MÉTODOS: REPORTES Y ESTADÍSTICAS (RF-11)
    // =========================================================================

    getEstadisticasGenerales() {
        const totalRescatados = this.db.animales.length;
        const enAdopcion = this.db.animales.filter(a => a.estado_actual === 'disponible').length;
        const adoptados = this.db.animales.filter(a => a.estado_actual === 'adoptado').length;
        const enHogarTemporal = this.db.animales.filter(a => a.estado_actual === 'hogar_temporal').length;
        const enCuarentenaTratamiento = this.db.animales.filter(a => a.estado_actual === 'cuarentena' || a.estado_actual === 'rescate').length;

        const totalGastos = this.db.gastos.reduce((sum, g) => sum + (Number(g.monto) || 0), 0);
        const gastosPorCategoria = this.db.gastos.reduce((acc, g) => {
            acc[g.categoria] = (acc[g.categoria] || 0) + Number(g.monto);
            return acc;
        }, {});

        return {
            totalRescatados,
            enAdopcion,
            adoptados,
            enHogarTemporal,
            enCuarentenaTratamiento,
            tasaAdopcionPorcentaje: totalRescatados > 0 ? Math.round((adoptados / totalRescatados) * 100) : 0,
            totalGastos,
            gastosPorCategoria,
            totalHogares: this.db.hogares_temporales.length,
            totalSeguimientos: this.db.seguimientos.length
        };
    }

    // =========================================================================
    // MÉTODOS: PROYECTOS DE ESTERILIZACIÓN MASIVA (Área Funcional 2 — Ficha Técnica §5)
    // =========================================================================

    getProyectosEsterilizacion() {
        if (!this.db.proyectos_esterilizacion) return [];
        return this.db.proyectos_esterilizacion.filter(p => p.activo !== false);
    }

    getProyectoEsterilizacionById(id) {
        if (!this.db.proyectos_esterilizacion) return null;
        return this.db.proyectos_esterilizacion.find(p => p.id === id) || null;
    }

    saveProyectoEsterilizacion(data) {
        if (!this.db.proyectos_esterilizacion) this.db.proyectos_esterilizacion = [];
        if (data.id) {
            const index = this.db.proyectos_esterilizacion.findIndex(p => p.id === data.id);
            if (index !== -1) {
                this.db.proyectos_esterilizacion[index] = {
                    ...this.db.proyectos_esterilizacion[index],
                    ...data,
                    meta_animales: Number(data.meta_animales) || 0,
                    updated_at: new Date().toISOString()
                };
                this.save();
                this.syncCloudRecord('proyectos_esterilizacion', this.db.proyectos_esterilizacion[index]);
                return this.db.proyectos_esterilizacion[index];
            }
        }
        const nuevo = {
            ...data,
            id: this.generateId('proy-est'),
            meta_animales: Number(data.meta_animales) || 0,
            estado: data.estado || 'Planificado',
            activo: true,
            created_at: new Date().toISOString()
        };
        this.db.proyectos_esterilizacion.unshift(nuevo);
        this.save();
        this.syncCloudRecord('proyectos_esterilizacion', nuevo);
        return nuevo;
    }

    deleteProyectoEsterilizacion(id) {
        const proyecto = this.getProyectoEsterilizacionById(id);
        if (proyecto) {
            proyecto.activo = false;
            this.save();
            this.syncCloudRecord('proyectos_esterilizacion', proyecto);
            return true;
        }
        return false;
    }

    getAnimalesEsterilizacion(proyectoId = null) {
        if (!this.db.animales_esterilizacion) return [];
        let list = this.db.animales_esterilizacion.filter(a => a.activo !== false);
        if (proyectoId) {
            list = list.filter(a => a.proyecto_id === proyectoId);
        }
        return list;
    }

    getAnimalEsterilizacionById(id) {
        if (!this.db.animales_esterilizacion) return null;
        return this.db.animales_esterilizacion.find(a => a.id === id) || null;
    }

    saveAnimalEsterilizacion(data) {
        if (!this.db.animales_esterilizacion) this.db.animales_esterilizacion = [];
        if (data.id) {
            const index = this.db.animales_esterilizacion.findIndex(a => a.id === data.id);
            if (index !== -1) {
                this.db.animales_esterilizacion[index] = {
                    ...this.db.animales_esterilizacion[index],
                    ...data,
                    updated_at: new Date().toISOString()
                };
                this.save();
                this.syncCloudRecord('animales_esterilizacion', this.db.animales_esterilizacion[index]);
                return this.db.animales_esterilizacion[index];
            }
        }
        const correlativo = this.getAnimalesEsterilizacion(data.proyecto_id).length + 1;
        const codigoAuto = data.codigo_operativo || `OP-${String(correlativo).padStart(3, '0')}`;
        const nuevo = {
            ...data,
            id: this.generateId('anim-est'),
            codigo_operativo: codigoAuto,
            fecha_intervencion: data.fecha_intervencion || new Date().toISOString().split('T')[0],
            estado_post: data.estado_post || 'Retornado a su sector',
            activo: true,
            created_at: new Date().toISOString()
        };
        this.db.animales_esterilizacion.push(nuevo);
        this.save();
        this.syncCloudRecord('animales_esterilizacion', nuevo);
        return nuevo;
    }

    deleteAnimalEsterilizacion(id) {
        if (!this.db.animales_esterilizacion) return false;
        const item = this.db.animales_esterilizacion.find(a => a.id === id);
        if (item) {
            item.activo = false;
            this.save();
            return true;
        }
        return false;
    }

    getEstadisticasEsterilizacion() {
        const proyectos = this.getProyectosEsterilizacion();
        const animales = this.getAnimalesEsterilizacion();
        const totalCaninos = animales.filter(a => a.especie === 'Canino').length;
        const totalFelinos = animales.filter(a => a.especie === 'Felino').length;
        const totalMachos = animales.filter(a => a.sexo === 'Macho').length;
        const totalHembras = animales.filter(a => a.sexo === 'Hembra').length;
        const totalConMicrochip = animales.filter(a => a.microchip && String(a.microchip).trim() !== '').length;
        const totalMeta = proyectos.reduce((sum, p) => sum + (Number(p.meta_animales) || 0), 0);
        const porcentajeCumplimiento = totalMeta > 0 ? Math.round((animales.length / totalMeta) * 100) : 0;

        return {
            totalOperativos: proyectos.length,
            totalAnimales: animales.length,
            totalCaninos,
            totalFelinos,
            totalMachos,
            totalHembras,
            totalConMicrochip,
            totalMeta,
            porcentajeCumplimiento
        };
    }

    // =========================================================================
    // RESPALDOS Y EXPORTACIÓN / IMPORTACIÓN (JSON)
    // =========================================================================

    /**
     * Exporta toda la base de datos a un archivo JSON descargable
     */
    exportBackupJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.db, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `respaldo_fundacion_amor_cuatro_patas_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    /**
     * Importa datos desde un archivo JSON y actualiza la base de datos
     */
    importBackupJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.animales && Array.isArray(parsed.animales)) {
                this.db = parsed;
                this.save();
                return true;
            }
            return false;
        } catch (e) {
            console.error('[DB] Error importando JSON:', e);
            return false;
        }
    }
}

// Instancia global del Data Access Layer exportada en window para acceso desde módulos
window.DB = new DatabaseManager();
console.log('✅ [Base de Datos Fundación] Motor relacional inicializado correctamente.');
