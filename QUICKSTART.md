# 🎯 Guía de Inicio Rápido

## ⚡ Instalación en 5 Minutos

### 1. Clonar e Instalar
```bash
git clone https://github.com/IgnacioAlP/Mesa_De_Partes_Digital.git
cd Mesa_De_Partes_Digital
npm install
```

### 2. Configurar Supabase

#### Opción A: Configuración Completa (Recomendado)
Sigue la guía detallada en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

#### Opción B: Inicio Rápido
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. SQL Editor → Ejecuta `supabase_schema.sql`
4. SQL Editor → Ejecuta `supabase_data.sql`

### 3. Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-aqui
```

### 4. Iniciar Aplicación
```bash
npm run dev
```

Abre: http://localhost:3000

## 🧪 Credenciales de Prueba

Después de cargar datos de simulación:

### Ciudadano
- Email: juan.garcia@email.com
- Password: (configurar en Supabase Auth)

### Personal Municipal
- Email: mesapartes@mochumi.gob.pe
- Password: (configurar en Supabase Auth)

### Administrador TI
- Email: ti@mochumi.gob.pe
- Password: (configurar en Supabase Auth)

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🏗️ Estructura del Proyecto

```
Mesa_De_Partes_Digital/
├── 📁 src/
│   ├── 📁 components/       # Componentes reutilizables
│   ├── 📁 pages/           # Páginas de la app
│   ├── 📁 store/           # State management
│   └── 📁 lib/             # Configuración (Supabase)
├── 📁 public/              # Assets estáticos
├── 📄 supabase_schema.sql  # Estructura de BD
├── 📄 supabase_data.sql    # Datos de prueba
└── 📄 README.md            # Documentación principal
```

## 🎨 Características Principales

✅ **Autenticación Segura** - Login/Registro con Supabase  
✅ **Sistema de Roles** - Ciudadano, Mesa Partes, Área, Alcalde, TI  
✅ **Gestión de Trámites** - Registro y seguimiento 24/7  
✅ **Workflow Automatizado** - Derivación por áreas  
✅ **Notificaciones** - Email/SMS en cambios de estado  
✅ **Dashboard Interactivo** - Estadísticas en tiempo real  
✅ **Responsive Design** - Mobile, Tablet, Desktop  
✅ **Paleta Mochumi** - Colores del escudo oficial  

## 📱 Pantallas Principales

1. **Home** - Página pública con trámites comunes
2. **Login/Register** - Autenticación de usuarios
3. **Dashboard** - Vista personalizada por rol
4. **Mis Trámites** - Lista de expedientes del ciudadano
5. **Nuevo Trámite** - Formulario de registro
6. **Seguimiento** - Consulta de estado
7. **Expedientes** - Gestión para personal municipal
8. **Usuarios** - CRUD para área TI

## 🔐 Seguridad Implementada

- 🔒 Row Level Security (RLS) en Supabase
- 🔑 Autenticación con JWT tokens
- 👤 Control de acceso basado en roles (RBAC)
- 📝 Auditoría de todas las acciones
- 🛡️ Cifrado de datos sensibles
- ⚠️ Validación de inputs en frontend y backend

## 📚 Documentación Adicional

- [📖 Manual de Usuario](./USER_MANUAL.md) - Guía completa para usuarios
- [🔧 Configuración Supabase](./SUPABASE_SETUP.md) - Setup detallado de BD
- [🚀 Guía de Despliegue](./DEPLOYMENT.md) - Deploy a producción
- [🤝 Cómo Contribuir](./CONTRIBUTING.md) - Guía para desarrolladores

## 🆘 Solución de Problemas

### Error: "No se puede conectar a Supabase"
- Verifica las variables de entorno en `.env`
- Confirma que Supabase URL y Key son correctos
- Revisa que el proyecto Supabase esté activo

### Error: "No rows returned"
- Ejecuta `supabase_schema.sql` y `supabase_data.sql`
- Verifica que RLS esté configurado correctamente
- Comprueba las políticas de seguridad

### Error al hacer login
- Crea usuario en Supabase Authentication
- Inserta registro correspondiente en tabla `usuarios`
- Verifica que el email coincida en ambas tablas

### Página en blanco
- Revisa console del navegador (F12)
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm install` nuevamente

## 💡 Próximos Pasos

1. ✅ Configurar Supabase completamente
2. 📝 Crear usuarios de prueba
3. 🧪 Probar flujo completo de trámite
4. 🎨 Personalizar logo en `/public`
5. 📧 Configurar SMTP para emails
6. 🚀 Preparar para producción

## 🌟 Características Destacadas

### Para Ciudadanos
- Registro de trámites 24/7
- Seguimiento en tiempo real
- Notificaciones automáticas
- Historial completo

### Para Municipalidad
- Workflow automatizado
- Reducción de papel
- Trazabilidad completa
- Reportes y estadísticas
- Cumplimiento de plazos
- Transparencia total

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: ti@mochumi.gob.pe
- 📱 Teléfono: (074) 123-4567
- 🐛 Issues: [GitHub Issues](https://github.com/IgnacioAlP/Mesa_De_Partes_Digital/issues)

## 📄 Licencia

Propiedad de la **Municipalidad Distrital de Mochumi**

---

**¡Listo para transformar la gestión documental! 🚀**

*Mesa de Partes Digital - Mochumi, Tierra Fértil* 🌾🔥
