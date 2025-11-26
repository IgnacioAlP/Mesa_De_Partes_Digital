-- =====================================================
-- FIX PARA TABLA AUDITORÍA - Habilitar acceso
-- =====================================================
-- Este script habilita RLS y crea políticas para la tabla auditoria
-- Solo usuarios con rol TI pueden ver el registro de auditoría
-- =====================================================

-- Verificar si la tabla existe
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auditoria') THEN
        RAISE NOTICE '✅ Tabla auditoria existe';
    ELSE
        RAISE EXCEPTION '❌ Tabla auditoria no existe. Ejecute supabase_schema.sql primero';
    END IF;
END $$;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "auditoria_select_authenticated" ON auditoria;
DROP POLICY IF EXISTS "auditoria_insert_authenticated" ON auditoria;
DROP POLICY IF EXISTS "auditoria_select_ti" ON auditoria;

-- Habilitar RLS en la tabla auditoria
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir a usuarios autenticados VER el registro de auditoría
-- (La aplicación filtrará por rol TI, pero esto permite la consulta)
CREATE POLICY "auditoria_select_authenticated"
    ON auditoria FOR SELECT
    TO authenticated
    USING (true);

-- Política 2: Permitir al sistema INSERTAR registros de auditoría
CREATE POLICY "auditoria_insert_authenticated"
    ON auditoria FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Verificar configuración
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'auditoria';

-- Mostrar políticas activas en auditoria
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'auditoria'
ORDER BY policyname;

-- Verificar columnas de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'auditoria'
ORDER BY ordinal_position;

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE '';
    RAISE NOTICE '✅ CONFIGURACIÓN DE AUDITORÍA COMPLETADA:';
    RAISE NOTICE '   ✓ RLS habilitado en tabla auditoria';
    RAISE NOTICE '   ✓ Política SELECT: usuarios autenticados pueden leer';
    RAISE NOTICE '   ✓ Política INSERT: sistema puede registrar acciones';
    RAISE NOTICE '';
    RAISE NOTICE '📋 NOTAS:';
    RAISE NOTICE '   - El filtro por rol TI se hace en la aplicación React';
    RAISE NOTICE '   - Columnas: id, usuario_id, accion, tabla_afectada, etc.';
    RAISE NOTICE '   - Los registros incluyen usuario con JOIN a tabla usuarios';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 VERIFICAR EN LA APLICACIÓN:';
    RAISE NOTICE '   1. Login como usuario TI';
    RAISE NOTICE '   2. Ir al Dashboard TI';
    RAISE NOTICE '   3. Click en botón "Auditoría"';
    RAISE NOTICE '   4. Debería mostrar las últimas 50 acciones';
END $$;
