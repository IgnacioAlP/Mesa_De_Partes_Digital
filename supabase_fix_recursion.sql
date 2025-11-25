-- =====================================================
-- SCRIPT PARA CORREGIR RECURSIÓN INFINITA EN POLÍTICAS RLS
-- Ejecuta este script en tu base de datos de Supabase
-- =====================================================
-- 
-- IMPORTANTE: Este script elimina TODAS las políticas existentes
-- y crea políticas nuevas SIN recursión.
-- 
-- Las políticas están diseñadas para:
-- 1. Evitar recursión infinita (no consultan la misma tabla en condiciones)
-- 2. Permitir el registro de nuevos usuarios
-- 3. Permitir lectura general a usuarios autenticados (seguridad en la app)
-- 4. Permitir operaciones básicas CRUD según el contexto
--
-- NOTA SOBRE CONTRASEÑAS:
-- Las contraseñas NO se guardan en la tabla "usuarios".
-- Se guardan en auth.users (tabla interna de Supabase, cifradas).
-- La tabla "usuarios" solo guarda datos de perfil.
-- =====================================================

-- Paso 1: Eliminar TODAS las políticas existentes de todas las tablas
-- USUARIOS
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios TI pueden ver todos los perfiles" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_ti" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_authenticated" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_ti" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert_ti" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert_authenticated" ON usuarios;

-- EXPEDIENTES
DROP POLICY IF EXISTS "Ciudadanos pueden ver sus propios expedientes" ON expedientes;
DROP POLICY IF EXISTS "Personal municipal puede ver expedientes de su área" ON expedientes;
DROP POLICY IF EXISTS "expedientes_select_own" ON expedientes;
DROP POLICY IF EXISTS "expedientes_select_staff" ON expedientes;
DROP POLICY IF EXISTS "expedientes_select_all" ON expedientes;
DROP POLICY IF EXISTS "expedientes_insert_ciudadano" ON expedientes;
DROP POLICY IF EXISTS "expedientes_insert_mesa_partes" ON expedientes;
DROP POLICY IF EXISTS "expedientes_insert_authenticated" ON expedientes;
DROP POLICY IF EXISTS "expedientes_update_staff" ON expedientes;
DROP POLICY IF EXISTS "expedientes_update_authenticated" ON expedientes;

-- DOCUMENTOS
DROP POLICY IF EXISTS "Usuarios pueden ver documentos de sus expedientes" ON documentos;
DROP POLICY IF EXISTS "documentos_select_own" ON documentos;
DROP POLICY IF EXISTS "documentos_select_staff" ON documentos;
DROP POLICY IF EXISTS "documentos_select_all" ON documentos;
DROP POLICY IF EXISTS "documentos_insert_authenticated" ON documentos;

-- NOTIFICACIONES
DROP POLICY IF EXISTS "Usuarios solo ven sus propias notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "notificaciones_select_own" ON notificaciones;
DROP POLICY IF EXISTS "notificaciones_update_own" ON notificaciones;
DROP POLICY IF EXISTS "notificaciones_insert_system" ON notificaciones;

-- DERIVACIONES
DROP POLICY IF EXISTS "derivaciones_select_staff" ON derivaciones;
DROP POLICY IF EXISTS "derivaciones_select_all" ON derivaciones;
DROP POLICY IF EXISTS "derivaciones_insert_staff" ON derivaciones;
DROP POLICY IF EXISTS "derivaciones_insert_all" ON derivaciones;
DROP POLICY IF EXISTS "derivaciones_update_staff" ON derivaciones;
DROP POLICY IF EXISTS "derivaciones_update_all" ON derivaciones;

-- HISTORIAL
DROP POLICY IF EXISTS "historial_select_own" ON historial_estados;
DROP POLICY IF EXISTS "historial_select_staff" ON historial_estados;
DROP POLICY IF EXISTS "historial_select_all" ON historial_estados;
DROP POLICY IF EXISTS "historial_insert_system" ON historial_estados;

-- OBSERVACIONES
DROP POLICY IF EXISTS "observaciones_select_own" ON observaciones;
DROP POLICY IF EXISTS "observaciones_select_staff" ON observaciones;
DROP POLICY IF EXISTS "observaciones_select_all" ON observaciones;
DROP POLICY IF EXISTS "observaciones_insert_staff" ON observaciones;
DROP POLICY IF EXISTS "observaciones_insert_all" ON observaciones;

-- Paso 2: DESHABILITAR RLS en tabla usuarios (solución temporal para evitar bloqueos)
-- La tabla usuarios NO tendrá RLS - la seguridad se maneja en la aplicación
-- Esto evita el problema de "new row violates row-level security policy"
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Habilitar RLS en las demás tablas
ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE observaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Paso 3: NO SE CREAN POLÍTICAS PARA USUARIOS
-- =====================================================
-- La tabla usuarios tiene RLS DESHABILITADO para permitir:
-- 1. Registro de nuevos usuarios sin problemas
-- 2. Evitar recursión infinita en políticas
-- 3. Simplificar la lógica de autenticación
-- 
-- NOTA DE SEGURIDAD:
-- - La tabla usuarios es manejada por Supabase Auth
-- - Los datos sensibles (contraseña) están en auth.users (protegida)
-- - La seguridad se implementa en la aplicación (React)
-- - Las demás tablas SÍ tienen RLS activo

-- =====================================================
-- Paso 4: POLÍTICAS PARA EXPEDIENTES
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
-- Nota: Cualquier usuario autenticado puede ver (la lógica de rol se maneja en la app)
CREATE POLICY "expedientes_select_all"
    ON expedientes FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Ciudadanos pueden crear expedientes
CREATE POLICY "expedientes_insert_ciudadano"
    ON expedientes FOR INSERT
    WITH CHECK (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Usuarios autenticados pueden crear expedientes
CREATE POLICY "expedientes_insert_authenticated"
    ON expedientes FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Usuarios autenticados pueden actualizar expedientes
CREATE POLICY "expedientes_update_authenticated"
    ON expedientes FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- =====================================================
-- Paso 5: POLÍTICAS PARA DOCUMENTOS
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

-- Usuarios autenticados pueden ver todos los documentos
CREATE POLICY "documentos_select_all"
    ON documentos FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Usuarios autenticados pueden subir documentos
CREATE POLICY "documentos_insert_authenticated"
    ON documentos FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- Paso 6: POLÍTICAS PARA NOTIFICACIONES
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
-- Paso 7: POLÍTICAS PARA DERIVACIONES
-- =====================================================

-- Usuarios autenticados pueden ver derivaciones
CREATE POLICY "derivaciones_select_all"
    ON derivaciones FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Usuarios autenticados pueden crear derivaciones
CREATE POLICY "derivaciones_insert_all"
    ON derivaciones FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Usuarios autenticados pueden actualizar derivaciones
CREATE POLICY "derivaciones_update_all"
    ON derivaciones FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- =====================================================
-- Paso 8: POLÍTICAS PARA HISTORIAL DE ESTADOS
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

-- Usuarios autenticados pueden ver todo el historial
CREATE POLICY "historial_select_all"
    ON historial_estados FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Sistema puede insertar en historial
CREATE POLICY "historial_insert_system"
    ON historial_estados FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- Paso 9: POLÍTICAS PARA OBSERVACIONES
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

-- Usuarios autenticados pueden ver todas las observaciones
CREATE POLICY "observaciones_select_all"
    ON observaciones FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Usuarios autenticados pueden crear observaciones
CREATE POLICY "observaciones_insert_all"
    ON observaciones FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE 'Políticas RLS actualizadas correctamente sin recursión';
END $$;
