-- =====================================================
-- ACTUALIZACIÓN DE REQUISITOS DE TRÁMITES
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Primero cambiar el tipo de dato de requisitos de TEXT[] a TEXT
ALTER TABLE tipos_tramite 
ALTER COLUMN requisitos TYPE TEXT;

-- Actualizar Licencia de Funcionamiento
UPDATE tipos_tramite 
SET 
  descripcion = 'Autorización municipal para el desarrollo de actividades económicas en establecimientos comerciales según Ley N° 28976',
  requisitos = 'Solicitud única de Licencia de Funcionamiento con carácter de declaración jurada dirigida al Alcalde (formato TUPA)
Vigencia de poder del representante legal en caso de personas jurídicas o carta poder simple con firma legalizada en caso de personas naturales
Declaración Jurada de Observancia de Condiciones de Seguridad en Defensa Civil (formulario proporcionado por la municipalidad)
Copia simple del DNI del titular o representante legal
Copia simple del RUC y comprobante de información registrada actualizado (no mayor a 30 días)
Documento que acredite la propiedad o la posesión legítima del predio (título de propiedad, contrato de alquiler vigente o cesión de uso)
Plano de distribución (croquis) del establecimiento con medidas y áreas, firmado por el titular
Copia de autorización sectorial en caso de actividades reguladas (salud, educación, farmacias, etc.)
Declaración Jurada de cumplir con las normas de zonificación y compatibilidad de uso
Recibo de pago por derecho de trámite según TUPA municipal
Certificado de Inspección Técnica de Seguridad en Defensa Civil Básica o de Detalle según corresponda (solo para giros con ITSDC obligatorio: establecimientos mayores a 100 m² o con aforo mayor a 50 personas)'
WHERE codigo = 'LIC-FUNC';

-- Actualizar Certificado de Residencia
UPDATE tipos_tramite 
SET 
  descripcion = 'Documento oficial que acredita el domicilio habitual del solicitante en la jurisdicción del distrito de Mochumi',
  requisitos = 'Solicitud simple dirigida al Alcalde especificando el domicilio a certificar y el motivo del requerimiento
Copia simple del DNI vigente del solicitante (original para verificación)
Recibo de servicio público a nombre del solicitante (agua, luz o teléfono) de los últimos dos meses como máximo
Declaración jurada de residencia indicando dirección exacta, tiempo de residencia y referencias del domicilio
Documento que acredite la propiedad o posesión del inmueble (escritura pública, contrato de alquiler, constancia de posesión o autorización del propietario)
Dos testigos domiciliados en el distrito con copia de DNI vigente que acrediten mediante declaración jurada la residencia del solicitante (mínimo 6 meses)
Fotografía reciente del inmueble mostrando la fachada con número visible (formato digital o impreso)
Croquis de ubicación del domicilio indicando calles adyacentes, referencias y puntos de referencia cercanos
Recibo de pago por derecho de trámite según TUPA municipal'
WHERE codigo = 'CERT-RESID';

-- Actualizar Certificado de Numeración Municipal
UPDATE tipos_tramite 
SET 
  descripcion = 'Documento oficial que asigna o certifica el número municipal de un predio para su identificación oficial en el distrito',
  requisitos = 'Solicitud dirigida al Alcalde indicando la dirección referencial del predio y el motivo del requerimiento
Copia simple del DNI vigente del propietario o representante legal autorizado
Copia literal de dominio expedida por SUNARP (Registros Públicos) con vigencia no mayor a 30 días o título de propiedad inscrito
Plano de ubicación y localización del predio a escala mínima 1:500 firmado por ingeniero o arquitecto colegiado (indicando linderos, medidas perimétricas y área total)
Certificado de Parámetros Urbanísticos y Edificatorios vigente expedido por la municipalidad (no mayor a 2 años)
Declaración jurada de no contar con numeración municipal asignada anteriormente o solicitar rectificación de numeración existente
Memoria descriptiva del predio indicando características físicas, área del terreno, uso actual y ubicación exacta
Certificado de búsqueda catastral o plano catastral del predio (emitido por el área de Catastro municipal)
Fotografías actuales del predio: fachada principal, laterales y vista panorámica del entorno (mínimo 4 fotografías a color)
Recibo de pago por derecho de trámite según TUPA municipal'
WHERE codigo = 'CERT-NUMERACION';

-- Actualizar Licencia de Edificación
UPDATE tipos_tramite 
SET 
  descripcion = 'Autorización municipal para ejecutar obras de construcción, ampliación, remodelación, refacción, demolición o habilitación urbana según Ley N° 29090',
  requisitos = 'Formulario Único de Edificación (FUE) debidamente llenado y firmado por el propietario y los profesionales responsables (arquitecto, ingeniero civil, eléctrico y sanitario)
Copia simple del DNI vigente del propietario o representante legal y de todos los profesionales responsables del proyecto
Planos de arquitectura a escala (plantas, cortes, elevaciones, ubicación y localización) firmados y sellados por arquitecto colegiado
Planos de estructuras (cimentación, aligerados, columnas, vigas) firmados y sellados por ingeniero civil colegiado
Planos de instalaciones eléctricas (alumbrado, tomacorrientes, tableros) firmados y sellados por ingeniero electricista o electrónico colegiado
Planos de instalaciones sanitarias (agua potable, desagüe, drenaje pluvial) firmados y sellados por ingeniero sanitario o civil colegiado
Memoria descriptiva completa del proyecto arquitectónico indicando características, áreas, especificaciones técnicas y acabados
Memoria de cálculo de estructuras justificando el diseño estructural (para edificaciones de más de 2 pisos)
Estudio de Mecánica de Suelos (EMS) con mínimo 3 calicatas firmado por ingeniero civil especialista (obligatorio para edificaciones de más de 3 pisos o mayor a 500 m²)
Certificado de Parámetros Urbanísticos y Edificatorios vigente (CPE) expedido por la municipalidad con antigüedad no mayor a 2 años
Certificado de Factibilidad de Servicios de agua potable y alcantarillado emitido por la empresa prestadora del servicio (EPS)
Certificado de Factibilidad de Suministro Eléctrico emitido por la empresa concesionaria de electricidad
Copia literal de dominio del predio inscrito en Registros Públicos con vigencia no mayor a 30 días
Declaración jurada de habilitación de los profesionales responsables (copia de hoja de vida del Colegio Profesional vigente)
Póliza CAR (Todo Riesgo Contratista) o póliza de responsabilidad civil según el tipo y envergadura de la obra
Recibo de pago por derecho de trámite calculado según el valor de la obra de acuerdo al TUPA municipal (porcentaje de la UIT)'
WHERE codigo = 'LIC-EDIF';

-- Actualizar Certificado Catastral
UPDATE tipos_tramite 
SET 
  descripcion = 'Documento oficial que certifica las características físicas, legales, registrales y económicas de un predio según la información del Sistema de Catastro Municipal',
  requisitos = 'Solicitud dirigida al Alcalde especificando el código catastral municipal o dirección exacta del predio a certificar
Copia simple del DNI vigente del propietario registral o persona autorizada mediante carta poder
Copia literal de dominio expedida por SUNARP (Registros Públicos) con vigencia no mayor a 30 días que acredite la titularidad del predio
Ubicación exacta y completa del predio: dirección domiciliaria, número municipal, lote, manzana, sector, urbanización o asentamiento humano
Código catastral municipal del predio si se conoce (código de 12 o 15 dígitos asignado por Catastro)
Plano de ubicación y localización del predio a escala 1:500 o croquis de ubicación con referencias y medidas perimétricas
Carta poder simple con firma legalizada notarialmente si el trámite es realizado por tercera persona autorizada (adjuntar copia de DNI del representante)
Declaración jurada manifestando la conformidad de los datos proporcionados y la finalidad del certificado solicitado
Recibo de pago actualizado de impuesto predial o constancia de no adeudo de tributos municipales (opcional según municipio)
Recibo de pago por derecho de trámite según TUPA municipal'
WHERE codigo = 'CERT-CATASTRAL';

-- Actualizar Fraccionamiento de Deuda Tributaria
UPDATE tipos_tramite 
SET 
  descripcion = 'Permite fraccionar el pago de deudas tributarias municipales (impuesto predial, arbitrios municipales, multas tributarias y administrativas) en cuotas mensuales según normativa del Código Tributario',
  requisitos = 'Solicitud con firma legalizada notarialmente dirigida al Alcalde o Gerente de Administración Tributaria y Rentas solicitando acogimiento al fraccionamiento
Copia simple del DNI vigente del contribuyente titular de la deuda o representante legal con poder inscrito en Registros Públicos
Copia del RUC en caso de persona jurídica y vigencia de poder del representante legal no mayor a 30 días
Estado de cuenta de la deuda tributaria actualizada emitida por el área de Rentas o Administración Tributaria municipal (detalle de impuestos, arbitrios, multas e intereses)
Declaración jurada detallada de situación económica del contribuyente especificando ingresos mensuales, egresos fijos y patrimonio disponible
Documentos que sustenten la capacidad de pago: boletas de pago, recibos por honorarios, declaraciones juradas de renta, estados de cuenta bancarios (últimos 3 meses)
Cronograma de pagos propuesto por el contribuyente indicando número de cuotas mensuales solicitadas y monto estimado por cuota (máximo 72 cuotas según normativa)
Declaración jurada de no contar con fraccionamientos tributarios vigentes anteriores o en mora con la municipalidad
Comprobante de pago de la cuota inicial o cuota de entrada equivalente al mínimo 10% del monto total de la deuda (requisito obligatorio para aprobación)
Garantía real o personal según el monto de la deuda: carta fianza bancaria, hipoteca de primer rango o aval solidario (para deudas mayores a 10 UIT)
Compromiso de pago firmado aceptando las condiciones del fraccionamiento y las consecuencias por incumplimiento de cuotas
Recibo de pago por derecho de trámite según TUPA municipal (si aplica)'
WHERE codigo = 'SOL-IMPUESTO';

-- Actualizar Certificado de No Adeudo
UPDATE tipos_tramite 
SET 
  descripcion = 'Documento oficial que certifica que el contribuyente no registra deudas pendientes por concepto de tributos municipales (impuesto predial, arbitrios, multas)',
  requisitos = 'Solicitud simple dirigida al Alcalde o Gerente de Administración Tributaria y Rentas especificando el predio o contribuyente a certificar
Copia simple del DNI vigente del propietario registral del predio o contribuyente titular
Número de código de contribuyente municipal asignado por Rentas (código de 10 dígitos) si se conoce
Código catastral del predio o dirección exacta y completa del inmueble (calle, número, lote, manzana, urbanización, sector)
Copia simple del último recibo de pago de impuesto predial o arbitrios municipales cancelado
Copia simple del título de propiedad, escritura pública o documento registral que acredite la titularidad del predio consultado
Copia literal de dominio expedida por SUNARP con vigencia no mayor a 30 días (opcional pero recomendable)
Carta poder simple con firma legalizada si el trámite es realizado por tercera persona (adjuntar copia de DNI del autorizado)
Declaración jurada manifestando que el predio no tiene cargas tributarias pendientes a conocimiento del solicitante
Recibo de pago por derecho de trámite según TUPA municipal'
WHERE codigo = 'CERT-NO-ADEUDO';

-- Actualizar Libro de Reclamaciones
UPDATE tipos_tramite 
SET 
  descripcion = 'Mecanismo de presentación formal de quejas, reclamos, sugerencias o felicitaciones sobre servicios municipales y atención al ciudadano según Ley N° 29571 (Código de Protección y Defensa del Consumidor)',
  requisitos = 'Formulario oficial de reclamo o queja disponible en Mesa de Partes presencial, plataforma virtual municipal o aplicativo móvil (formato físico o digital)
Copia simple del DNI vigente del reclamante ciudadano o usuario del servicio municipal
Número de expediente, comprobante de pago o código de atención relacionado con el servicio reclamado (si aplica)
Descripción detallada y específica del motivo del reclamo: servicio deficiente, demora excesiva, mala atención, incumplimiento de plazos, cobros indebidos, etc.
Fecha exacta y hora aproximada en que ocurrieron los hechos que motivan el reclamo
Identificación del área municipal, funcionario o personal involucrado en el hecho reclamado (nombres, cargo, oficina)
Documentos probatorios que sustenten el reclamo: fotografías, videos, correos electrónicos, comunicaciones previas, copia de documentos presentados, constancias, etc.
Petición concreta y solución esperada por el reclamante: rectificación, devolución, disculpas, sanción, agilización del trámite, etc.
Evidencias adicionales relevantes: testigos, grabaciones, capturas de pantalla, notificaciones recibidas
Datos de contacto actualizados del reclamante: teléfono, correo electrónico y dirección domiciliaria para recibir la respuesta municipal
Declaración jurada de veracidad de los hechos expuestos en el reclamo bajo responsabilidad del reclamante'
WHERE codigo = 'LIBRO-RECLAMO';

-- Verificar las actualizaciones
SELECT codigo, nombre, 
       LENGTH(requisitos) as longitud_requisitos,
       (LENGTH(requisitos) - LENGTH(REPLACE(requisitos, E'\n', ''))) + 1 as numero_requisitos
FROM tipos_tramite
ORDER BY codigo;
