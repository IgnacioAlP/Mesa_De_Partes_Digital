# 🔐 Información sobre Autenticación y Contraseñas en Supabase

## ❓ ¿Dónde se guardan las contraseñas?

Las contraseñas **NO** se guardan en la tabla `usuarios`. Supabase maneja la autenticación de forma segura y separada.

### 📊 Estructura de Autenticación en Supabase:

```
auth.users (tabla de Supabase - sistema)
├── id (UUID)
├── email
├── encrypted_password ← Contraseña hasheada (no visible)
├── email_confirmed_at
├── created_at
└── ... otros campos de autenticación

public.usuarios (tu tabla - datos del usuario)
├── id (UUID)
├── auth_user_id → referencia a auth.users(id)
├── nombres
├── apellidos
├── dni
├── rol
└── ... otros datos del perfil
```

## 🔄 Flujo de Registro:

### 1. Usuario se registra:
```javascript
// En el frontend
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@ejemplo.com',
  password: 'contraseña_segura'  // ← Se envía aquí
});
```

### 2. Supabase hace dos cosas:

**A) Crea registro en `auth.users`:**
- Guarda el email
- Hashea la contraseña con bcrypt
- Guarda el hash (no la contraseña en texto plano)
- Genera un UUID único

**B) Luego tú creas el perfil en `public.usuarios`:**
```javascript
const { data: userData } = await supabase
  .from('usuarios')
  .insert({
    auth_user_id: data.user.id,  // ← Referencia al auth.users
    nombres: 'Juan',
    apellidos: 'Pérez',
    dni: '12345678',
    email: 'usuario@ejemplo.com',
    rol: 'ciudadano'
  });
```

## 🔍 ¿Cómo ver los usuarios autenticados?

### En el Dashboard de Supabase:

1. Ve a: **Authentication** → **Users**
2. Allí verás todos los usuarios registrados con:
   - Email
   - ID
   - Fecha de creación
   - Último inicio de sesión
   - Si confirmaron el email

### En SQL (solo metadatos):

```sql
-- Ver usuarios del sistema de auth
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users;

-- Ver usuarios con su perfil
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.nombres,
  p.apellidos,
  p.rol,
  p.estado
FROM auth.users u
LEFT JOIN public.usuarios p ON p.auth_user_id = u.id;
```

## 🔐 Seguridad de Contraseñas:

✅ **Supabase hace automáticamente:**
- Hash con bcrypt (costo 10)
- Salt único por contraseña
- Almacenamiento seguro
- Protección contra timing attacks
- Rate limiting en login

❌ **NUNCA debes:**
- Guardar contraseñas en tu tabla `usuarios`
- Almacenar contraseñas en texto plano
- Enviar contraseñas por API fuera del flujo de auth
- Loggear contraseñas

## 🔄 Cambiar Contraseña:

### Desde la aplicación:
```javascript
// Usuario cambia su propia contraseña
const { data, error } = await supabase.auth.updateUser({
  password: 'nueva_contraseña'
});
```

### Recuperar contraseña:
```javascript
// Envía email de recuperación
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'usuario@ejemplo.com'
);
```

## 📋 Tabla `auth.users` vs `public.usuarios`

| Característica | `auth.users` | `public.usuarios` |
|----------------|--------------|-------------------|
| **Propósito** | Autenticación | Datos del perfil |
| **Contraseñas** | ✅ Sí (hasheadas) | ❌ No |
| **Email** | ✅ Sí | ✅ Sí (duplicado) |
| **Acceso directo** | ❌ No (API) | ✅ Sí (SQL) |
| **RLS** | N/A | ✅ Sí |
| **Campos custom** | ❌ Limitado | ✅ Todos los que quieras |

## ✅ Buenas Prácticas:

1. **Usa `auth.users` para:**
   - Login/logout
   - Cambio de contraseña
   - Verificación de email
   - Recuperación de cuenta

2. **Usa `public.usuarios` para:**
   - Datos del perfil (nombre, DNI, dirección)
   - Roles y permisos
   - Información adicional del usuario
   - Relaciones con otras tablas

3. **Conecta ambas con:**
   - `auth_user_id` en `usuarios` → `id` en `auth.users`

## 🔗 Verificar la Conexión:

```sql
-- Ver si todos los usuarios tienen perfil
SELECT 
  u.email,
  CASE 
    WHEN p.id IS NULL THEN '❌ Sin perfil'
    ELSE '✅ Con perfil'
  END as estado_perfil
FROM auth.users u
LEFT JOIN public.usuarios p ON p.auth_user_id = u.id;
```

## 🐛 Debugging:

### Si no ves usuarios en `auth.users`:
1. Ve a **Authentication** → **Users** en Supabase Dashboard
2. Verifica que el registro se completó
3. Revisa los logs en **Logs** → **Auth**

### Si `auth_user_id` está NULL:
```sql
-- Corregir usuarios sin auth_user_id
UPDATE usuarios 
SET auth_user_id = (
  SELECT id FROM auth.users WHERE email = usuarios.email
)
WHERE auth_user_id IS NULL;
```

---

**Resumen:** Las contraseñas están seguras en `auth.users` (hasheadas). Tu tabla `usuarios` solo guarda el perfil. Esto es lo correcto y seguro. 🔒

