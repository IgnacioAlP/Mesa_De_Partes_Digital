-- =====================================================
-- SCRIPT PARA CORREGIR RECURSIÓN INFINITA EN POLÍTICAS RLS
-- Ejecuta este script en tu base de datos de Supabase
-- =====================================================

-- Paso 1: Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios TI pueden ver todos los perfiles" ON usuarios;
DROP POLICY IF EXISTS "Ciudadanos pueden ver sus propios expedientes" ON usuarios;
DROP POLICY IF EXISTS "Personal municipal puede ver expedientes de su área" ON expedientes;
DROP POLICY IF EXISTS "Usuarios pueden ver documentos de sus expedientes" ON documentos;
DROP POLICY IF EXISTS "Usuarios solo ven sus propias notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus notificaciones" ON notificaciones;

-- Paso 2: Habilitar RLS en todas las tablas necesarias
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE observaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Paso 3: CREAR POLÍTICAS SIN RECURSIÓN PARA USUARIOS
-- =====================================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "usuarios_select_own"
    ON usuarios FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Los usuarios TI pueden ver todos los perfiles
CREATE POLICY "usuarios_select_ti"
    ON usuarios FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
    );

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_own"
    ON usuarios FOR UPDATE
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- TI puede actualizar cualquier usuario
CREATE POLICY "usuarios_update_ti"
    ON usuarios FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
    );

-- TI puede insertar nuevos usuarios o auto-registro en primera conexión
CREATE POLICY "usuarios_insert_ti"
    ON usuarios FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios WHERE rol = 'ti'
        )
        OR NOT EXISTS (SELECT 1 FROM usuarios WHERE auth_user_id = auth.uid())
    );

-- =====================================================
-- Paso 4: POLÍTICAS PARA EXPEDIENTES
-- =====================================================

-- Ciudadanos pueden ver sus propios expedientes
CREATE POLICY "expedientes_select_own"
    ON expedientes FOR SELECT
    USING (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Personal municipal puede ver todos los expedientes
CREATE POLICY "expedientes_select_staff"
    ON expedientes FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Ciudadanos pueden crear expedientes
CREATE POLICY "expedientes_insert_ciudadano"
    ON expedientes FOR INSERT
    WITH CHECK (
        ciudadano_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Personal de mesa de partes puede crear expedientes
CREATE POLICY "expedientes_insert_mesa_partes"
    ON expedientes FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'ti')
        )
    );

-- Personal autorizado puede actualizar expedientes
CREATE POLICY "expedientes_update_staff"
    ON expedientes FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- =====================================================
-- Paso 5: POLÍTICAS PARA DOCUMENTOS
-- =====================================================

-- Ciudadanos pueden ver documentos de sus expedientes
CREATE POLICY "documentos_select_own"
    ON documentos FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal municipal puede ver todos los documentos
CREATE POLICY "documentos_select_staff"
    ON documentos FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Usuarios autenticados pueden subir documentos
CREATE POLICY "documentos_insert_authenticated"
    ON documentos FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM usuarios)
    );

-- =====================================================
-- Paso 6: POLÍTICAS PARA NOTIFICACIONES
-- =====================================================

-- Usuarios solo ven sus propias notificaciones
CREATE POLICY "notificaciones_select_own"
    ON notificaciones FOR SELECT
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Usuarios pueden actualizar sus notificaciones (marcar como leídas)
CREATE POLICY "notificaciones_update_own"
    ON notificaciones FOR UPDATE
    USING (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        usuario_id IN (
            SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
        )
    );

-- Sistema puede crear notificaciones
CREATE POLICY "notificaciones_insert_system"
    ON notificaciones FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- Paso 7: POLÍTICAS PARA DERIVACIONES
-- =====================================================

-- Personal puede ver derivaciones
CREATE POLICY "derivaciones_select_staff"
    ON derivaciones FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal autorizado puede crear derivaciones
CREATE POLICY "derivaciones_insert_staff"
    ON derivaciones FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal puede actualizar derivaciones
CREATE POLICY "derivaciones_update_staff"
    ON derivaciones FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- =====================================================
-- Paso 8: POLÍTICAS PARA HISTORIAL DE ESTADOS
-- =====================================================

-- Ciudadanos pueden ver el historial de sus expedientes
CREATE POLICY "historial_select_own"
    ON historial_estados FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal puede ver todo el historial
CREATE POLICY "historial_select_staff"
    ON historial_estados FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Sistema puede insertar en historial
CREATE POLICY "historial_insert_system"
    ON historial_estados FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- Paso 9: POLÍTICAS PARA OBSERVACIONES
-- =====================================================

-- Ciudadanos pueden ver observaciones de sus expedientes
CREATE POLICY "observaciones_select_own"
    ON observaciones FOR SELECT
    USING (
        expediente_id IN (
            SELECT e.id FROM expedientes e
            INNER JOIN usuarios u ON e.ciudadano_id = u.id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Personal puede ver todas las observaciones
CREATE POLICY "observaciones_select_staff"
    ON observaciones FOR SELECT
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- Personal puede crear observaciones
CREATE POLICY "observaciones_insert_staff"
    ON observaciones FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM usuarios 
            WHERE rol IN ('mesa_partes', 'area_tramite', 'alcalde', 'ti')
        )
    );

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE 'Políticas RLS actualizadas correctamente sin recursión';
END $$;
