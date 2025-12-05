# 📄 Generador de Documentos PDF de Ejemplo

Este directorio contiene scripts para generar documentos PDF realistas que simulan los archivos requeridos para los trámites municipales.

## 🚀 Uso Rápido

### 1. Instalar dependencias

```powershell
cd generador_pdfs
pip install -r requirements.txt
```

### 2. Generar documentos

```powershell
python generar_documentos_ejemplo.py
```

Los archivos PDF se generarán en la carpeta `documentos_ejemplo/`

## 📁 Documentos Generados

El script genera los siguientes documentos de ejemplo:

1. **Solicitud de Licencia de Funcionamiento** - Formato oficial con membrete municipal
2. **DNI (Simulado)** - Documento Nacional de Identidad de ejemplo
3. **Ficha RUC** - Comprobante de información registrada SUNAT

## 🎨 Características

- ✅ Formato oficial con encabezado y pie de página municipal
- ✅ Datos realistas (nombres, direcciones, RUC, DNI)
- ✅ Tablas y estilos profesionales
- ✅ Cumple con formatos estándar peruanos
- ✅ Listo para usar en demostraciones

## 📦 Dependencias

- `reportlab` - Generación de PDFs
- `Pillow` - Procesamiento de imágenes (si se agregan logos)

## 🔧 Personalización

Puedes modificar los datos en `generar_documentos_ejemplo.py`:

- Nombres de personas
- Direcciones
- RUC y DNI
- Fechas
- Contenido de solicitudes

## 📝 Notas

Los documentos generados son **solo para fines educativos y de demostración**. 
No deben usarse para trámites reales.

---

*Municipalidad Distrital de Mochumi - Sistema Mesa de Partes Digital*
