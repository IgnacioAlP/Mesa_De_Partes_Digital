# 🏛️ Mesa de Partes Digital - Municipalidad Distrital de Mochumi

Sistema de gestión documental digital para la trazabilidad de trámites y expedientes de la Municipalidad Distrital de Mochumi, Lambayeque, Perú.

![Escudo de Mochumi](public/logo-mochumi.png)

## 📋 Descripción del Proyecto

Mesa de Partes Digital es una plataforma web moderna desarrollada con React que permite a los ciudadanos y al personal municipal gestionar trámites documentales de manera completamente digital, disponible 24/7 y con total transparencia en el seguimiento.

### 🎯 Objetivo Principal

Implementar una Mesa de Partes Digital que permita registrar trámites, adjuntar documentos y realizar seguimiento en línea, garantizando trazabilidad y atención oportuna al ciudadano.

## ✨ Características Principales

### Para Ciudadanos
- ✅ Registro y autenticación segura
- 📄 Registro de trámites en línea
- 📎 Adjuntar documentos digitales (PDF, imágenes)
- 🔍 Seguimiento en tiempo real del estado del expediente
- 🔔 Notificaciones automáticas por email/SMS
- 📊 Historial completo de trámites
- 🌐 Acceso 24/7 desde cualquier dispositivo

### Para Personal Municipal
- 👥 Gestión de expedientes por área
- 🔄 Workflow de derivación automatizado
- ⏰ Alertas de vencimiento de plazos
- 📝 Registro de observaciones
- 📈 Dashboard con estadísticas
- 🔐 Control de acceso basado en roles (RBAC)

### Para Área de TI
- 🛠️ CRUD completo de usuarios
- 🎭 Asignación de roles y permisos
- 📊 Auditoría de acciones
- ⚙️ Configuración del sistema

## 🔒 Seguridad de la Información

- 🔐 Cifrado de datos sensibles
- 🔑 Autenticación robusta con Supabase Auth
- 👤 Control de acceso basado en roles (RBAC)
- 📝 Registro de auditoría completo
- 🛡️ Row Level Security (RLS) en base de datos
- 🔒 Políticas de acceso granulares

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.3** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router 6** - Navegación
- **Tailwind CSS** - Estilos y diseño responsivo
- **Lucide React** - Íconos
- **Zustand** - State management
- **React Hot Toast** - Notificaciones

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage
  - Row Level Security
  - Real-time subscriptions

## 🎨 Diseño

El sistema utiliza una paleta de colores basada en el escudo oficial de Mochumi:

- **Azul Primary** (#0087FF) - Color institucional principal
- **Amarillo Secondary** (#FFCD32) - Sol y antorcha
- **Verde Accent** (#4CAF50) - Caña y agricultura
- **Rojo Danger** (#F44336) - Llama y alertas

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm/yarn
- Cuenta en Supabase (gratuita)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/IgnacioAlP/Mesa_De_Partes_Digital.git
cd Mesa_De_Partes_Digital
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script `supabase_schema.sql` en el SQL Editor de Supabase
3. Ejecutar el script `supabase_data.sql` para cargar datos de simulación
4. Configurar Storage bucket para documentos

### Paso 4: Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Paso 5: Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
Mesa_De_Partes_Digital/
├── public/
│   └── logo-mochumi.png        # Logo de la municipalidad
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Layout principal
│   │   └── ProtectedRoute.jsx  # HOC para rutas protegidas
│   ├── lib/
│   │   └── supabase.js         # Cliente de Supabase
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx       # Página de inicio de sesión
│   │   │   └── Register.jsx    # Página de registro
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx   # Dashboard principal
│   │   └── public/
│   │       └── Home.jsx         # Página pública inicial
│   ├── store/
│   │   └── authStore.js        # Store de autenticación
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globales
├── supabase_schema.sql         # Esquema de base de datos
├── supabase_data.sql           # Datos de simulación
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 👥 Roles y Permisos

### Ciudadano
- Ver y crear sus propios trámites
- Seguimiento de expedientes
- Recibir notificaciones
- Subir documentos

### Mesa de Partes
- Recibir y registrar expedientes
- Verificar requisitos
- Derivar a áreas correspondientes
- Generar reportes

### Área de Trámite
- Gestionar expedientes de su área
- Procesar solicitudes
- Generar observaciones
- Aprobar/rechazar trámites

### Alcalde
- Vista completa de expedientes
- Aprobación de trámites críticos
- Reportes ejecutivos

### TI
- Gestión completa de usuarios
- Asignación de roles
- Configuración del sistema
- Acceso a auditoría

## 📊 Base de Datos

### Tablas Principales

- **usuarios** - Información de usuarios del sistema
- **tipos_tramite** - Catálogo de tipos de trámites
- **expedientes** - Registro de expedientes
- **documentos** - Archivos adjuntos
- **derivaciones** - Workflow de derivación
- **historial_estados** - Trazabilidad de cambios
- **observaciones** - Comentarios y requerimientos
- **notificaciones** - Alertas para usuarios
- **auditoria** - Log de acciones del sistema

## 🔄 Workflow de Trámites

1. **Ciudadano** solicita el trámite online
2. **Mesa de Partes** recibe y verifica requisitos
3. Sistema valida documentos y genera expediente
4. **Mesa de Partes** deriva a área correspondiente
5. **Área** procesa el trámite
6. Si requiere subsanación → Observación → Ciudadano
7. **Área** aprueba/rechaza
8. **Alcalde** firma (si aplica)
9. Expediente finalizado
10. Notificación al ciudadano

## 📱 Funcionalidades Futuras (Roadmap)

- [ ] Módulo de pagos en línea
- [ ] App móvil nativa (iOS/Android)
- [ ] Firma digital integrada
- [ ] Integración con RENIEC para validación de identidad
- [ ] Dashboard de analítica avanzada
- [ ] Chatbot para consultas frecuentes
- [ ] Exportación masiva de reportes
- [ ] API pública para integraciones

## 🧪 Datos de Prueba

El sistema incluye datos de simulación realistas:

### Usuarios de Prueba
- **TI:** ti@mochumi.gob.pe
- **Mesa de Partes:** mesapartes@mochumi.gob.pe
- **Ciudadano:** juan.garcia@email.com

*Nota: Las contraseñas deben configurarse durante el registro inicial*

### Trámites Comunes Incluidos
- Licencia de Funcionamiento
- Certificado de Residencia
- Certificado de Numeración
- Licencia de Edificación
- Certificado Catastral
- Certificado de No Adeudo
- Libro de Reclamaciones

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de la **Municipalidad Distrital de Mochumi**.

## 👨‍💻 Autor

Desarrollado para la Municipalidad Distrital de Mochumi, Lambayeque, Perú.

## 📞 Contacto

- **Municipalidad:** mesapartes@mochumi.gob.pe
- **Soporte Técnico:** ti@mochumi.gob.pe
- **Teléfono:** (074) 123-4567

---

**Tierra Fértil - Mochumi** 🌾🔥

*Sistema de Mesa de Partes Digital - Transformación Digital del Gobierno Local*

