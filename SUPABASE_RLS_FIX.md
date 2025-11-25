# 🔧 Solución: Recursión Infinita en Políticas RLS de Supabase

## ❌ Errores Comunes

### Error 1: Recursión Infinita
```
infinite recursion detected in policy for relation "usuarios"
```

### Error 2: Políticas Duplicadas
```
ERROR: policy "usuarios_update_own" for table "usuarios" already exists
```

## 🔐 Importante sobre Contraseñas

**Las contraseñas NO se guardan en la tabla `usuarios`.**

Supabase Auth maneja las contraseñas de forma segura en su tabla interna `auth.users`:
- Las contraseñas se almacenan con hash bcrypt
- Nunca se guardan en texto plano
- La tabla `usuarios` solo tiene una referencia (`auth_user_id`) al usuario de autenticación

**Flujo de autenticación:**
1. Usuario se registra → Supabase crea registro en `auth.users` (con contraseña hasheada)
2. Se crea registro en `usuarios` con `auth_user_id` apuntando a `auth.users`
3. Usuario inicia sesión → Supabase valida contra `auth.users`
4. Token JWT incluye el `auth.uid()` que se usa en las políticas RLS

## 🎯 Causa del Problema de Recursión

Las políticas RLS (Row Level Security) estaban creando recursión infinita porque:

1. La política de `usuarios` verificaba permisos consultando la tabla `usuarios`
2. Esa consulta activaba la misma política
3. Se creaba un bucle infinito

**Ejemplo del problema:**
```sql
-- ❌ INCORRECTO (causa recursión)
CREATE POLICY "usuarios_ti_all"
    ON usuarios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios  -- ← Consulta a usuarios dentro de política de usuarios
            WHERE auth_user_id = auth.uid() AND rol = 'ti'
        )
    );
```

## ✅ Solución Implementada

Las nuevas políticas evitan la recursión usando `auth.uid()` directamente y subconsultas optimizadas:

```sql
-- ✅ CORRECTO (sin recursión)
CREATE POLICY "usuarios_select_ti"
    ON usuarios FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
    );
```

## 📋 Pasos para Aplicar la Solución

### Opción 1: Desde el SQL Editor de Supabase (Recomendado)

1. **Ve a tu proyecto en Supabase:**
   https://supabase.com/dashboard/project/kwwsnzkojqqoaydebfan

2. **Abre el SQL Editor:**
   - En el menú lateral, haz clic en **SQL Editor**
   - O ve directamente a: `/sql/new`

3. **Copia y pega el contenido del archivo:**
   - Abre el archivo `supabase_fix_recursion.sql` en VS Code
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pégalo en el SQL Editor de Supabase

4. **Ejecuta el script:**
   - Haz clic en **Run** (o presiona Ctrl+Enter)
   - Espera a que termine (debería tomar 2-3 segundos)

5. **Verifica que no haya errores:**
   - Deberías ver un mensaje de éxito
   - Al final verás la lista de todas las políticas creadas

### Opción 2: Si las políticas ya existen

El script actualizado elimina TODAS las políticas antes de crearlas, incluyendo:
- Políticas con nombres antiguos
- Políticas con nombres nuevos
- Cualquier política duplicada

**El script incluye más de 30 DROP POLICY para garantizar una limpieza completa.**

## 🔍 Verificar que Funcionó

### 1. Verificar las políticas en SQL Editor:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Deberías ver políticas con nombres como:
- `usuarios_select_own`
- `usuarios_select_ti`
- `expedientes_select_own`
- `expedientes_select_staff`
- etc.

### 2. Probar desde la aplicación:

1. Ve a: https://mesapartesdigitalmochumi.netlify.app
2. Intenta iniciar sesión
3. El error de recursión debe haber desaparecido

## 📊 Cambios Principales

### Antes (con recursión):
```sql
CREATE POLICY "usuarios_ti_all" ON usuarios
USING (
    EXISTS (
        SELECT 1 FROM usuarios  -- ← Recursión aquí
        WHERE auth_user_id = auth.uid() AND rol = 'ti'
    )
);
```

### Después (sin recursión):
```sql
CREATE POLICY "usuarios_select_ti" ON usuarios
USING (
    auth.uid() IN (
        SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
    )
);
```

## 🎨 Políticas Creadas

### Tabla `usuarios`:
- ✅ `usuarios_select_own` - Ver propio perfil
- ✅ `usuarios_select_ti` - TI ve todos
- ✅ `usuarios_update_own` - Actualizar propio perfil
- ✅ `usuarios_update_ti` - TI actualiza cualquiera
- ✅ `usuarios_insert_ti` - TI inserta usuarios

### Tabla `expedientes`:
- ✅ `expedientes_select_own` - Ciudadano ve sus expedientes
- ✅ `expedientes_select_staff` - Personal ve todos
- ✅ `expedientes_insert_ciudadano` - Ciudadano crea expediente
- ✅ `expedientes_insert_mesa_partes` - Mesa de partes crea
- ✅ `expedientes_update_staff` - Personal actualiza

### Tabla `documentos`:
- ✅ `documentos_select_own` - Ver documentos propios
- ✅ `documentos_select_staff` - Personal ve todos
- ✅ `documentos_insert_authenticated` - Usuarios suben docs

### Tabla `notificaciones`:
- ✅ `notificaciones_select_own` - Ver propias notificaciones
- ✅ `notificaciones_update_own` - Actualizar propias
- ✅ `notificaciones_insert_system` - Sistema crea notificaciones

### Tabla `derivaciones`:
- ✅ `derivaciones_select_staff` - Personal ve derivaciones
- ✅ `derivaciones_insert_staff` - Personal crea derivaciones
- ✅ `derivaciones_update_staff` - Personal actualiza

### Tabla `historial_estados`:
- ✅ `historial_select_own` - Ver historial propio
- ✅ `historial_select_staff` - Personal ve todo
- ✅ `historial_insert_system` - Sistema registra cambios

### Tabla `observaciones`:
- ✅ `observaciones_select_own` - Ver observaciones propias
- ✅ `observaciones_select_staff` - Personal ve todas
- ✅ `observaciones_insert_staff` - Personal crea observaciones

## ⚠️ Importante

- **Ejecuta el script COMPLETO** para evitar políticas incompletas
- **No modifiques** las políticas manualmente después, usa el script
- **Verifica** que todas las políticas se crearon correctamente

## 🆘 Si el Error Persiste

1. **Verifica que ejecutaste TODO el script**
   - Debe incluir el DROP POLICY y todos los CREATE POLICY

2. **Limpia la caché de Supabase**
   - Cierra sesión en la app
   - Borra cookies del navegador
   - Vuelve a intentar

3. **Verifica las políticas activas:**
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

4. **Deshabilita temporalmente RLS (solo para debugging):**
```sql
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
```
   (Recuerda volver a habilitarlas después)

## 📚 Recursos

- [Documentación de RLS en Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Evitar recursión en políticas RLS](https://supabase.com/docs/guides/database/postgres/row-level-security#recursion-pitfalls)

---

**Fecha de solución:** 25 de Noviembre, 2025  
**Archivo de fix:** `supabase_fix_recursion.sql`
