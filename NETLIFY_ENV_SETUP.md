# 🚀 Configuración de Variables de Entorno en Netlify

## ⚠️ ERROR ACTUAL
```
Uncaught Error: Faltan las variables de entorno de Supabase
```

Este error ocurre porque Netlify no tiene configuradas las variables de entorno necesarias para conectarse a Supabase.

## 📋 Pasos para Configurar Variables de Entorno en Netlify

### 1. Acceder al Panel de Netlify
1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu sitio: **mesapartesdigitalmochumi**

### 2. Ir a la Configuración del Sitio
1. En el menú lateral, haz clic en **Site settings** (Configuración del sitio)
2. En el menú de la izquierda, busca **Environment variables** (Variables de entorno)
3. Haz clic en **Environment variables**

### 3. Agregar las Variables de Entorno

Haz clic en **Add a variable** o **Add environment variables** y agrega las siguientes:

#### Variable 1: VITE_SUPABASE_URL
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://kwwsnzkojqqoaydebfan.supabase.co`
- **Scopes:** Selecciona todas las opciones (Production, Deploy Previews, Branch deploys)

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d3NuemtvanFxb2F5ZGViZmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzM2NDYsImV4cCI6MjA3OTYwOTY0Nn0.ecH5DYX-qx3ypQt5dbwPiy-tYyLkiHowMVUzCJ0uwC4`
- **Scopes:** Selecciona todas las opciones (Production, Deploy Previews, Branch deploys)

### 4. Guardar y Redesplegar

1. Haz clic en **Save** o **Create variable** para cada variable
2. Una vez agregadas ambas variables, ve a la pestaña **Deploys**
3. Haz clic en **Trigger deploy** → **Clear cache and deploy site**

## 🖼️ Guía Visual

```
Netlify Dashboard
  └─ Site settings
      └─ Environment variables
          └─ Add a variable
              ├─ Key: VITE_SUPABASE_URL
              └─ Value: [tu URL de Supabase]
```

## ✅ Verificación

Después de configurar las variables y redesplegar:

1. Espera a que el deploy termine (2-3 minutos)
2. Visita tu sitio: https://mesapartesdigitalmochumi.netlify.app
3. El error debería desaparecer y deberías ver la página de inicio

## 🔍 Solución de Problemas

### Si el error persiste:
1. Verifica que las variables tengan exactamente estos nombres (distinguen mayúsculas/minúsculas):
   - `VITE_SUPABASE_URL` (no `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (no `SUPABASE_ANON_KEY`)

2. Verifica que los valores no tengan espacios al inicio o al final

3. Asegúrate de haber hecho **Clear cache and deploy site** después de agregar las variables

### Si quieres usar tus propias credenciales de Supabase:
1. Ve a tu proyecto en Supabase
2. En Settings → API
3. Copia la **Project URL** y la **anon public** key
4. Reemplaza los valores en Netlify

## 📝 Notas Importantes

- Las variables de entorno con prefijo `VITE_` son las únicas que se exponen al cliente en aplicaciones Vite
- Estas credenciales son seguras de exponer en el cliente porque son keys "anon" (públicas)
- La seguridad real está en las políticas RLS (Row Level Security) configuradas en Supabase

## 🔗 Enlaces Útiles

- [Documentación de Netlify sobre Variables de Entorno](https://docs.netlify.com/environment-variables/overview/)
- [Documentación de Vite sobre Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Tu proyecto en Supabase](https://supabase.com/dashboard/project/kwwsnzkojqqoaydebfan)

---

**Última actualización:** 25 de Noviembre, 2025
