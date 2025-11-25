-- =====================================================
-- SCRIPT PARA SINCRONIZAR USUARIOS
-- =====================================================
-- Este script sincroniza los usuarios de auth.users a la tabla usuarios
-- EJECUTA ESTO PRIMERO para arreglar el problema actual
-- =====================================================

-- Paso 1: Ver usuarios en auth.users que NO están en la tabla usuarios
SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data,
    au.created_at,
    CASE 
        WHEN u.id IS NULL THEN '❌ FALTA EN USUARIOS'
        ELSE '✅ YA EXISTE'
    END as estado
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.auth_user_id
ORDER BY au.created_at DESC;

-- Paso 2: Insertar usuarios faltantes en la tabla usuarios
-- (Sin ON CONFLICT porque auth_user_id podría no tener constraint único)
INSERT INTO public.usuarios (
    auth_user_id,
    email,
    nombres,
    apellidos,
    dni,
    telefono,
    direccion,
    rol,
    estado
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'nombres', 'Usuario'),
    COALESCE(au.raw_user_meta_data->>'apellidos', 'Temporal'),
    COALESCE(au.raw_user_meta_data->>'dni', LPAD((RANDOM() * 99999999)::BIGINT::TEXT, 8, '0')),
    au.raw_user_meta_data->>'telefono',
    au.raw_user_meta_data->>'direccion',
    COALESCE((au.raw_user_meta_data->>'rol')::user_role, 'ciudadano'),
    'activo'::user_status
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.auth_user_id
WHERE u.id IS NULL;

-- Paso 3: Verificar que todos los usuarios están sincronizados
SELECT 
    COUNT(*) as total_auth_users,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    CASE 
        WHEN COUNT(*) = (SELECT COUNT(*) FROM usuarios) THEN '✅ SINCRONIZADO'
        ELSE '❌ FALTAN USUARIOS'
    END as estado
FROM auth.users;

-- Paso 4: Ver todos los usuarios con su información completa
SELECT 
    u.id,
    u.auth_user_id,
    u.email,
    u.nombres,
    u.apellidos,
    u.dni,
    u.rol,
    u.estado,
    u.created_at
FROM usuarios u
ORDER BY u.created_at DESC;

DO $$ 
BEGIN 
    RAISE NOTICE '✅ SINCRONIZACIÓN COMPLETADA';
    RAISE NOTICE 'Ahora puedes iniciar sesión con los usuarios';
END $$;
