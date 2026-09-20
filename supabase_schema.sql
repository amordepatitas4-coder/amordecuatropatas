-- ==============================================================================
-- PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas (A+S)
-- ARCHIVO: supabase_schema.sql
-- DESCRIPCIÓN: Esquema Relacional Completo para PostgreSQL / Supabase
-- 
-- Cumple con:
-- 1. Tablas relacionales con claves primarias, foráneas e integridad referencial.
-- 2. Principio de trazabilidad (sin borrado físico / soft delete).
-- 3. Políticas de seguridad RLS (Row Level Security) para usuarias autenticadas.
-- 4. Datos semilla iniciales (Seed Data).
-- ==============================================================================

-- 0. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0.1 USUARIAS AUTORIZADAS (vinculadas con Supabase Auth)
CREATE TABLE IF NOT EXISTS public.usuarios_autorizados (
    auth_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('presidenta', 'tesorera')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.es_usuario_autorizado()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.usuarios_autorizados ua
        WHERE ua.auth_user_id = auth.uid() AND ua.activo = TRUE
    );
$$;

-- 1. TABLA: ANIMALES (Entidad Central del Sistema)
CREATE TABLE IF NOT EXISTS public.animales (
    id TEXT PRIMARY KEY DEFAULT ('anim-' || substr(md5(random()::text), 1, 8)),
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL DEFAULT 'Canino', -- Canino, Felino, Otro
    raza VARCHAR(100) DEFAULT 'Mestizo',
    sexo VARCHAR(20) NOT NULL, -- Hembra, Macho
    edad_aprox VARCHAR(50),
    peso_kg NUMERIC(5, 2) DEFAULT 0.0,
    tamano VARCHAR(30) DEFAULT 'Mediano', -- Pequeño, Mediano, Grande
    estado_actual VARCHAR(50) NOT NULL DEFAULT 'rescate', 
    -- Estados permitidos: rescate, cuarentena, hogar_temporal, disponible, evaluacion, adoptado
    descripcion TEXT,
    personalidad TEXT,
    foto_operativa_url TEXT,
    foto_secundaria_url TEXT,
    esterilizado VARCHAR(30) NOT NULL DEFAULT 'pendiente', -- 'si', 'no', 'pendiente'
    microchip VARCHAR(50), -- Código oficial Registro Nacional Ley 21.020
    nivel_energia VARCHAR(30) DEFAULT 'Medio', -- 'Bajo', 'Medio', 'Alto'
    sociable_ninos BOOLEAN DEFAULT TRUE,
    sociable_perros BOOLEAN DEFAULT TRUE,
    sociable_gatos BOOLEAN DEFAULT FALSE,
    drive_multimedia_url TEXT,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE, -- Trazabilidad: nunca se elimina
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: HISTORIAL DE ESTADOS (Trazabilidad del flujo de rescate)
CREATE TABLE IF NOT EXISTS public.historial_estados (
    id TEXT PRIMARY KEY DEFAULT ('est-' || substr(md5(random()::text), 1, 8)),
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    estado VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    observaciones TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: HISTORIAL SANITARIO (RF-04: Atenciones clínicas)
CREATE TABLE IF NOT EXISTS public.historial_sanitario (
    id TEXT PRIMARY KEY DEFAULT ('san-' || substr(md5(random()::text), 1, 8)),
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo_evento VARCHAR(60) NOT NULL, 
    -- Desparasitación, Vacunación, Control veterinario, Esterilización, Tratamiento
    descripcion TEXT NOT NULL,
    veterinario VARCHAR(120),
    proximo_control DATE,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: HOGARES TEMPORALES (RF-05: Familias de acogida)
CREATE TABLE IF NOT EXISTS public.hogares_temporales (
    id TEXT PRIMARY KEY DEFAULT ('hog-' || substr(md5(random()::text), 1, 8)),
    nombre_cuidador VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    tipo_vivienda VARCHAR(80), -- Casa con patio, Departamento, Parcela
    capacidad_maxima INT NOT NULL DEFAULT 1 CHECK (capacidad_maxima > 0),
    notas TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA: ANIMAL_HOGARES (Historial de estancias en hogares)
CREATE TABLE IF NOT EXISTS public.animal_hogares (
    id TEXT PRIMARY KEY DEFAULT ('ah-' || substr(md5(random()::text), 1, 8)),
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    hogar_id TEXT NOT NULL REFERENCES public.hogares_temporales(id) ON DELETE RESTRICT,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_salida DATE, -- NULL indica que la mascota permanece actualmente en este hogar
    observaciones TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_animal_hogar_activo
    ON public.animal_hogares (animal_id)
    WHERE fecha_salida IS NULL;

CREATE OR REPLACE FUNCTION public.validar_capacidad_hogar()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    limite INT;
    ocupacion INT;
BEGIN
    IF NEW.fecha_salida IS NOT NULL THEN
        RETURN NEW;
    END IF;

    SELECT capacidad_maxima INTO limite
    FROM public.hogares_temporales
    WHERE id = NEW.hogar_id
    FOR UPDATE;

    SELECT COUNT(*) INTO ocupacion
    FROM public.animal_hogares
    WHERE hogar_id = NEW.hogar_id
      AND fecha_salida IS NULL
      AND id IS DISTINCT FROM NEW.id;

    IF ocupacion >= limite THEN
        RAISE EXCEPTION 'El hogar temporal alcanzó su capacidad máxima';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_capacidad_hogar ON public.animal_hogares;
CREATE TRIGGER trg_validar_capacidad_hogar
    BEFORE INSERT OR UPDATE OF hogar_id, fecha_salida ON public.animal_hogares
    FOR EACH ROW EXECUTE FUNCTION public.validar_capacidad_hogar();

-- 6. TABLA: ADOPTANTES (RF-07: Personas postulantes y evaluadas)
CREATE TABLE IF NOT EXISTS public.adoptantes (
    id TEXT PRIMARY KEY DEFAULT ('adp-' || substr(md5(random()::text), 1, 8)),
    rut VARCHAR(20),
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(120),
    direccion TEXT,
    evaluacion_estado VARCHAR(50) DEFAULT 'aprobado',
    notas TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.1 TABLA: CUESTIONARIOS DE ADOPCIÓN (RF-07: Evaluación de postulantes / Tenencia Responsable)
CREATE TABLE IF NOT EXISTS public.cuestionarios_adopcion (
    id TEXT PRIMARY KEY DEFAULT ('cue-' || substr(md5(random()::text), 1, 8)),
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    nombre_postulante VARCHAR(150) NOT NULL,
    rut VARCHAR(20),
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(120),
    direccion TEXT,
    tipo_vivienda VARCHAR(80), -- Casa con patio cerrado, Casa sin patio, Departamento
    tiene_patio_cerrado BOOLEAN DEFAULT TRUE,
    acuerdo_familia BOOLEAN DEFAULT TRUE,
    presupuesto_veterinario BOOLEAN DEFAULT TRUE,
    experiencia_previa TEXT,
    motivo_adopcion TEXT,
    estado_evaluacion VARCHAR(30) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
    notas_evaluacion TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA: ADOPCIONES (RF-07: Contratos formalizados)
CREATE TABLE IF NOT EXISTS public.adopciones (
    id TEXT PRIMARY KEY DEFAULT ('adop-' || substr(md5(random()::text), 1, 8)),
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    adoptante_id TEXT NOT NULL REFERENCES public.adoptantes(id) ON DELETE RESTRICT,
    fecha_adopcion DATE NOT NULL DEFAULT CURRENT_DATE,
    contrato_folio VARCHAR(80) NOT NULL,
    contrato_drive_url TEXT,
    observaciones TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA: SEGUIMIENTOS POST-ADOPCIÓN (RF-08: Bitácora acumulativa)
CREATE TABLE IF NOT EXISTS public.seguimientos (
    id TEXT PRIMARY KEY DEFAULT ('seg-' || substr(md5(random()::text), 1, 8)),
    adopcion_id TEXT NOT NULL REFERENCES public.adopciones(id) ON DELETE CASCADE,
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    medio_contacto VARCHAR(60) NOT NULL, -- WhatsApp, Llamada, Visita, Email
    estado_mascota VARCHAR(60) NOT NULL, -- Excelente, Muy Bien, En Adaptación, Con Observaciones
    observaciones TEXT NOT NULL,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA: GASTOS (RF-09: Finanzas de la Fundación)
CREATE TABLE IF NOT EXISTS public.gastos (
    id TEXT PRIMARY KEY DEFAULT ('gst-' || substr(md5(random()::text), 1, 8)),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    concepto VARCHAR(200) NOT NULL,
    categoria VARCHAR(60) NOT NULL, -- veterinaria, alimento, medicamentos, transporte, insumos_generales
    monto NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    tipo_asignacion VARCHAR(50) NOT NULL, -- animal_unico, multiples_animales, general_fundacion
    comprobante_url TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9.1 RELACIÓN NORMALIZADA ENTRE GASTOS Y ANIMALES
CREATE TABLE IF NOT EXISTS public.gasto_animales (
    gasto_id TEXT NOT NULL REFERENCES public.gastos(id) ON DELETE CASCADE,
    animal_id TEXT NOT NULL REFERENCES public.animales(id) ON DELETE RESTRICT,
    porcentaje_asignado NUMERIC(5, 2),
    PRIMARY KEY (gasto_id, animal_id),
    CHECK (porcentaje_asignado IS NULL OR (porcentaje_asignado > 0 AND porcentaje_asignado <= 100))
);

-- 10. TABLA: DOCUMENTOS DIGITALES (RF-10: Referencias en Drive)
CREATE TABLE IF NOT EXISTS public.documentos (
    id TEXT PRIMARY KEY DEFAULT ('doc-' || substr(md5(random()::text), 1, 8)),
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(60) NOT NULL, -- formulario, legal, cotizacion, comprobante, administrativo
    url TEXT NOT NULL,
    descripcion TEXT,
    animal_id TEXT REFERENCES public.animales(id) ON DELETE RESTRICT,
    adopcion_id TEXT REFERENCES public.adopciones(id) ON DELETE RESTRICT,
    gasto_id TEXT REFERENCES public.gastos(id) ON DELETE RESTRICT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLA: PROYECTOS DE ESTERILIZACIÓN MASIVA (ÁREA FUNCIONAL 2 — FICHA TÉCNICA §5)
CREATE TABLE IF NOT EXISTS public.proyectos_esterilizacion (
    id TEXT PRIMARY KEY DEFAULT ('proy-est-' || substr(md5(random()::text), 1, 8)),
    nombre VARCHAR(200) NOT NULL,
    sector VARCHAR(250) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    veterinario_responsable VARCHAR(150),
    entidad_financiamiento VARCHAR(150),
    meta_animales INTEGER DEFAULT 30,
    estado VARCHAR(50) DEFAULT 'Planificado', -- Planificado, En Ejecución, Finalizado
    drive_folder_url TEXT,
    notas TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. TABLA: ANIMALES ATENDIDOS EN OPERATIVOS DE ESTERILIZACIÓN MASIVA
CREATE TABLE IF NOT EXISTS public.animales_esterilizacion (
    id TEXT PRIMARY KEY DEFAULT ('anim-est-' || substr(md5(random()::text), 1, 8)),
    proyecto_id TEXT NOT NULL REFERENCES public.proyectos_esterilizacion(id) ON DELETE CASCADE,
    codigo_operativo VARCHAR(50) NOT NULL,
    especie VARCHAR(20) NOT NULL, -- Canino, Felino
    sexo VARCHAR(20) NOT NULL, -- Macho, Hembra
    descripcion_color VARCHAR(200) NOT NULL,
    tutor_vecino VARCHAR(150),
    telefono_contacto VARCHAR(50),
    microchip VARCHAR(15),
    fecha_intervencion DATE NOT NULL DEFAULT CURRENT_DATE,
    estado_post VARCHAR(50) NOT NULL DEFAULT 'Retornado a su sector', -- Retornado a su sector, En observación temporal, Derivado a rescate
    observaciones TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ==============================================================================
ALTER TABLE public.animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_sanitario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hogares_temporales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_hogares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoptantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuestionarios_adopcion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adopciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seguimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gasto_animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos_esterilizacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animales_esterilizacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_autorizados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso total a proyectos de esterilización" ON public.proyectos_esterilizacion
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total a animales de esterilización" ON public.animales_esterilizacion
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Consultar perfil propio" ON public.usuarios_autorizados
    FOR SELECT USING (auth_user_id = auth.uid());

-- Acceso permitido para usuarias autenticadas de la Fundación
CREATE POLICY "Permitir acceso total a usuarias autenticadas" ON public.animales
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total estados" ON public.historial_estados
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total salud" ON public.historial_sanitario
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total hogares" ON public.hogares_temporales
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total asignaciones hogar" ON public.animal_hogares
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total adoptantes" ON public.adoptantes
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total cuestionarios" ON public.cuestionarios_adopcion
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total adopciones" ON public.adopciones
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total seguimientos" ON public.seguimientos
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total gastos" ON public.gastos
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total documentos" ON public.documentos
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

CREATE POLICY "Permitir acceso total relaciones de gastos" ON public.gasto_animales
    FOR ALL USING (public.es_usuario_autorizado()) WITH CHECK (public.es_usuario_autorizado());

-- ==============================================================================
-- DATOS SEMILLA (Seed Data)
-- ==============================================================================
INSERT INTO public.animales (id, nombre, especie, raza, sexo, edad_aprox, peso_kg, tamano, estado_actual, descripcion, personalidad, foto_operativa_url, fecha_ingreso)
VALUES 
('anim-001', 'Luna', 'Canino', 'Mestiza', 'Hembra', '1 año 4 meses', 14.5, 'Mediano', 'disponible', 'Rescatada en la carretera con signos de desnutrición. Sociable y juguetona.', 'Tranquila con niños y cariñosa.', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', '2026-06-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.animales (id, nombre, especie, raza, sexo, edad_aprox, peso_kg, tamano, estado_actual, descripcion, personalidad, foto_operativa_url, fecha_ingreso)
VALUES 
('anim-002', 'Rocky', 'Canino', 'Quiltro / Cruce Pastor', 'Macho', '3 años', 22.0, 'Grande', 'hogar_temporal', 'Recuperado de herida en pata delantera izquierda.', 'Guardián, leal y obediente.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', '2026-07-02')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.animales (id, nombre, especie, raza, sexo, edad_aprox, peso_kg, tamano, estado_actual, descripcion, personalidad, foto_operativa_url, fecha_ingreso)
VALUES 
('anim-003', 'Mimi', 'Felino', 'Común Europeo', 'Hembra', '8 meses', 3.2, 'Pequeño', 'adoptado', 'Rescatada de una techumbre a los 2 meses.', 'Curiosa y ronroneadora.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', '2026-05-15')
ON CONFLICT (id) DO NOTHING;

-- Registro en historial de estados inicial
INSERT INTO public.historial_estados (animal_id, estado, observaciones)
VALUES 
('anim-001', 'rescate', 'Ingreso inicial por aviso comunitario.'),
('anim-001', 'disponible', 'Vacunación y esterilización al día.'),
('anim-002', 'hogar_temporal', 'Asignado a hogar temporal para recuperación.')
ON CONFLICT DO NOTHING;

-- Historial sanitario inicial
INSERT INTO public.historial_sanitario (animal_id, fecha, tipo_evento, descripcion, veterinario)
VALUES 
('anim-001', '2026-06-25', 'Vacunación', 'Vacuna Óctuple canina + Antirrábica.', 'Dr. Felipe Soto'),
('anim-001', '2026-07-05', 'Esterilización', 'Ovariohisterectomía sin complicaciones.', 'Clínica Veterinaria Central')
ON CONFLICT DO NOTHING;

-- Hogares temporales
INSERT INTO public.hogares_temporales (id, nombre_cuidador, telefono, direccion, tipo_vivienda, capacidad_maxima, notas)
VALUES 
('hog-001', 'Marta Valenzuela', '+56 9 8765 4321', 'Av. Las Palmas 450, Talca', 'Casa con patio cerrado', 2, 'Disponible para cachorros.'),
('hog-002', 'Carlos Sepúlveda', '+56 9 7654 3210', 'Calle Los Notros 123, Maule', 'Parcela', 3, 'Ideal para perros grandes.')
ON CONFLICT (id) DO NOTHING;

-- Gastos iniciales
INSERT INTO public.gastos (id, fecha, concepto, categoria, monto, tipo_asignacion)
VALUES 
('gst-001', '2026-06-12', 'Atención de urgencia y desparasitación Luna', 'veterinaria', 35000, 'animal_unico'),
('gst-002', '2026-07-05', 'Cirugía de esterilización Luna', 'veterinaria', 60000, 'animal_unico'),
('gst-003', '2026-07-01', 'Saco alimento perros 20kg', 'alimento', 48990, 'multiples_animales')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gasto_animales (gasto_id, animal_id, porcentaje_asignado)
VALUES
('gst-001', 'anim-001', 100),
('gst-002', 'anim-001', 100),
('gst-003', 'anim-001', 50),
('gst-003', 'anim-002', 50)
ON CONFLICT (gasto_id, animal_id) DO NOTHING;

-- Documentos iniciales
INSERT INTO public.documentos (titulo, categoria, url, descripcion)
VALUES 
('Formulario de Solicitud de Adopción (Plantilla)', 'formulario', 'https://drive.google.com/file/d/formulario_oficial', 'Cuestionario de 15 preguntas.'),
('Contrato Modelo de Compromiso de Adopción', 'legal', 'https://drive.google.com/file/d/contrato_modelo', 'Documento legal firmado por adoptante.')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- TAREA AUTOMATIZADA DE DISPONIBILIDAD (KEEP-ALIVE DIARIO)
-- Previene la suspensión automática por inactividad (pausa de 7 días de Supabase)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programa una consulta ligera diaria a las 05:00 UTC (02:00 AM hora local)
SELECT cron.schedule(
    'keep-alive-diario-fundacion',
    '0 5 * * *',
    $$ SELECT count(*) FROM public.animales WHERE activo = true; $$
);
