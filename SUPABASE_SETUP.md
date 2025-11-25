# 📖 Guía de Configuración de Supabase

Esta guía te ayudará a configurar correctamente Supabase para el proyecto Mesa de Partes Digital.

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name:** Mesa-Partes-Mochumi
   - **Database Password:** (guarda esta contraseña de forma segura)
   - **Region:** South America (São Paulo) - la más cercana
   - **Pricing Plan:** Free (para desarrollo)

## 2. Configurar Base de Datos

### 2.1. Ejecutar Schema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia todo el contenido del archivo `supabase_schema.sql`
4. Pega en el editor y haz clic en **Run**
5. Espera a que se ejecute completamente (puede tardar 1-2 minutos)
6. Verifica que no haya errores

### 2.2. Cargar Datos de Simulación

1. Crea una nueva query en SQL Editor
2. Copia el contenido de `supabase_data.sql`
3. Ejecuta el script
4. Verifica que los datos se hayan insertado correctamente

### 2.3. Verificar Tablas Creadas

Ve a **Table Editor** y verifica que existan las siguientes tablas:

- ✅ usuarios
- ✅ tipos_tramite
- ✅ expedientes
- ✅ documentos
- ✅ derivaciones
- ✅ historial_estados
- ✅ observaciones
- ✅ notificaciones
- ✅ auditoria
- ✅ requisitos_tramite

## 3. Configurar Storage

### 3.1. Crear Bucket para Documentos

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Configura:
   - **Name:** documentos
   - **Public bucket:** No (mantener privado)
   - **File size limit:** 10 MB
   - **Allowed MIME types:** 
     - application/pdf
     - image/jpeg
     - image/png
     - image/jpg
     - application/msword
     - application/vnd.openxmlformats-officedocument.wordprocessingml.document

### 3.2. Configurar Políticas de Storage

Ejecuta en SQL Editor:

```sql
-- Política para subir documentos
CREATE POLICY "Los usuarios pueden subir sus documentos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);

-- Política para ver documentos
CREATE POLICY "Los usuarios pueden ver documentos autorizados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);
```

## 4. Configurar Authentication

### 4.1. Configurar Email Auth

1. Ve a **Authentication** > **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Configura:
   - **Enable Email provider:** ON
   - **Confirm email:** OFF (para desarrollo, ON en producción)
   - **Secure email change:** ON
   - **Secure password change:** ON

### 4.2. Configurar Email Templates (Opcional)

Ve a **Authentication** > **Email Templates** y personaliza:

- Confirmation email
- Invitation email
- Magic Link email
- Change Email Address
- Reset Password

Usa el logo y colores de Mochumi en los templates.

### 4.3. Configurar Site URL

1. Ve a **Authentication** > **URL Configuration**
2. Configura:
   - **Site URL:** http://localhost:3000 (desarrollo)
   - **Redirect URLs:** 
     - http://localhost:3000/**
     - https://tudominio.com/** (producción)

## 5. Obtener Credenciales

### 5.1. API Keys

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:

```
Project URL: https://xxxxxxxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (NO compartir, solo backend)
```

### 5.2. Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 6. Verificar Row Level Security (RLS)

### 6.1. Verificar RLS Habilitado

Ejecuta en SQL Editor:

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Todas las tablas principales deben tener `rowsecurity = true`

### 6.2. Verificar Políticas

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Debes ver las políticas definidas en el schema.

## 7. Configurar Realtime (Opcional)

Para notificaciones en tiempo real:

1. Ve a **Database** > **Replication**
2. Habilita replicación para las tablas:
   - notificaciones
   - expedientes
   - derivaciones

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notificaciones;
ALTER PUBLICATION supabase_realtime ADD TABLE expedientes;
ALTER PUBLICATION supabase_realtime ADD TABLE derivaciones;
```

## 8. Prueba de Conexión

### 8.1. Crear Usuario de Prueba

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Completa:
   - **Email:** test@mochumi.gob.pe
   - **Password:** TestPassword123
   - **Auto Confirm User:** ON

### 8.2. Insertar Datos del Usuario

Ejecuta en SQL Editor (reemplaza el UUID con el del usuario creado):

```sql
INSERT INTO usuarios (
  auth_user_id, 
  nombres, 
  apellidos, 
  dni, 
  email, 
  rol, 
  estado
) VALUES (
  'UUID_DEL_USUARIO_CREADO',
  'Usuario',
  'de Prueba',
  '00000000',
  'test@mochumi.gob.pe',
  'ciudadano',
  'activo'
);
```

### 8.3. Probar Login

1. Inicia la aplicación React: `npm run dev`
2. Ve a http://localhost:3000/login
3. Ingresa las credenciales de prueba
4. Deberías poder acceder al dashboard

## 9. Backups y Mantenimiento

### 9.1. Configurar Backups Automáticos

Los proyectos Supabase free tienen backups diarios automáticos por 7 días.

Para backups manuales:

1. Ve a **Database** > **Backups**
2. Haz clic en **Create backup**

### 9.2. Exportar Base de Datos

```bash
# Requiere psql instalado
pg_dump -h db.xxxxxxxxxx.supabase.co -U postgres -d postgres > backup.sql
```

## 10. Monitoreo

### 10.1. Ver Logs

1. Ve a **Logs** en el menú lateral
2. Puedes ver:
   - API logs
   - Postgres logs
   - Auth logs
   - Realtime logs

### 10.2. Métricas

1. Ve a **Reports**
2. Monitorea:
   - Database size
   - API requests
   - Auth users
   - Storage usage

## 11. Troubleshooting

### Error: "No rows returned"
- Verifica que RLS esté configurado correctamente
- Verifica las políticas de acceso
- Comprueba que el usuario esté autenticado

### Error: "Permission denied"
- Revisa las políticas RLS
- Verifica el rol del usuario
- Comprueba los permisos de la tabla

### Error de conexión
- Verifica las variables de entorno
- Comprueba que la URL y API key sean correctas
- Verifica la conexión a internet

## 12. Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

¿Necesitas ayuda? Contacta al equipo de TI: ti@mochumi.gob.pe
