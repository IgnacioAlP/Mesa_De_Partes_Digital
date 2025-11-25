# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Mesa de Partes Digital! Esta guía te ayudará a empezar.

## 📋 Código de Conducta

Este proyecto se rige por un código de conducta que todos los contribuyentes deben seguir:

- Sé respetuoso y considerado con otros
- Acepta críticas constructivas
- Enfócate en lo mejor para la comunidad
- Muestra empatía hacia otros miembros

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. Verifica que no esté ya reportado en [Issues](https://github.com/IgnacioAlP/Mesa_De_Partes_Digital/issues)
2. Si es nuevo, crea un issue con:
   - Título descriptivo
   - Descripción detallada del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es posible
   - Información del sistema (navegador, OS, etc.)

**Template de Bug Report:**
```markdown
## Descripción del Bug
[Descripción clara y concisa]

## Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

## Comportamiento Esperado
[Qué debería pasar]

## Comportamiento Actual
[Qué está pasando]

## Screenshots
[Si aplica]

## Entorno
- OS: [ej. Windows 11]
- Navegador: [ej. Chrome 119]
- Versión: [ej. 1.0.0]
```

### Sugerir Mejoras

Para sugerir nuevas características:

1. Abre un issue con el tag `enhancement`
2. Describe claramente:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Impacto en usuarios existentes

**Template de Feature Request:**
```markdown
## Problema a Resolver
[Descripción del problema]

## Solución Propuesta
[Tu idea de solución]

## Alternativas Consideradas
[Otras opciones que consideraste]

## Información Adicional
[Contexto adicional, mockups, etc.]
```

### Pull Requests

#### Antes de Empezar

1. **Fork el repositorio**
2. **Clona tu fork**
   ```bash
   git clone https://github.com/tu-usuario/Mesa_De_Partes_Digital.git
   cd Mesa_De_Partes_Digital
   ```

3. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
   
   Convenciones de nombres de rama:
   - `feature/` - Nueva funcionalidad
   - `bugfix/` - Corrección de bug
   - `hotfix/` - Fix urgente en producción
   - `refactor/` - Refactorización de código
   - `docs/` - Cambios en documentación

#### Durante el Desarrollo

1. **Mantén commits atómicos y descriptivos**
   ```bash
   git commit -m "feat: agregar validación de DNI en registro"
   ```

2. **Convención de commits** (Conventional Commits):
   - `feat:` - Nueva característica
   - `fix:` - Corrección de bug
   - `docs:` - Cambios en documentación
   - `style:` - Formateo, punto y coma, etc.
   - `refactor:` - Refactorización de código
   - `test:` - Agregar o modificar tests
   - `chore:` - Tareas de mantenimiento

3. **Escribe código limpio**
   - Sigue las convenciones de JavaScript/React
   - Usa nombres descriptivos
   - Comenta código complejo
   - Mantén funciones pequeñas y enfocadas

4. **Actualiza documentación**
   - Si cambias funcionalidad, actualiza README
   - Documenta nuevas características
   - Actualiza comentarios en código

#### Crear Pull Request

1. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

2. **Abre Pull Request en GitHub**
   - Título descriptivo
   - Descripción detallada de cambios
   - Referencia a issues relacionados (#123)
   - Screenshots de cambios visuales

**Template de Pull Request:**
```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## Relacionado con
Closes #123

## Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] No hay warnings nuevos
- [ ] He probado en diferentes navegadores

## Screenshots
[Si aplica]
```

## 🏗️ Estructura del Código

### Organización de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Páginas/Vistas
│   ├── auth/
│   ├── dashboard/
│   └── public/
├── store/              # State management (Zustand)
│   └── authStore.js
├── lib/                # Utilidades y configuración
│   └── supabase.js
├── hooks/              # Custom React hooks
└── utils/              # Funciones auxiliares
```

### Convenciones de Código

#### Componentes React
```javascript
// Usar function en lugar de arrow function para componentes
function ComponentName({ prop1, prop2 }) {
  // Hooks al inicio
  const [state, setState] = useState();
  
  // Funciones de manejo
  const handleClick = () => {
    // ...
  };
  
  // Early returns para casos especiales
  if (!prop1) return null;
  
  // Render principal
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

#### Estilos con Tailwind
```javascript
// Preferir className sobre inline styles
<button className="btn btn-primary">
  Click me
</button>

// Para estilos dinámicos, usar template literals
<div className={`badge ${isActive ? 'badge-success' : 'badge-info'}`}>
  Status
</div>
```

#### Manejo de Estado
```javascript
// Zustand para estado global
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// useState para estado local
function Component() {
  const [loading, setLoading] = useState(false);
  // ...
}
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Escribir Tests
```javascript
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 📝 Documentación

### Comentarios en Código
```javascript
/**
 * Calcula el tiempo restante para un expediente
 * @param {Date} fechaLimite - Fecha límite del expediente
 * @returns {number} Días restantes
 */
function calcularDiasRestantes(fechaLimite) {
  // Implementación
}
```

### README
- Mantén actualizado el README principal
- Documenta nuevas características
- Actualiza instrucciones de instalación si es necesario

## 🔍 Code Review

Tu PR será revisado por mantenedores del proyecto. Pueden solicitar cambios:

1. **Responde a comentarios**
2. **Haz los cambios solicitados**
3. **Push los cambios** (se actualizará el PR automáticamente)
4. **Marca conversaciones como resueltas**

## 📊 Métricas de Calidad

Mantén estos estándares:

- **Code Coverage:** > 70%
- **Lighthouse Performance:** > 90
- **Accessibility Score:** > 95
- **No console errors** en producción
- **ESLint warnings:** 0

## 🎨 Diseño UI/UX

Si contribuyes con cambios visuales:

1. **Sigue la paleta de colores** de Mochumi
2. **Mantén consistencia** con componentes existentes
3. **Asegura responsive design** (mobile-first)
4. **Verifica accesibilidad** (contraste, ARIA labels)

## 🐛 Debugging

### Herramientas Útiles
- React DevTools
- Redux DevTools (para Zustand)
- Supabase Dashboard
- Chrome DevTools

### Tips
```javascript
// Use console.log con contexto
console.log('[ComponentName] Estado actual:', state);

// Debug en desarrollo
if (import.meta.env.DEV) {
  console.log('Debug info');
}
```

## 📞 Contacto

¿Preguntas? Contáctanos:

- **Email:** ti@mochumi.gob.pe
- **GitHub Issues:** Para preguntas técnicas
- **Discussions:** Para ideas y preguntas generales

## 🎯 Prioridades Actuales

Áreas que necesitan contribuciones:

1. ✅ Tests unitarios
2. 📱 Mejoras mobile
3. ♿ Accesibilidad
4. 🌍 Internacionalización
5. 📊 Dashboards y reportes
6. 🔔 Sistema de notificaciones

## 📜 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a Mesa de Partes Digital! 🎉

**Municipalidad Distrital de Mochumi**  
*Transformación Digital del Gobierno Local*
