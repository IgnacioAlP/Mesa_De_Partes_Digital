# 🚀 Guía de Despliegue a Producción

Esta guía detalla los pasos para desplegar Mesa de Partes Digital en producción.

## Opciones de Hosting

### Opción 1: Vercel (Recomendado para Frontend)

#### Ventajas
- ✅ Deployment automático desde GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Preview deployments
- ✅ Fácil configuración

#### Pasos

1. **Preparar el Proyecto**
```bash
npm run build
```

2. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta con GitHub

3. **Importar Proyecto**
   - Click en "New Project"
   - Selecciona el repositorio
   - Configura:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. **Configurar Variables de Entorno**
   - Ve a Settings > Environment Variables
   - Agrega:
     ```
     VITE_SUPABASE_URL=tu_url_produccion
     VITE_SUPABASE_ANON_KEY=tu_key_produccion
     ```

5. **Deploy**
   - Click en "Deploy"
   - Espera a que termine el build
   - Tu app estará en: https://tu-proyecto.vercel.app

### Opción 2: Netlify

#### Pasos

1. **Crear archivo `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy desde GitHub**
   - Conecta repositorio en [netlify.com](https://netlify.com)
   - Configura variables de entorno
   - Deploy automático

### Opción 3: AWS S3 + CloudFront

Para mayor control y escalabilidad.

## Configuración de Producción

### 1. Supabase en Producción

#### 1.1. Actualizar URL Configuration
```
Site URL: https://tu-dominio.com
Redirect URLs: https://tu-dominio.com/**
```

#### 1.2. Habilitar Email Confirmation
- Authentication > Providers > Email
- Enable "Confirm email" = ON

#### 1.3. Configurar SMTP Personalizado (Recomendado)
- Settings > Auth > SMTP Settings
- Usa servicio como SendGrid, Mailgun, o AWS SES

### 2. Variables de Entorno

#### Desarrollo (.env.development)
```env
VITE_SUPABASE_URL=https://dev.supabase.co
VITE_SUPABASE_ANON_KEY=dev_key
```

#### Producción (.env.production)
```env
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
```

### 3. Optimizaciones de Build

#### 3.1. Actualizar vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
  }
})
```

### 4. Seguridad en Producción

#### 4.1. Actualizar Content Security Policy

Agregar en `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://*.supabase.co;">
```

#### 4.2. Configurar CORS en Supabase
- Settings > API > CORS Configuration
- Agrega tu dominio de producción

#### 4.3. Rate Limiting
Implementar en Supabase Edge Functions o usar Cloudflare

### 5. Monitoreo y Analytics

#### 5.1. Google Analytics (Opcional)
```javascript
// src/lib/analytics.js
export const initGA = () => {
  if (typeof window !== 'undefined') {
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }
};
```

#### 5.2. Sentry para Error Tracking
```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### 6. Dominio Personalizado

#### 6.1. Comprar Dominio
- Ejemplo: mesapartes.mochumi.gob.pe
- Proveedores: GoDaddy, Namecheap, etc.

#### 6.2. Configurar DNS

En Vercel/Netlify:
- Agrega dominio custom
- Configura registros DNS:
  ```
  Type: A
  Name: mesapartes
  Value: [IP del proveedor]
  
  Type: CNAME
  Name: www
  Value: tu-proyecto.vercel.app
  ```

#### 6.3. SSL Certificate
- Automático en Vercel/Netlify
- Let's Encrypt gratuito

### 7. CI/CD Pipeline

#### 7.1. GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 8. Backup y Recuperación

#### 8.1. Backup de Base de Datos
```bash
# Script de backup automático
pg_dump -h db.xxx.supabase.co -U postgres > backup_$(date +%Y%m%d).sql
```

#### 8.2. Backup de Storage
- Configurar replicación en Supabase
- Backup periódico de bucket "documentos"

### 9. Performance

#### 9.1. Lighthouse Score Objetivo
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

#### 9.2. Optimizaciones
- ✅ Lazy loading de rutas
- ✅ Image optimization
- ✅ Code splitting
- ✅ Service Worker (PWA)

### 10. Checklist Pre-Deploy

- [ ] Tests pasando
- [ ] Build sin errores
- [ ] Variables de entorno configuradas
- [ ] Supabase en modo producción
- [ ] RLS políticas verificadas
- [ ] CORS configurado
- [ ] Email templates personalizados
- [ ] SSL certificate activo
- [ ] Dominio configurado
- [ ] Monitoreo configurado
- [ ] Backup automático activado
- [ ] Documentación actualizada

### 11. Post-Deploy

#### Verificaciones
1. ✅ Login funciona
2. ✅ Registro funciona
3. ✅ Upload de archivos funciona
4. ✅ Notificaciones funcionan
5. ✅ Todos los roles pueden acceder
6. ✅ Mobile responsive
7. ✅ Performance aceptable

#### Comunicación
- Enviar email a usuarios registrados
- Publicar en redes sociales de la municipalidad
- Capacitar al personal municipal

### 12. Mantenimiento

#### Actualizaciones
```bash
# Actualizar dependencias regularmente
npm update
npm audit fix
```

#### Monitoring
- Revisar logs diariamente
- Verificar uptime
- Monitorear errores en Sentry
- Revisar métricas de Supabase

---

## Soporte

Para soporte técnico:
- Email: ti@mochumi.gob.pe
- Teléfono: (074) 123-4567

## Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-to-prod)
