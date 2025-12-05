-- =====================================================
-- FIX PARA FOREIGN KEYS - Permitir eliminación en cascada
-- =====================================================
-- Este script corrige las foreign keys para permitir eliminar usuarios
-- sin errores de referencias en otras tablas
-- =====================================================

-- Paso 1: Eliminar las foreign keys existentes
ALTER TABLE expedientes 
DROP CONSTRAINT IF EXISTS expedientes_ciudadano_id_fkey;

ALTER TABLE expedientes 
DROP CONSTRAINT IF EXISTS expedientes_responsable_actual_fkey;

ALTER TABLE derivaciones 
DROP CONSTRAINT IF EXISTS derivaciones_usuario_deriva_fkey;

ALTER TABLE derivaciones 
DROP CONSTRAINT IF EXISTS derivaciones_usuario_recibe_fkey;

ALTER TABLE notificaciones 
DROP CONSTRAINT IF EXISTS notificaciones_usuario_id_fkey;

ALTER TABLE observaciones 
DROP CONSTRAINT IF EXISTS observaciones_usuario_id_fkey;

ALTER TABLE historial_estados 
DROP CONSTRAINT IF EXISTS historial_estados_usuario_id_fkey;

ALTER TABLE auditoria 
DROP CONSTRAINT IF EXISTS auditoria_usuario_id_fkey;

ALTER TABLE documentos 
DROP CONSTRAINT IF EXISTS documentos_subido_por_fkey;

-- Paso 2: Recrear las foreign keys con ON DELETE SET NULL (para mantener el historial)
-- Expedientes: Si se elimina el ciudadano, el expediente queda huérfano (SET NULL)
ALTER TABLE expedientes 
ADD CONSTRAINT expedientes_ciudadano_id_fkey 
FOREIGN KEY (ciudadano_id) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

ALTER TABLE expedientes 
ADD CONSTRAINT expedientes_responsable_actual_fkey 
FOREIGN KEY (responsable_actual) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Derivaciones: Si se elimina un usuario, mantener el registro con NULL
ALTER TABLE derivaciones 
ADD CONSTRAINT derivaciones_usuario_deriva_fkey 
FOREIGN KEY (usuario_deriva) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

ALTER TABLE derivaciones 
ADD CONSTRAINT derivaciones_usuario_recibe_fkey 
FOREIGN KEY (usuario_recibe) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Documentos: Mantener el registro histórico con NULL
ALTER TABLE documentos 
ADD CONSTRAINT documentos_subido_por_fkey 
FOREIGN KEY (subido_por) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Notificaciones: Si se elimina el usuario, eliminar sus notificaciones
ALTER TABLE notificaciones 
ADD CONSTRAINT notificaciones_usuario_id_fkey 
FOREIGN KEY (usuario_id) 
REFERENCES usuarios(id) 
ON DELETE CASCADE;

-- Observaciones: Mantener el registro histórico con NULL
ALTER TABLE observaciones 
ADD CONSTRAINT observaciones_usuario_id_fkey 
FOREIGN KEY (usuario_id) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Historial: Mantener el registro histórico con NULL
ALTER TABLE historial_estados 
ADD CONSTRAINT historial_estados_usuario_id_fkey 
FOREIGN KEY (usuario_id) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Auditoría: Mantener el registro histórico con NULL
ALTER TABLE auditoria 
ADD CONSTRAINT auditoria_usuario_id_fkey 
FOREIGN KEY (usuario_id) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Verificar las nuevas foreign keys
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'usuarios'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE '';
    RAISE NOTICE '✅ FOREIGN KEYS ACTUALIZADAS CORRECTAMENTE:';
    RAISE NOTICE '';
    RAISE NOTICE '   Tablas con ON DELETE SET NULL (mantienen historial):';
    RAISE NOTICE '   ✓ expedientes.ciudadano_id';
    RAISE NOTICE '   ✓ expedientes.responsable_actual';
    RAISE NOTICE '   ✓ derivaciones.usuario_deriva';
    RAISE NOTICE '   ✓ derivaciones.usuario_recibe';
    RAISE NOTICE '   ✓ observaciones.usuario_id';
    RAISE NOTICE '   ✓ historial_estados.usuario_id';
    RAISE NOTICE '   ✓ auditoria.usuario_id';
    RAISE NOTICE '   ✓ documentos.subido_por';
    RAISE NOTICE '';
    RAISE NOTICE '   Tablas con ON DELETE CASCADE (se eliminan):';
    RAISE NOTICE '   ✓ notificaciones.usuario_id';
    RAISE NOTICE '';
    RAISE NOTICE '📋 AHORA PUEDES:';
    RAISE NOTICE '   - Eliminar usuarios sin errores de foreign key';
    RAISE NOTICE '   - El historial de expedientes/derivaciones se mantiene';
    RAISE NOTICE '   - Las notificaciones del usuario se eliminan automáticamente';
END $$;
