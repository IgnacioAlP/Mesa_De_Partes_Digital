# 🚀 CÓMO INICIAR EL PROYECTO

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

**⚠️ IMPORTANTE:** Obtén estas credenciales de tu proyecto Supabase:
1. Ve a [supabase.com](https://supabase.com)
2. Settings → API
3. Copia "Project URL" y "anon public" key

### 3️⃣ Configurar Base de Datos

**Opción A: Automático (Recomendado)**
1. Abre Supabase Dashboard
2. Ve a SQL Editor
3. Ejecuta `supabase_schema.sql` (estructura)
4. Ejecuta `supabase_data.sql` (datos de prueba)

**Opción B: Manual**
Sigue la guía completa: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4️⃣ Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre: **http://localhost:3000**

---

## 📱 Probar el Sistema

### Crear Usuario de Prueba

1. **En Supabase Dashboard:**
   - Authentication → Users → Add User
   - Email: test@mochumi.gob.pe
   - Password: Test123456
   - Auto Confirm: ON

2. **En SQL Editor:**
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
  'REEMPLAZA_CON_UUID_DEL_USUARIO',
  'Usuario',
  'de Prueba',
  '12345678',
  'test@mochumi.gob.pe',
  'ciudadano',
  'activo'
);
```

3. **Inicia sesión:**
   - Ve a /login
   - Email: test@mochumi.gob.pe
   - Password: Test123456

---

## 🎨 Agregar Logo de Mochumi

1. Guarda el logo del escudo en: `public/logo-mochumi.png`
2. Formato recomendado: PNG con fondo transparente
3. Tamaño recomendado: 512x512px o 1024x1024px

---

## ✅ Verificar Instalación

### Checklist
- [ ] `npm install` sin errores
- [ ] Archivo `.env` creado con credenciales válidas
- [ ] Base de datos creada en Supabase
- [ ] Schema SQL ejecutado correctamente
- [ ] Datos de simulación cargados
- [ ] `npm run dev` inicia sin errores
- [ ] Navegador abre en http://localhost:3000
- [ ] Página principal carga correctamente
- [ ] Login funciona con usuario de prueba

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Supabase connection failed"
- Verifica que las credenciales en `.env` sean correctas
- Confirma que el proyecto Supabase esté activo
- Revisa que la URL termine en `.supabase.co`

### Error: "No rows returned"
- Ejecuta `supabase_schema.sql` primero
- Luego ejecuta `supabase_data.sql`
- Verifica que RLS esté configurado

### Página en blanco
- Abre DevTools (F12) → Console
- Revisa errores en la consola
- Verifica que todas las rutas existan

---

## 📖 Documentación Completa

- 📘 [README.md](./README.md) - Documentación principal
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - Guía de inicio rápido
- 🔧 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuración de Supabase
- 📖 [USER_MANUAL.md](./USER_MANUAL.md) - Manual de usuario
- 🚢 [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía de contribución
- 📝 [NOTAS_PROYECTO.md](./NOTAS_PROYECTO.md) - Notas técnicas

---

## 🎯 Estado Actual del Proyecto

### ✅ Implementado
- Sistema de autenticación completo
- Dashboard básico
- Página principal con trámites
- Base de datos completa
- Sistema de roles
- Diseño responsive

### 🚧 En Desarrollo
- Módulo de nuevo trámite
- Sistema de seguimiento
- Gestión de expedientes
- Notificaciones

### 📋 Pendiente
- Sistema completo de derivaciones
- CRUD de usuarios (TI)
- Reportes y estadísticas
- Módulo de pagos

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: ti@mochumi.gob.pe
- 📱 WhatsApp: +51 979 123 456
- 🐛 GitHub Issues: [Reportar problema](https://github.com/IgnacioAlP/Mesa_De_Partes_Digital/issues)

---

## 🎉 ¡Listo!

Tu entorno de desarrollo está configurado. Ahora puedes:

1. Explorar el código en `src/`
2. Revisar la estructura de la BD
3. Personalizar los estilos
4. Implementar nuevas funcionalidades

**¡Bienvenido al desarrollo de Mesa de Partes Digital! 🚀**

*Municipalidad Distrital de Mochumi - Tierra Fértil* 🌾🔥
