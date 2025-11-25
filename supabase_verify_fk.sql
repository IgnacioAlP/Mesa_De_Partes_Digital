-- =====================================================
-- SCRIPT DE VERIFICACIÓN Y SOLUCIÓN PARA FOREIGN KEY
-- =====================================================
-- Este script verifica y corrige problemas con la foreign key
-- entre usuarios.auth_user_id y auth.users.id
-- =====================================================

-- Paso 1: Verificar la constraint actual
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'usuarios';

-- Paso 2: Verificar que la columna auth_user_id existe y es del tipo correcto
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
    AND column_name = 'auth_user_id';

-- Paso 3: Verificar que no haya registros huérfanos
-- (registros en usuarios que no tienen correspondencia en auth.users)
SELECT 
    u.id,
    u.auth_user_id,
    u.email,
    u.nombres,
    u.apellidos,
    CASE 
        WHEN au.id IS NULL THEN '❌ NO EXISTE EN AUTH.USERS'
        ELSE '✅ OK'
    END as estado
FROM usuarios u
LEFT JOIN auth.users au ON u.auth_user_id = au.id
ORDER BY u.created_at DESC;

-- Paso 4: SOLUCIÓN - Eliminar la constraint problemática y recrearla
-- Solo ejecuta esto si hay problemas

-- 4.1: Eliminar constraint antigua
ALTER TABLE usuarios 
DROP CONSTRAINT IF EXISTS usuarios_auth_user_id_fkey CASCADE;

-- 4.2: Recrear constraint con ON DELETE CASCADE
ALTER TABLE usuarios
ADD CONSTRAINT usuarios_auth_user_id_fkey
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Paso 5: Verificar que la nueva constraint funciona
-- Intentar ver la estructura de la tabla
SELECT 
    a.attname AS column_name,
    format_type(a.atttypid, a.atttypmod) AS data_type,
    a.attnotnull AS not_null,
    coalesce(i.indisprimary, false) AS primary_key,
    coalesce(f.is_foreign_key, false) AS foreign_key
FROM pg_attribute a
LEFT JOIN pg_index i 
    ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) AND i.indisprimary
LEFT JOIN (
    SELECT 
        conrelid,
        unnest(conkey) AS attnum,
        true AS is_foreign_key
    FROM pg_constraint
    WHERE contype = 'f'
) f ON a.attrelid = f.conrelid AND a.attnum = f.attnum
WHERE a.attrelid = 'usuarios'::regclass
    AND a.attnum > 0
    AND NOT a.attisdropped
ORDER BY a.attnum;

-- Paso 6: Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE '✅ VERIFICACIÓN Y CORRECCIÓN COMPLETADA';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Revisa los resultados anteriores:';
    RAISE NOTICE '   1. Constraint: debe mostrar usuarios_auth_user_id_fkey';
    RAISE NOTICE '   2. Columna: debe ser tipo uuid y nullable';
    RAISE NOTICE '   3. Registros: no deben haber huérfanos';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Si hay registros huérfanos (❌), elimínalos con:';
    RAISE NOTICE '   DELETE FROM usuarios WHERE auth_user_id NOT IN (SELECT id FROM auth.users);';
END $$;
