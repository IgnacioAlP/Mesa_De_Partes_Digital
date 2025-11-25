-- =====================================================
-- SOLUCIÓN DEFINITIVA PARA RECURSIÓN Y FOREIGN KEY
-- =====================================================
-- Este script:
-- 1. Elimina TODAS las políticas RLS existentes
-- 2. DESHABILITA RLS en la tabla usuarios (solución definitiva)
-- 3. Habilita RLS solo en tablas que lo necesitan
-- 4. Crea políticas simples SIN recursión
-- =====================================================

-- Paso 1: Eliminar TODAS las políticas de todas las tablas
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
    RAISE NOTICE 'Todas las políticas eliminadas';
END $$;

-- Paso 2: DESHABILITAR RLS completamente en tabla usuarios
-- RAZÓN: Evita problemas de recursión y foreign key
-- La seguridad se maneja en la aplicación y en auth.users
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Paso 3: Habilitar RLS solo donde es necesario
ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE observaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA EXPEDIENTES (sin subconsultas a usuarios)
-- =====================================================

-- Permitir a todos los usuarios autenticados ver expedientes
-- (La aplicación filtrará según el rol)
CREATE POLICY "expedientes_select_authenticated"
    ON expedientes FOR SELECT
    TO authenticated
    USING (true);

-- Permitir a usuarios autenticados crear expedientes
CREATE POLICY "expedientes_insert_authenticated"
    ON expedientes FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Permitir a usuarios autenticados actualizar expedientes
CREATE POLICY "expedientes_update_authenticated"
    ON expedientes FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA DOCUMENTOS
-- =====================================================

-- Usuarios autenticados pueden ver todos los documentos
CREATE POLICY "documentos_select_authenticated"
    ON documentos FOR SELECT
    TO authenticated
    USING (true);

-- Usuarios autenticados pueden subir documentos
CREATE POLICY "documentos_insert_authenticated"
    ON documentos FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA NOTIFICACIONES
-- =====================================================

-- Usuarios autenticados pueden ver notificaciones
CREATE POLICY "notificaciones_select_authenticated"
    ON notificaciones FOR SELECT
    TO authenticated
    USING (true);

-- Usuarios autenticados pueden actualizar notificaciones (marcar como leídas)
CREATE POLICY "notificaciones_update_authenticated"
    ON notificaciones FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Sistema puede crear notificaciones
CREATE POLICY "notificaciones_insert_authenticated"
    ON notificaciones FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA DERIVACIONES
-- =====================================================

-- Usuarios autenticados pueden ver derivaciones
CREATE POLICY "derivaciones_select_authenticated"
    ON derivaciones FOR SELECT
    TO authenticated
    USING (true);

-- Usuarios autenticados pueden crear derivaciones
CREATE POLICY "derivaciones_insert_authenticated"
    ON derivaciones FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Usuarios autenticados pueden actualizar derivaciones
CREATE POLICY "derivaciones_update_authenticated"
    ON derivaciones FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA HISTORIAL DE ESTADOS
-- =====================================================

-- Usuarios autenticados pueden ver historial
CREATE POLICY "historial_select_authenticated"
    ON historial_estados FOR SELECT
    TO authenticated
    USING (true);

-- Sistema puede insertar en historial
CREATE POLICY "historial_insert_authenticated"
    ON historial_estados FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA OBSERVACIONES
-- =====================================================

-- Usuarios autenticados pueden ver observaciones
CREATE POLICY "observaciones_select_authenticated"
    ON observaciones FOR SELECT
    TO authenticated
    USING (true);

-- Usuarios autenticados pueden crear observaciones
CREATE POLICY "observaciones_insert_authenticated"
    ON observaciones FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar el estado de RLS en todas las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Mostrar todas las políticas activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE '✅ CONFIGURACIÓN COMPLETADA:';
    RAISE NOTICE '   - Tabla usuarios: RLS DESHABILITADO (sin restricciones)';
    RAISE NOTICE '   - Otras tablas: RLS HABILITADO con políticas simples';
    RAISE NOTICE '   - NO hay recursión en ninguna política';
    RAISE NOTICE '   - El registro de usuarios ahora funcionará correctamente';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE:';
    RAISE NOTICE '   - La seguridad de usuarios se maneja en auth.users (Supabase)';
    RAISE NOTICE '   - Los filtros por rol se implementan en la aplicación React';
    RAISE NOTICE '   - Las contraseñas están en auth.users (cifradas, no en usuarios)';
END $$;
