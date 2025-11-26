-- =====================================================
-- ACTUALIZACIÓN DE PLAZOS SEGÚN NORMATIVA LEGAL PERUANA
-- Basado en Ley N° 27444, Ley N° 28976, Ley N° 29090
-- =====================================================

-- Los plazos deben ser en DÍAS HÁBILES según normativa peruana

-- Licencia de Funcionamiento: 15 días hábiles (Ley N° 28976, Art. 10)
-- Para establecimientos hasta 100 m² es automática, más de 100 m² requiere inspección
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 15
WHERE codigo = 'LIC-FUNC';

-- Certificado de Residencia: 7 días hábiles (procedimiento simple)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 7
WHERE codigo = 'CERT-RESID';

-- Certificado de Numeración: 15 días hábiles (procedimiento de evaluación previa)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 15
WHERE codigo = 'CERT-NUMERACION';

-- Licencia de Edificación: 
-- Modalidad A y B: 15 días hábiles
-- Modalidad C y D: 30 días hábiles (Ley N° 29090)
-- Promedio: 30 días para cubrir todos los tipos
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 30
WHERE codigo = 'LIC-EDIF';

-- Certificado Catastral: 10 días hábiles (procedimiento de emisión de certificados)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 10
WHERE codigo = 'CERT-CATASTRAL';

-- Fraccionamiento de Deuda: 15 días hábiles (evaluación administrativa)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 15
WHERE codigo = 'SOL-IMPUESTO';

-- Certificado de No Adeudo: 5 días hábiles (verificación en sistema)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 5
WHERE codigo = 'CERT-NO-ADEUDO';

-- Libro de Reclamaciones: 30 días hábiles (plazo máximo de respuesta según Ley N° 27444, Art. 142)
UPDATE tipos_tramite 
SET tiempo_maximo_dias = 30
WHERE codigo = 'LIBRO-RECLAMO';

-- Verificar actualizaciones
SELECT codigo, nombre, tiempo_maximo_dias, 
       CASE 
         WHEN tiempo_maximo_dias <= 7 THEN 'Procedimiento Rápido'
         WHEN tiempo_maximo_dias <= 15 THEN 'Procedimiento Normal'
         WHEN tiempo_maximo_dias <= 30 THEN 'Procedimiento con Evaluación Previa'
         ELSE 'Procedimiento Complejo'
       END as clasificacion
FROM tipos_tramite
ORDER BY codigo;

-- =====================================================
-- REFERENCIAS LEGALES:
-- =====================================================
-- Ley N° 27444: Ley del Procedimiento Administrativo General
--   - Art. 142: Plazo máximo 30 días hábiles para procedimientos de evaluación previa
--   - Art. 31.1: Silencio administrativo positivo si no hay respuesta en plazo
--
-- Ley N° 28976: Marco de Licencias de Funcionamiento
--   - Art. 10: Plazo máximo 15 días hábiles
--   - Hasta 100 m² o aforo 20 personas: automática
--   - Más de 100 m²: requiere inspección ITSDC
--
-- Ley N° 29090: Regulación de Habilitaciones Urbanas y Licencias de Edificación
--   - Modalidad A (hasta 120 m²): 15 días hábiles
--   - Modalidad B (120-3000 m²): 15 días hábiles
--   - Modalidad C (3000-10000 m²): 30 días hábiles
--   - Modalidad D (más de 10000 m²): 30 días hábiles
--
-- NOTA: Los plazos son en DÍAS HÁBILES (de lunes a viernes, excluyendo feriados)
-- =====================================================
