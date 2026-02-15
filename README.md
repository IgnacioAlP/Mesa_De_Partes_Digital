# 📋 Mesa De Partes Digital

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deploy-00c7b7?logo=netlify&logoColor=white)](https://www.netlify.com/)

> **Sistema de Gestión de Trámites Administrativos**

Mesa De Partes Digital es un sistema web completo y profesional para la gestión de trámites administrativos, desarrollado con tecnologías modernas. Permite a ciudadanos y personal administrativo gestionar expedientes, realizar seguimiento de trámites en tiempo real, y administrar todo el ciclo de vida de documentos oficiales de manera digital, segura y eficiente.

---

## ✨ Características Principales

- ✅ **Gestión completa de expedientes y trámites** - Sistema integral de documentación
- ✅ **Sistema de autenticación con roles** - Admin, Usuario, Operador con permisos específicos
- ✅ **Dashboard administrativo** - Visualización y control centralizado
- ✅ **Seguimiento de trámites en tiempo real** - Trazabilidad completa de expedientes
- ✅ **Generación automática de PDFs** - Documentos oficiales automatizados
- ✅ **Gestión de tipos de trámites y requisitos** - Catálogo configurable
- ✅ **Sistema de plazos legales** - Alertas y control de vencimientos
- ✅ **Registro de auditoría** - Log completo de acciones del sistema
- ✅ **Interfaz responsive** - Acceso desde cualquier dispositivo

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y servidor de desarrollo ultrarrápido
- **Tailwind CSS** - Framework de estilos utility-first
- **React Router** - Navegación y enrutamiento
- **Zustand** - State management ligero
- **React Hot Toast** - Notificaciones elegantes

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication & Authorization
  - Row Level Security (RLS)
  - Storage para documentos
  - Triggers y Functions (PLpgSQL)
  - Real-time subscriptions

### Generación de Documentos
- **Python** - Scripts para generación de PDFs (`generador_pdfs/`)
- Procesamiento de plantillas de documentos

### Despliegue
- **Netlify** - Hosting y despliegue continuo
- CI/CD automatizado

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** (LTS recomendado)
- **npm** o **yarn** (gestor de paquetes)
- **Cuenta de Supabase** (gratis - [supabase.com](https://supabase.com))
- **Cuenta de Netlify** (opcional, solo para despliegue)

---

## ⚡ Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/IgnacioAlP/Mesa_De_Partes_Digital.git
cd Mesa_De_Partes_Digital

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

> 💡 **Tip:** Para una guía paso a paso más detallada, consulta [QUICKSTART.md](./QUICKSTART.md) o [ACCION_INMEDIATA.md](./ACCION_INMEDIATA.md)

---

## ⚙️ Configuración

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno en el archivo `.env`:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Configuración de Supabase

Este proyecto utiliza Supabase como backend. Necesitarás:

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar los scripts SQL de configuración (ver sección [Base de Datos](#-base-de-datos))
3. Configurar el bucket de Storage para documentos
4. Configurar las políticas de Row Level Security (RLS)

> 📖 **Documentación detallada:** Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instrucciones completas de configuración

---

## 📁 Estructura del Proyecto

```
Mesa_De_Partes_Digital/
├── src/                          # Código fuente React
│   ├── components/              # Componentes reutilizables
│   ├── pages/                   # Páginas de la aplicación
│   ├── services/                # Servicios y APIs
│   ├── store/                   # State management (Zustand)
│   ├── lib/                     # Utilidades y configuración
│   └── App.jsx                  # Componente principal
├── generador_pdfs/              # Scripts Python para PDFs
│   ├── generar_documentos_ejemplo.py
│   ├── requirements.txt
│   └── documentos_ejemplo/
├── public/                      # Archivos estáticos
├── supabase_*.sql              # Scripts de base de datos
├── netlify.toml                # Configuración de Netlify
├── package.json                # Dependencias del proyecto
├── vite.config.js              # Configuración de Vite
└── tailwind.config.js          # Configuración de Tailwind
```

---

## 📦 Módulos del Sistema

El sistema está organizado en los siguientes módulos principales:

- **🗂️ Gestión de Expedientes** - Creación, edición y seguimiento de expedientes
- **📄 Gestión de Trámites** - Control de diferentes tipos de trámites
- **👥 Administración de Usuarios** - CRUD de usuarios y perfiles
- **🔐 Control de Roles y Permisos** - Sistema RBAC (Role-Based Access Control)
- **📊 Generación de Reportes** - Exportación y análisis de datos
- **🔍 Auditoría** - Registro detallado de acciones del sistema

---

## 📚 Documentación

Este proyecto cuenta con **documentación extensa y detallada**. A continuación se presenta el índice completo:

### 🚀 Guías Rápidas
- [**QUICKSTART.md**](./QUICKSTART.md) - Guía de inicio rápido (5 minutos)
- [**ACCION_INMEDIATA.md**](./ACCION_INMEDIATA.md) - Pasos inmediatos para empezar
- [**INICIO.md**](./INICIO.md) - Guía de introducción al proyecto

### 🔧 Configuración y Setup
- [**SUPABASE_SETUP.md**](./SUPABASE_SETUP.md) - Configuración completa de Supabase
- [**SUPABASE_AUTH_INFO.md**](./SUPABASE_AUTH_INFO.md) - Información de autenticación
- [**SUPABASE_RLS_FIX.md**](./SUPABASE_RLS_FIX.md) - Solución de problemas de RLS
- [**NETLIFY_ENV_SETUP.md**](./NETLIFY_ENV_SETUP.md) - Configuración de variables en Netlify

### 🚀 Despliegue
- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Guía completa de despliegue
- [**DEPLOY_QUICKFIX.md**](./DEPLOY_QUICKFIX.md) - Soluciones rápidas de despliegue
- [**HOTFIX_DEPLOY.md**](./HOTFIX_DEPLOY.md) - Correcciones urgentes en producción

### 📖 Documentación Técnica
- [**SISTEMA_COMPLETO.md**](./SISTEMA_COMPLETO.md) - Documentación técnica completa del sistema
- [**ESTADO_PROYECTO.md**](./ESTADO_PROYECTO.md) - Estado actual y roadmap del proyecto
- [**NOTAS_PROYECTO.md**](./NOTAS_PROYECTO.md) - Notas técnicas y decisiones de diseño
- [**ARCHIVOS_EJEMPLO_TRAMITES.md**](./ARCHIVOS_EJEMPLO_TRAMITES.md) - Ejemplos de trámites

### 👥 Contribución y Usuario
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) - Guía de contribución al proyecto
- [**USER_MANUAL.md**](./USER_MANUAL.md) - Manual de usuario del sistema

> 💡 **Nota:** La documentación está en constante actualización. Siempre consulta la versión más reciente en el repositorio.

---

## 🗄️ Base de Datos

El proyecto incluye múltiples scripts SQL para configurar la base de datos en Supabase:

### Scripts Principales

| Script | Descripción |
|--------|-------------|
| `supabase_schema.sql` | Esquema principal de la base de datos |
| `supabase_data.sql` | Datos iniciales y de prueba |
| `supabase_storage_setup.sql` | Configuración de storage para documentos |
| `supabase_rls_simple.sql` | Políticas de Row Level Security |
| `supabase_usuarios_gestion.sql` | Gestión de usuarios |
| `supabase_trigger_auto_user.sql` | Triggers automáticos |
| `supabase_sync_users.sql` | Sincronización de usuarios |
| `supabase_fix_auditoria.sql` | Corrección de auditoría |
| `supabase_fix_foreign_keys.sql` | Corrección de claves foráneas |
| `supabase_fix_recursion.sql` | Corrección de recursión |
| `supabase_verify_fk.sql` | Verificación de integridad |

### Scripts Adicionales

- `actualizar_plazos_legales.sql` - Actualización de plazos legales
- `actualizar_requisitos.sql` - Actualización de requisitos de trámites

> ⚠️ **Importante:** Ejecuta los scripts en el orden indicado en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🚀 Despliegue

### Despliegue en Netlify

El proyecto está configurado para desplegarse automáticamente en Netlify:

1. Conecta tu repositorio con Netlify
2. Configura las variables de entorno (ver [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md))
3. El despliegue se realizará automáticamente con cada push a `main`

### Variables de Entorno Requeridas

```bash
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

> 📖 **Documentación completa:** Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas

---

## 📊 Estado del Proyecto

**Versión Actual:** 1.0.0  
**Estado:** ✅ Sistema funcional en producción  
**Última Actualización:** Noviembre 2024

El sistema está completamente funcional con todos los módulos principales implementados. Para más detalles sobre el estado actual, funcionalidades implementadas y roadmap, consulta [ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md).

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

Para más detalles sobre cómo contribuir, consulta [CONTRIBUTING.md](./CONTRIBUTING.md).

### 🐛 Reportar Issues

Si encuentras un bug o tienes una sugerencia:
- Abre un [issue en GitHub](https://github.com/IgnacioAlP/Mesa_De_Partes_Digital/issues)
- Describe el problema o sugerencia en detalle
- Incluye pasos para reproducir (si es un bug)

---

## 📄 Licencia

Este proyecto está desarrollado para propósitos de gestión administrativa. Consulta con el propietario del repositorio para más información sobre términos de uso.

---

## 👨‍💻 Autor y Equipo

**Desarrollado por:** IgnacioAlP  
**Repositorio:** [github.com/IgnacioAlP/Mesa_De_Partes_Digital](https://github.com/IgnacioAlP/Mesa_De_Partes_Digital)

### 🙏 Agradecimientos

Gracias a todos los contribuidores que han participado en este proyecto y a la comunidad open source por las herramientas y librerías utilizadas.

---

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:

- 📧 Abre un issue en GitHub
- 💬 Consulta la documentación disponible
- 📖 Revisa el [Manual de Usuario](./USER_MANUAL.md)

---

<div align="center">

**⚡ Mesa De Partes Digital - Gestión Moderna de Trámites Administrativos**

Desarrollado con ❤️ usando React, Vite y Supabase

[Documentación](./SISTEMA_COMPLETO.md) • [Quick Start](./QUICKSTART.md) • [Contribuir](./CONTRIBUTING.md)

</div>
