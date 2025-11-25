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
ALTER TABLE derivaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE observaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA USUARIOS (sin recursión)
-- =====================================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "usuarios_select_own"
    ON usuarios FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Los usuarios TI pueden ver todos los perfiles
CREATE POLICY "usuarios_select_ti"
    ON usuarios FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
    );

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_own"
    ON usuarios FOR UPDATE
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- TI puede actualizar cualquier usuario
CREATE POLICY "usuarios_update_ti"
    ON usuarios FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
    );

-- TI puede insertar nuevos usuarios
CREATE POLICY "usuarios_insert_ti"
    ON usuarios FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
        OR NOT EXISTS (SELECT 1 FROM usuarios WHERE auth_user_id = auth.uid())
    );

-- =====================================================
-- POLÍTICAS PARA EXPEDIENTES
-- =====================================================

-- Ciudadanos pueden ver sus propios expedientes
CREATE POLICY "expedientes_select_own"
    ON expedientes FOR SELECT
    USING (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Personal municipal puede ver todos los expedientes
CREATE POLICY "expedientes_select_staff"
    ON expedientes FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Ciudadanos pueden crear expedientes
CREATE POLICY "expedientes_insert_ciudadano"
    ON expedientes FOR INSERT
    WITH CHECK (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Personal de mesa de partes puede crear expedientes
CREATE POLICY "expedientes_insert_mesa_partes"
    ON expedientes FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'ti')
        )
    );

-- Personal autorizado puede actualizar expedientes
CREATE POLICY "expedientes_update_staff"
    ON expedientes FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- =====================================================
-- POLÍTICAS PARA DOCUMENTOS
-- =====================================================

-- Ciudadanos pueden ver documentos de sus expedientes
CREATE POLICY "documentos_select_own"
    ON documentos FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal municipal puede ver todos los documentos
CREATE POLICY "documentos_select_staff"
    ON documentos FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Usuarios autenticados pueden subir documentos
CREATE POLICY "documentos_insert_authenticated"
    ON documentos FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM usuarios)
    );

-- =====================================================
-- POLÍTICAS PARA NOTIFICACIONES
-- =====================================================

-- Usuarios solo ven sus propias notificaciones
CREATE POLICY "notificaciones_select_own"
    ON notificaciones FOR SELECT
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Usuarios pueden actualizar sus notificaciones (marcar como leídas)
CREATE POLICY "notificaciones_update_own"
    ON notificaciones FOR UPDATE
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Sistema puede crear notificaciones
CREATE POLICY "notificaciones_insert_system"
    ON notificaciones FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA DERIVACIONES
-- =====================================================

-- Personal puede ver derivaciones relacionadas con sus expedientes
CREATE POLICY "derivaciones_select_staff"
    ON derivaciones FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal autorizado puede crear derivaciones
CREATE POLICY "derivaciones_insert_staff"
    ON derivaciones FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal puede actualizar derivaciones
CREATE POLICY "derivaciones_update_staff"
    ON derivaciones FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- =====================================================
-- POLÍTICAS PARA HISTORIAL DE ESTADOS
-- =====================================================

-- Ciudadanos pueden ver el historial de sus expedientes
CREATE POLICY "historial_select_own"
    ON historial_estados FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal puede ver todo el historial
CREATE POLICY "historial_select_staff"
    ON historial_estados FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Sistema puede insertar en historial
CREATE POLICY "historial_insert_system"
    ON historial_estados FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA OBSERVACIONES
-- =====================================================

-- Ciudadanos pueden ver observaciones de sus expedientes
CREATE POLICY "observaciones_select_own"
    ON observaciones FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal puede ver todas las observaciones
CREATE POLICY "observaciones_select_staff"
    ON observaciones FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal puede crear observaciones
CREATE POLICY "observaciones_insert_staff"
    ON observaciones FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );
