-- =====================================================
-- CONSULTAS ÚTILES PARA GESTIÓN DE USUARIOS EN SUPABASE
-- =====================================================

-- 1. VER TODOS LOS USUARIOS REGISTRADOS (con email pero SIN contraseña)
-- La contraseña NUNCA es visible, está cifrada en auth.users
SELECT 
    u.id,
    u.nombres,
    u.apellidos,
    u.dni,
    u.email,
    u.telefono,
    u.rol,
    u.estado,
    u.area_asignada,
    u.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at
FROM usuarios u
LEFT JOIN auth.users au ON u.auth_user_id = au.id
ORDER BY u.created_at DESC;

-- 2. VER SOLO LOS EMAILS DE USUARIOS EN auth.users
-- Puedes ver el email pero NO la contraseña
SELECT 
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at,
    confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 3. RESETEAR LA CONTRASEÑA DE UN USUARIO
-- Ejecuta esto y Supabase enviará un email de recuperación al usuario
-- Reemplaza 'usuario@ejemplo.com' con el email real
-- Nota: Esto requiere que tengas configurado el email en Supabase
-- SELECT extensions.email('usuario@ejemplo.com', 'Recuperar contraseña', 'Usa el panel de Supabase');

-- 4. CAMBIAR CONTRASEÑA DIRECTAMENTE (requiere permisos de servicio)
-- NO RECOMENDADO - Es mejor usar el flujo de recuperación normal
-- Esto solo funciona si tienes acceso al service_role_key
-- UPDATE auth.users 
-- SET encrypted_password = crypt('nueva_contraseña', gen_salt('bf'))
-- WHERE email = 'usuario@ejemplo.com';

-- 5. VER USUARIOS QUE NO HAN CONFIRMADO SU EMAIL
SELECT 
    u.nombres,
    u.apellidos,
    u.email,
    u.created_at,
    au.email_confirmed_at
FROM usuarios u
LEFT JOIN auth.users au ON u.auth_user_id = au.id
WHERE au.email_confirmed_at IS NULL
ORDER BY u.created_at DESC;

-- 6. VER ÚLTIMO ACCESO DE USUARIOS
SELECT 
    u.nombres,
    u.apellidos,
    u.email,
    u.rol,
    au.last_sign_in_at,
    EXTRACT(DAY FROM (NOW() - au.last_sign_in_at)) as dias_sin_acceso
FROM usuarios u
LEFT JOIN auth.users au ON u.auth_user_id = au.id
WHERE au.last_sign_in_at IS NOT NULL
ORDER BY au.last_sign_in_at DESC;

-- =====================================================
-- CREAR USUARIOS DE PRUEBA CON CONTRASEÑAS CONOCIDAS
-- =====================================================
-- IMPORTANTE: Usa estas consultas solo en desarrollo/testing
-- NO las uses en producción con contraseñas reales

-- Para crear usuarios de prueba, usa el panel de Supabase:
-- 1. Ve a Authentication > Users
-- 2. Haz clic en "Add user"
-- 3. Ingresa email y contraseña
-- 4. Luego crea el registro en la tabla usuarios con ese auth_user_id

-- O usa la API de Supabase desde tu aplicación React:
-- const { data, error } = await supabase.auth.signUp({
--   email: 'test@ejemplo.com',
--   password: 'contraseña123'
-- })

-- =====================================================
-- USUARIOS DE PRUEBA RECOMENDADOS
-- =====================================================
/*
Para desarrollo, crea estos usuarios con contraseñas conocidas:

1. Usuario Ciudadano:
   Email: ciudadano@mochumi.gob.pe
   Contraseña: Ciudadano123!
   Rol: ciudadano

2. Usuario Mesa de Partes:
   Email: mesapartes@mochumi.gob.pe
   Contraseña: MesaPartes123!
   Rol: mesa_partes

3. Usuario TI (Administrador):
   Email: ti@mochumi.gob.pe
   Contraseña: TI_Admin123!
   Rol: ti

4. Usuario Alcalde:
   Email: alcalde@mochumi.gob.pe
   Contraseña: Alcalde123!
   Rol: alcalde

IMPORTANTE: Cambia estas contraseñas en producción
*/

-- =====================================================
-- BUENAS PRÁCTICAS DE SEGURIDAD
-- =====================================================
/*
1. NUNCA almacenes contraseñas en texto plano
2. NUNCA intentes recuperar la contraseña cifrada
3. USA el flujo de "Olvidé mi contraseña" de Supabase
4. Implementa autenticación de dos factores (2FA) en producción
5. Usa contraseñas fuertes (mínimo 8 caracteres, mayúsculas, números, símbolos)
6. Expira las sesiones después de inactividad
7. Registra intentos fallidos de login (implementa en la app)
*/

-- =====================================================
-- CÓMO RECUPERAR ACCESO SI OLVIDASTE LA CONTRASEÑA
-- =====================================================
/*
OPCIÓN 1: Desde la aplicación (Usuario final)
- Clic en "¿Olvidaste tu contraseña?"
- Ingresa tu email
- Revisa tu correo
- Clic en el enlace de recuperación
- Ingresa nueva contraseña

OPCIÓN 2: Desde Supabase (Administrador)
1. Ve a: https://supabase.com/dashboard/project/kwwsnzkojqqoaydebfan/auth/users
2. Busca el usuario por email
3. Haz clic en los tres puntos (...)
4. Selecciona "Send recovery email"
5. El usuario recibirá un email para cambiar su contraseña

OPCIÓN 3: Eliminar y recrear usuario (último recurso)
1. Elimina el usuario de auth.users
2. El usuario en la tabla usuarios se eliminará automáticamente (CASCADE)
3. Pide al usuario que se registre nuevamente
*/

-- =====================================================
-- VERIFICAR CONFIGURACIÓN DE AUTENTICACIÓN
-- =====================================================

-- Ver proveedores de autenticación habilitados
-- Esto solo funciona con permisos de admin
-- SELECT * FROM auth.config;

-- Ver si hay rate limiting activo
-- Esto protege contra ataques de fuerza bruta
-- SELECT * FROM auth.rate_limits;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
/*
1. Las contraseñas están cifradas con bcrypt
2. Supabase usa JWT tokens para mantener sesiones
3. Los tokens expiran después de 1 hora por defecto
4. Puedes configurar el tiempo de expiración en el dashboard
5. La tabla auth.users es manejada internamente por Supabase
6. Solo puedes acceder a auth.users con el service_role_key
7. Desde la aplicación cliente, NO tienes acceso directo a auth.users
8. La tabla usuarios (public) solo tiene datos de perfil, NO contraseñas
*/
