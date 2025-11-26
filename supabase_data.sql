-- Datos de Simulación para Mesa de Partes Digital
-- Municipalidad Distrital de Mochumi

-- =====================================================
-- INSERTAR TIPOS DE TRÁMITE COMUNES
-- =====================================================

INSERT INTO tipos_tramite (codigo, nombre, descripcion, requisitos, tiempo_maximo_dias, costo, area_responsable, es_comun) VALUES
('LIC-FUNC', 'Licencia de Funcionamiento', 'Autorización municipal para el desarrollo de actividades económicas en establecimientos comerciales', 
'Solicitud dirigida al Alcalde firmada por el titular o representante legal
Copia simple del DNI del titular o representante legal
Copia simple de RUC y vigencia de poder del representante legal (en caso de personas jurídicas)
Declaración Jurada de Cumplimiento de Condiciones de Seguridad en Defensa Civil
Certificado de Inspección Técnica de Seguridad en Defensa Civil (para establecimientos mayores a 100 m²)
Copia simple de título de propiedad o contrato de alquiler del local
Plano de ubicación y distribución del establecimiento
Recibo de pago por derecho de trámite', 
15, 150.00, 'Desarrollo Económico', true),

('CERT-RESID', 'Certificado de Residencia', 'Documento que acredita el domicilio del solicitante en el distrito de Mochumi',
'Solicitud con firma legalizada notarialmente o autenticada por la municipalidad
Copia simple del DNI del solicitante
Recibo de agua, luz o teléfono de los últimos 2 meses a nombre del solicitante
Declaración jurada de domicilio con datos exactos de la vivienda
Dos testigos con DNI que acrediten la residencia (opcional)
Recibo de pago por derecho de trámite',
5, 15.00, 'Secretaría General', true),

('CERT-NUMERACION', 'Certificado de Numeración Municipal', 'Documento que asigna número oficial municipal a un predio para fines de identificación catastral',
'Solicitud dirigida al Alcalde indicando dirección exacta del predio
Copia simple del DNI del propietario o representante legal
Copia literal de dominio o título de propiedad del predio
Plano de ubicación y localización del predio a escala 1:500
Certificado de parámetros urbanísticos y edificatorios
Declaración jurada de no tener otro número asignado
Recibo de pago por derecho de trámite',
10, 25.00, 'Catastro', true),

('LIC-EDIF', 'Licencia de Edificación', 'Autorización municipal para ejecutar obras de construcción, ampliación, remodelación, refacción o demolición',
'Formulario Único de Edificación (FUE) debidamente llenado y firmado
Copia simple del DNI del propietario y del profesional responsable
Planos de arquitectura, estructuras, instalaciones eléctricas y sanitarias firmados por profesional colegiado
Memoria descriptiva del proyecto de edificación
Certificado de parámetros urbanísticos y edificatorios vigente
Estudio de mecánica de suelos (para edificaciones de más de 3 pisos)
Certificado de factibilidad de servicios (agua, desagüe, energía eléctrica)
Copia literal de dominio del predio
Pago de derecho de trámite según el valor de la obra',
30, 350.00, 'Obras Privadas', true),

('CERT-CATASTRAL', 'Certificado Catastral', 'Documento oficial que certifica las características físicas, legales y económicas de un predio según los registros catastrales municipales',
'Solicitud dirigida al Alcalde especificando el código catastral o dirección exacta
Copia simple del DNI del propietario o solicitante autorizado
Copia literal de dominio expedida por SUNARP o título de propiedad
Ubicación exacta del predio (dirección, lote, manzana, urbanización)
Plano de ubicación referencial (opcional)
Carta poder simple si es realizado por tercero
Recibo de pago por derecho de trámite',
7, 30.00, 'Catastro', true),

('SOL-IMPUESTO', 'Solicitud de Fraccionamiento de Deuda Tributaria Municipal', 'Permite fraccionar el pago de deudas tributarias municipales (predial, arbitrios, multas) en cuotas mensuales',
'Solicitud con firma legalizada dirigida a la Gerencia de Administración Tributaria
Copia simple del DNI del contribuyente o representante legal
Declaración jurada de situación económica detallando ingresos y egresos mensuales
Cronograma de pagos propuesto indicando número de cuotas y monto mensual
Constancia de deuda emitida por el área de Rentas
Declaración de no tener fraccionamientos vigentes anteriores
Comprobante de pago de la cuota inicial (mínimo 10% de la deuda total)',
10, 0.00, 'Rentas', true),

('CERT-NO-ADEUDO', 'Certificado de No Adeudo Tributario', 'Documento que certifica que el contribuyente no registra deudas pendientes por tributos municipales',
'Solicitud simple dirigida al Alcalde o Gerente de Rentas
Copia simple del DNI del propietario o contribuyente
Número de predio o código de contribuyente municipal
Dirección exacta del predio consultado
Copia simple de título de propiedad o documento que acredite titularidad
Recibo de pago por derecho de trámite',
3, 20.00, 'Rentas', true),

('LIBRO-RECLAMO', 'Libro de Reclamaciones Municipal', 'Presentación formal de quejas, reclamos o sugerencias sobre servicios y atención municipal',
'Formulario oficial de reclamo disponible en Mesa de Partes o en línea
Copia simple del DNI del reclamante
Documentos que sustenten el reclamo (fotos, videos, correos, documentos previos)
Detalle específico del motivo del reclamo y fecha de los hechos
Petición concreta o solución esperada
Evidencias adicionales relevantes al caso',
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
