-- Datos de Simulación para Mesa de Partes Digital
-- Municipalidad Distrital de Mochumi

-- =====================================================
-- INSERTAR TIPOS DE TRÁMITE COMUNES
-- =====================================================

INSERT INTO tipos_tramite (codigo, nombre, descripcion, requisitos, tiempo_maximo_dias, costo, area_responsable, es_comun) VALUES
('LIC-FUNC', 'Licencia de Funcionamiento', 'Autorización municipal para el desarrollo de actividades económicas en establecimientos comerciales según Ley N° 28976', 
'Solicitud única de Licencia de Funcionamiento con carácter de declaración jurada dirigida al Alcalde (formato TUPA)
Vigencia de poder del representante legal en caso de personas jurídicas o carta poder simple con firma legalizada en caso de personas naturales
Declaración Jurada de Observancia de Condiciones de Seguridad en Defensa Civil (formulario proporcionado por la municipalidad)
Copia simple del DNI del titular o representante legal
Copia simple del RUC y comprobante de información registrada actualizado (no mayor a 30 días)
Documento que acredite la propiedad o la posesión legítima del predio (título de propiedad, contrato de alquiler vigente o cesión de uso)
Plano de distribución (croquis) del establecimiento con medidas y áreas, firmado por el titular
Copia de autorización sectorial en caso de actividades reguladas (salud, educación, farmacias, etc.)
Declaración Jurada de cumplir con las normas de zonificación y compatibilidad de uso
Recibo de pago por derecho de trámite según TUPA municipal
Certificado de Inspección Técnica de Seguridad en Defensa Civil Básica o de Detalle según corresponda (solo para giros con ITSDC obligatorio: establecimientos mayores a 100 m² o con aforo mayor a 50 personas)', 
15, 150.00, 'Desarrollo Económico', true),

('CERT-RESID', 'Certificado de Residencia', 'Documento oficial que acredita el domicilio habitual del solicitante en la jurisdicción del distrito de Mochumi',
'Solicitud simple dirigida al Alcalde especificando el domicilio a certificar y el motivo del requerimiento
Copia simple del DNI vigente del solicitante (original para verificación)
Recibo de servicio público a nombre del solicitante (agua, luz o teléfono) de los últimos dos meses como máximo
Declaración jurada de residencia indicando dirección exacta, tiempo de residencia y referencias del domicilio
Documento que acredite la propiedad o posesión del inmueble (escritura pública, contrato de alquiler, constancia de posesión o autorización del propietario)
Dos testigos domiciliados en el distrito con copia de DNI vigente que acrediten mediante declaración jurada la residencia del solicitante (mínimo 6 meses)
Fotografía reciente del inmueble mostrando la fachada con número visible (formato digital o impreso)
Croquis de ubicación del domicilio indicando calles adyacentes, referencias y puntos de referencia cercanos
Recibo de pago por derecho de trámite según TUPA municipal',
5, 15.00, 'Secretaría General', true),

('CERT-NUMERACION', 'Certificado de Numeración Municipal', 'Documento oficial que asigna o certifica el número municipal de un predio para su identificación oficial en el distrito',
'Solicitud dirigida al Alcalde indicando la dirección referencial del predio y el motivo del requerimiento
Copia simple del DNI vigente del propietario o representante legal autorizado
Copia literal de dominio expedida por SUNARP (Registros Públicos) con vigencia no mayor a 30 días o título de propiedad inscrito
Plano de ubicación y localización del predio a escala mínima 1:500 firmado por ingeniero o arquitecto colegiado (indicando linderos, medidas perimétricas y área total)
Certificado de Parámetros Urbanísticos y Edificatorios vigente expedido por la municipalidad (no mayor a 2 años)
Declaración jurada de no contar con numeración municipal asignada anteriormente o solicitar rectificación de numeración existente
Memoria descriptiva del predio indicando características físicas, área del terreno, uso actual y ubicación exacta
Certificado de búsqueda catastral o plano catastral del predio (emitido por el área de Catastro municipal)
Fotografías actuales del predio: fachada principal, laterales y vista panorámica del entorno (mínimo 4 fotografías a color)
Recibo de pago por derecho de trámite según TUPA municipal',
10, 25.00, 'Catastro', true),

('LIC-EDIF', 'Licencia de Edificación', 'Autorización municipal para ejecutar obras de construcción, ampliación, remodelación, refacción, demolición o habilitación urbana según Ley N° 29090',
'Formulario Único de Edificación (FUE) debidamente llenado y firmado por el propietario y los profesionales responsables (arquitecto, ingeniero civil, eléctrico y sanitario)
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
Recibo de pago por derecho de trámite calculado según el valor de la obra de acuerdo al TUPA municipal (porcentaje de la UIT)',
30, 350.00, 'Obras Privadas', true),

('CERT-CATASTRAL', 'Certificado Catastral', 'Documento oficial que certifica las características físicas, legales, registrales y económicas de un predio según la información del Sistema de Catastro Municipal',
'Solicitud dirigida al Alcalde especificando el código catastral municipal o dirección exacta del predio a certificar
Copia simple del DNI vigente del propietario registral o persona autorizada mediante carta poder
Copia literal de dominio expedida por SUNARP (Registros Públicos) con vigencia no mayor a 30 días que acredite la titularidad del predio
Ubicación exacta y completa del predio: dirección domiciliaria, número municipal, lote, manzana, sector, urbanización o asentamiento humano
Código catastral municipal del predio si se conoce (código de 12 o 15 dígitos asignado por Catastro)
Plano de ubicación y localización del predio a escala 1:500 o croquis de ubicación con referencias y medidas perimétricas
Carta poder simple con firma legalizada notarialmente si el trámite es realizado por tercera persona autorizada (adjuntar copia de DNI del representante)
Declaración jurada manifestando la conformidad de los datos proporcionados y la finalidad del certificado solicitado
Recibo de pago actualizado de impuesto predial o constancia de no adeudo de tributos municipales (opcional según municipio)
Recibo de pago por derecho de trámite según TUPA municipal',
7, 30.00, 'Catastro', true),

('SOL-IMPUESTO', 'Solicitud de Fraccionamiento de Deuda Tributaria Municipal', 'Permite fraccionar el pago de deudas tributarias municipales (impuesto predial, arbitrios municipales, multas tributarias y administrativas) en cuotas mensuales según normativa del Código Tributario',
'Solicitud con firma legalizada notarialmente dirigida al Alcalde o Gerente de Administración Tributaria y Rentas solicitando acogimiento al fraccionamiento
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
Recibo de pago por derecho de trámite según TUPA municipal (si aplica)',
10, 0.00, 'Rentas', true),

('CERT-NO-ADEUDO', 'Certificado de No Adeudo Tributario Municipal', 'Documento oficial que certifica que el contribuyente no registra deudas pendientes por concepto de tributos municipales (impuesto predial, arbitrios, multas)',
'Solicitud simple dirigida al Alcalde o Gerente de Administración Tributaria y Rentas especificando el predio o contribuyente a certificar
Copia simple del DNI vigente del propietario registral del predio o contribuyente titular
Número de código de contribuyente municipal asignado por Rentas (código de 10 dígitos) si se conoce
Código catastral del predio o dirección exacta y completa del inmueble (calle, número, lote, manzana, urbanización, sector)
Copia simple del último recibo de pago de impuesto predial o arbitrios municipales cancelado
Copia simple del título de propiedad, escritura pública o documento registral que acredite la titularidad del predio consultado
Copia literal de dominio expedida por SUNARP con vigencia no mayor a 30 días (opcional pero recomendable)
Carta poder simple con firma legalizada si el trámite es realizado por tercera persona (adjuntar copia de DNI del autorizado)
Declaración jurada manifestando que el predio no tiene cargas tributarias pendientes a conocimiento del solicitante
Recibo de pago por derecho de trámite según TUPA municipal',
3, 20.00, 'Rentas', true),

('LIBRO-RECLAMO', 'Libro de Reclamaciones Municipal', 'Mecanismo de presentación formal de quejas, reclamos, sugerencias o felicitaciones sobre servicios municipales y atención al ciudadano según Ley N° 29571 (Código de Protección y Defensa del Consumidor)',
'Formulario oficial de reclamo o queja disponible en Mesa de Partes presencial, plataforma virtual municipal o aplicativo móvil (formato físico o digital)
Copia simple del DNI vigente del reclamante ciudadano o usuario del servicio municipal
Número de expediente, comprobante de pago o código de atención relacionado con el servicio reclamado (si aplica)
Descripción detallada y específica del motivo del reclamo: servicio deficiente, demora excesiva, mala atención, incumplimiento de plazos, cobros indebidos, etc.
Fecha exacta y hora aproximada en que ocurrieron los hechos que motivan el reclamo
Identificación del área municipal, funcionario o personal involucrado en el hecho reclamado (nombres, cargo, oficina)
Documentos probatorios que sustenten el reclamo: fotografías, videos, correos electrónicos, comunicaciones previas, copia de documentos presentados, constancias, etc.
Petición concreta y solución esperada por el reclamante: rectificación, devolución, disculpas, sanción, agilización del trámite, etc.
Evidencias adicionales relevantes: testigos, grabaciones, capturas de pantalla, notificaciones recibidas
Datos de contacto actualizados del reclamante: teléfono, correo electrónico y dirección domiciliaria para recibir la respuesta municipal
Declaración jurada de veracidad de los hechos expuestos en el reclamo bajo responsabilidad del reclamante',
30, 0.00, 'Atención al Ciudadano', true);

-- =====================================================
-- INSERTAR USUARIOS DE SIMULACIÓN
-- =====================================================

-- Nota: Los auth_user_id deben ser UUIDs válidos de Supabase Auth
-- En producción, estos se crearán automáticamente al registrarse

-- Usuario Admin TI
INSERT INTO usuarios (id, nombres, apellidos, dni, email, telefono, rol, area_asignada, estado) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos', 'Mendoza Ruiz', '12345678', 'ti@mochumi.gob.pe', '979123456', 'ti', 'Tecnología de la Información', 'activo');

-- Usuario Mesa de Partes
INSERT INTO usuarios (id, nombres, apellidos, dni, email, telefono, rol, area_asignada, estado) VALUES
('22222222-2222-2222-2222-222222222222', 'María', 'Flores Castro', '23456789', 'mesapartes@mochumi.gob.pe', '979234567', 'mesa_partes', 'Mesa de Partes', 'activo');

-- Usuario Alcalde
INSERT INTO usuarios (id, nombres, apellidos, dni, email, telefono, rol, area_asignada, estado) VALUES
('33333333-3333-3333-3333-333333333333', 'Roberto', 'Sánchez López', '34567890', 'alcalde@mochumi.gob.pe', '979345678', 'alcalde', 'Alcaldía', 'activo');

-- Usuarios de Áreas de Trámite
INSERT INTO usuarios (id, nombres, apellidos, dni, email, telefono, rol, area_asignada, estado) VALUES
('44444444-4444-4444-4444-444444444444', 'Ana', 'Torres Vega', '45678901', 'desarrollo@mochumi.gob.pe', '979456789', 'area_tramite', 'Desarrollo Económico', 'activo'),
('55555555-5555-5555-5555-555555555555', 'Luis', 'Ramírez Silva', '56789012', 'catastro@mochumi.gob.pe', '979567890', 'area_tramite', 'Catastro', 'activo'),
('66666666-6666-6666-6666-666666666666', 'Patricia', 'Gómez Díaz', '67890123', 'obras@mochumi.gob.pe', '979678901', 'area_tramite', 'Obras Privadas', 'activo'),
('77777777-7777-7777-7777-777777777777', 'Jorge', 'Pérez Luna', '78901234', 'rentas@mochumi.gob.pe', '979789012', 'area_tramite', 'Rentas', 'activo');

-- Ciudadanos de ejemplo
INSERT INTO usuarios (id, nombres, apellidos, dni, email, telefono, direccion, rol, estado) VALUES
('88888888-8888-8888-8888-888888888888', 'Juan', 'García Morales', '89012345', 'juan.garcia@email.com', '979890123', 'Jr. San Martín 123, Mochumi', 'ciudadano', 'activo'),
('99999999-9999-9999-9999-999999999999', 'Rosa', 'Chávez Rojas', '90123456', 'rosa.chavez@email.com', '979901234', 'Av. Grau 456, Mochumi', 'ciudadano', 'activo'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pedro', 'Villegas Cruz', '01234567', 'pedro.villegas@email.com', '979012345', 'Calle Lima 789, Mochumi', 'ciudadano', 'activo');

-- =====================================================
-- INSERTAR EXPEDIENTES DE EJEMPLO
-- =====================================================

-- Expediente 1: Licencia de Funcionamiento (En proceso)
INSERT INTO expedientes (numero_expediente, tipo_tramite_id, ciudadano_id, asunto, descripcion, estado, area_actual, responsable_actual, fecha_registro, fecha_limite, prioridad) VALUES
('EXP-2024-00001', 1, '88888888-8888-8888-8888-888888888888', 
'Solicitud de Licencia de Funcionamiento para Bodega', 
'Solicito se me otorgue licencia de funcionamiento para establecimiento comercial - Bodega ubicada en Jr. San Martín 123',
'en_proceso', 'Desarrollo Económico', '44444444-4444-4444-4444-444444444444', 
NOW() - INTERVAL '5 days', NOW() + INTERVAL '10 days', 'normal');

-- Expediente 2: Certificado de Residencia (Aprobado)
INSERT INTO expedientes (numero_expediente, tipo_tramite_id, ciudadano_id, asunto, descripcion, estado, area_actual, responsable_actual, fecha_registro, fecha_limite, fecha_finalizacion, prioridad) VALUES
('EXP-2024-00002', 2, '99999999-9999-9999-9999-999999999999',
'Solicitud de Certificado de Residencia',
'Solicito certificado de residencia para trámites bancarios',
'finalizado', 'Secretaría General', '22222222-2222-2222-2222-222222222222',
NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days', 'normal');

-- Expediente 3: Licencia de Edificación (Registrado)
INSERT INTO expedientes (numero_expediente, tipo_tramite_id, ciudadano_id, asunto, descripcion, estado, area_actual, responsable_actual, fecha_registro, fecha_limite, prioridad) VALUES
('EXP-2024-00003', 4, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Licencia para construcción de vivienda unifamiliar',
'Solicito licencia de edificación para construcción de vivienda de dos pisos',
'registrado', 'Mesa de Partes', '22222222-2222-2222-2222-222222222222',
NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days', 'normal');

-- Expediente 4: Certificado Catastral (Derivado)
INSERT INTO expedientes (numero_expediente, tipo_tramite_id, ciudadano_id, asunto, descripcion, estado, area_actual, responsable_actual, fecha_registro, fecha_limite, prioridad) VALUES
('EXP-2024-00004', 5, '88888888-8888-8888-8888-888888888888',
'Solicitud de Certificado Catastral',
'Requiero certificado catastral de predio ubicado en Jr. San Martín 123',
'derivado', 'Catastro', '55555555-5555-5555-5555-555555555555',
NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'alta');

-- Expediente 5: Certificado de No Adeudo (En revisión)
INSERT INTO expedientes (numero_expediente, tipo_tramite_id, ciudadano_id, asunto, descripcion, estado, area_actual, responsable_actual, fecha_registro, fecha_limite, prioridad) VALUES
('EXP-2024-00005', 7, '99999999-9999-9999-9999-999999999999',
'Certificado de No Adeudo para venta de propiedad',
'Solicito certificado de no adeudo de predio con código catastral 001-234',
'en_revision', 'Rentas', '77777777-7777-7777-7777-777777777777',
NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 'alta');

-- =====================================================
-- INSERTAR HISTORIAL DE ESTADOS
-- =====================================================

INSERT INTO historial_estados (expediente_id, estado_anterior, estado_nuevo, usuario_id, area, comentario, fecha_cambio) VALUES
(1, NULL, 'registrado', '22222222-2222-2222-2222-222222222222', 'Mesa de Partes', 'Expediente registrado en sistema', NOW() - INTERVAL '5 days'),
(1, 'registrado', 'en_revision', '22222222-2222-2222-2222-222222222222', 'Mesa de Partes', 'Verificación de requisitos', NOW() - INTERVAL '4 days'),
(1, 'en_revision', 'derivado', '22222222-2222-2222-2222-222222222222', 'Mesa de Partes', 'Derivado a Desarrollo Económico', NOW() - INTERVAL '3 days'),
(1, 'derivado', 'en_proceso', '44444444-4444-4444-4444-444444444444', 'Desarrollo Económico', 'En evaluación técnica', NOW() - INTERVAL '2 days'),

(2, NULL, 'registrado', '22222222-2222-2222-2222-222222222222', 'Mesa de Partes', 'Expediente registrado', NOW() - INTERVAL '10 days'),
(2, 'registrado', 'en_proceso', '22222222-2222-2222-2222-222222222222', 'Secretaría General', 'En elaboración', NOW() - INTERVAL '8 days'),
(2, 'en_proceso', 'aprobado', '22222222-2222-2222-2222-222222222222', 'Secretaría General', 'Certificado emitido', NOW() - INTERVAL '7 days'),
(2, 'aprobado', 'finalizado', '22222222-2222-2222-2222-222222222222', 'Secretaría General', 'Documento entregado', NOW() - INTERVAL '7 days');

-- =====================================================
-- INSERTAR DERIVACIONES
-- =====================================================

INSERT INTO derivaciones (expediente_id, area_origen, area_destino, usuario_deriva, usuario_recibe, motivo, fecha_derivacion, fecha_recepcion, estado) VALUES
(1, 'Mesa de Partes', 'Desarrollo Económico', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 
'Evaluación de requisitos para licencia de funcionamiento', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'recibido'),

(4, 'Mesa de Partes', 'Catastro', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
'Emisión de certificado catastral', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 'recibido');

-- =====================================================
-- INSERTAR NOTIFICACIONES
-- =====================================================

INSERT INTO notificaciones (usuario_id, expediente_id, tipo, titulo, mensaje, leida) VALUES
('88888888-8888-8888-8888-888888888888', 1, 'cambio_estado', 'Expediente en Proceso',
'Su expediente EXP-2024-00001 está siendo evaluado por el área de Desarrollo Económico', false),

('88888888-8888-8888-8888-888888888888', 4, 'derivacion', 'Expediente Derivado',
'Su expediente EXP-2024-00004 ha sido derivado al área de Catastro', false),

('99999999-9999-9999-9999-999999999999', 2, 'cambio_estado', 'Trámite Finalizado',
'Su expediente EXP-2024-00002 ha sido finalizado. Puede recoger su certificado en Mesa de Partes', true),

('44444444-4444-4444-4444-444444444444', 1, 'alerta_vencimiento', 'Expediente Próximo a Vencer',
'El expediente EXP-2024-00001 vence en 10 días. Por favor, priorice su atención', false);

-- =====================================================
-- INSERTAR OBSERVACIONES
-- =====================================================

INSERT INTO observaciones (expediente_id, usuario_id, tipo, descripcion, requiere_subsanacion, fecha_limite_subsanacion) VALUES
(1, '44444444-4444-4444-4444-444444444444', 'requerimiento', 
'Se requiere presentar Certificado de Inspección Técnica de Seguridad actualizado',
true, NOW() + INTERVAL '5 days');

-- =====================================================
-- ACTUALIZAR SECUENCIAS
-- =====================================================

-- Esto asegura que los próximos IDs sean mayores a los insertados
SELECT setval('expedientes_id_seq', (SELECT MAX(id) FROM expedientes));
SELECT setval('tipos_tramite_id_seq', (SELECT MAX(id) FROM tipos_tramite));
SELECT setval('notificaciones_id_seq', (SELECT MAX(id) FROM notificaciones));
SELECT setval('historial_estados_id_seq', (SELECT MAX(id) FROM historial_estados));
SELECT setval('derivaciones_id_seq', (SELECT MAX(id) FROM derivaciones));
SELECT setval('observaciones_id_seq', (SELECT MAX(id) FROM observaciones));
