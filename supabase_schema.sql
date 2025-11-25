-- Esquema de Base de Datos para Mesa de Partes Digital
-- Municipalidad Distrital de Mochumi

-- =====================================================
-- TABLAS DE CONFIGURACIÓN Y USUARIOS
-- =====================================================

-- Enum para roles de usuario
CREATE TYPE user_role AS ENUM ('ciudadano', 'mesa_partes', 'alcalde', 'ti', 'area_tramite');

-- Enum para estado de usuario
CREATE TYPE user_status AS ENUM ('activo', 'inactivo', 'suspendido');

-- Tabla de Usuarios extendida
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    direccion TEXT,
    rol user_role DEFAULT 'ciudadano',
    estado user_status DEFAULT 'activo',
    area_asignada VARCHAR(100), -- Para empleados municipales
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLAS DE CATÁLOGOS Y TIPOS DE TRÁMITES
-- =====================================================

-- Tabla de Tipos de Trámite
CREATE TABLE IF NOT EXISTS tipos_tramite (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    requisitos TEXT[],
    tiempo_maximo_dias INTEGER NOT NULL,
    costo DECIMAL(10, 2) DEFAULT 0.00,
    area_responsable VARCHAR(100),
    es_comun BOOLEAN DEFAULT false, -- Para mostrar en página principal
    estado VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Requisitos por Tipo de Trámite
CREATE TABLE IF NOT EXISTS requisitos_tramite (
    id SERIAL PRIMARY KEY,
    tipo_tramite_id INTEGER REFERENCES tipos_tramite(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    es_obligatorio BOOLEAN DEFAULT true,
    orden INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE TRÁMITES Y EXPEDIENTES
-- =====================================================

-- Enum para estado de expediente
CREATE TYPE expediente_estado AS ENUM (
    'registrado',
    'en_revision',
    'derivado',
    'en_proceso',
    'observado',
    'aprobado',
    'rechazado',
    'finalizado',
    'archivado'
);

-- Tabla de Expedientes
CREATE TABLE IF NOT EXISTS expedientes (
    id SERIAL PRIMARY KEY,
    numero_expediente VARCHAR(50) UNIQUE NOT NULL, -- FORMATO: EXP-2024-00001
    tipo_tramite_id INTEGER REFERENCES tipos_tramite(id),
    ciudadano_id UUID REFERENCES usuarios(id),
    asunto TEXT NOT NULL,
    descripcion TEXT,
    estado expediente_estado DEFAULT 'registrado',
    prioridad VARCHAR(20) DEFAULT 'normal', -- baja, normal, alta, urgente
    area_actual VARCHAR(100),
    responsable_actual UUID REFERENCES usuarios(id),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_limite TIMESTAMP WITH TIME ZONE,
    fecha_finalizacion TIMESTAMP WITH TIME ZONE,
    observaciones TEXT,
    requiere_respuesta BOOLEAN DEFAULT true,
    notificacion_email BOOLEAN DEFAULT true,
    notificacion_sms BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Documentos Adjuntos
CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50),
    tamano_bytes BIGINT,
    ruta_almacenamiento TEXT NOT NULL, -- URL de Supabase Storage
    descripcion TEXT,
    es_documento_original BOOLEAN DEFAULT true,
    subido_por UUID REFERENCES usuarios(id),
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE WORKFLOW Y TRAZABILIDAD
-- =====================================================

-- Tabla de Derivaciones (Workflow)
CREATE TABLE IF NOT EXISTS derivaciones (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
    area_origen VARCHAR(100),
    area_destino VARCHAR(100) NOT NULL,
    usuario_deriva UUID REFERENCES usuarios(id),
    usuario_recibe UUID REFERENCES usuarios(id),
    motivo TEXT,
    instrucciones TEXT,
    fecha_derivacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_recepcion TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, recibido, rechazado
    observaciones TEXT
);

-- Tabla de Historial de Estados
CREATE TABLE IF NOT EXISTS historial_estados (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
    estado_anterior expediente_estado,
    estado_nuevo expediente_estado NOT NULL,
    usuario_id UUID REFERENCES usuarios(id),
    area VARCHAR(100),
    comentario TEXT,
    fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Observaciones
CREATE TABLE IF NOT EXISTS observaciones (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),
    tipo VARCHAR(50) DEFAULT 'observacion', -- observacion, revision, requerimiento
    descripcion TEXT NOT NULL,
    requiere_subsanacion BOOLEAN DEFAULT false,
    fecha_limite_subsanacion TIMESTAMP WITH TIME ZONE,
    fue_subsanado BOOLEAN DEFAULT false,
    fecha_subsanacion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE NOTIFICACIONES Y COMUNICACIONES
-- =====================================================

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- cambio_estado, derivacion, observacion, alerta_vencimiento
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    enviada_email BOOLEAN DEFAULT false,
    enviada_sms BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE AUDITORÍA Y LOGS
-- =====================================================

-- Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id),
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    registro_id INTEGER,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_expedientes_numero ON expedientes(numero_expediente);
CREATE INDEX idx_expedientes_ciudadano ON expedientes(ciudadano_id);
CREATE INDEX idx_expedientes_estado ON expedientes(estado);
CREATE INDEX idx_expedientes_fecha_registro ON expedientes(fecha_registro);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_derivaciones_expediente ON derivaciones(expediente_id);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_documentos_expediente ON documentos(expediente_id);
CREATE INDEX idx_historial_expediente ON historial_estados(expediente_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expedientes_updated_at BEFORE UPDATE ON expedientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipos_tramite_updated_at BEFORE UPDATE ON tipos_tramite
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de expediente automático
CREATE OR REPLACE FUNCTION generar_numero_expediente()
RETURNS TRIGGER AS $$
DECLARE
    anio INTEGER;
    correlativo INTEGER;
BEGIN
    anio := EXTRACT(YEAR FROM NOW());
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_expediente FROM 10 FOR 5) AS INTEGER)), 0) + 1
    INTO correlativo
    FROM expedientes
    WHERE numero_expediente LIKE 'EXP-' || anio || '-%';
    
    NEW.numero_expediente := 'EXP-' || anio || '-' || LPAD(correlativo::TEXT, 5, '0');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_generar_numero_expediente
    BEFORE INSERT ON expedientes
    FOR EACH ROW
    WHEN (NEW.numero_expediente IS NULL)
    EXECUTE FUNCTION generar_numero_expediente();

-- Función para registrar cambios de estado
CREATE OR REPLACE FUNCTION registrar_cambio_estado()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO historial_estados (expediente_id, estado_anterior, estado_nuevo, comentario)
        VALUES (NEW.id, OLD.estado, NEW.estado, 'Cambio automático de estado');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_registrar_cambio_estado
    AFTER UPDATE ON expedientes
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_estado();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil"
    ON usuarios FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Los usuarios TI pueden ver todos los perfiles"
    ON usuarios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE auth_user_id = auth.uid() AND rol = 'ti'
        )
    );

-- Políticas para expedientes
CREATE POLICY "Ciudadanos pueden ver sus propios expedientes"
    ON expedientes FOR SELECT
    USING (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Personal municipal puede ver expedientes de su área"
    ON expedientes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE auth_user_id = auth.uid() 
            AND rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Políticas para documentos
CREATE POLICY "Usuarios pueden ver documentos de sus expedientes"
    ON documentos FOR SELECT
    USING (
        expediente_id IN (
            SELECT id FROM expedientes
            WHERE ciudadano_id IN (
                SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
            )
        )
        OR
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE auth_user_id = auth.uid() 
            AND rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Políticas para notificaciones
CREATE POLICY "Usuarios solo ven sus propias notificaciones"
    ON notificaciones FOR SELECT
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Usuarios pueden actualizar sus notificaciones"
    ON notificaciones FOR UPDATE
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );
