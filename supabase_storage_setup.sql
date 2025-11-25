-- Script para configurar Supabase Storage para documentos
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear el bucket 'documentos' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Política de Storage: Permitir INSERT a usuarios autenticados
CREATE POLICY "Usuarios pueden subir documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos');

-- 3. Política de Storage: Permitir SELECT (lectura) a usuarios autenticados
CREATE POLICY "Usuarios pueden ver documentos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documentos');

-- 4. Política de Storage: Permitir UPDATE solo al propietario
CREATE POLICY "Usuarios pueden actualizar sus documentos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documentos' AND auth.uid()::text = owner);

-- 5. Política de Storage: Permitir DELETE solo al propietario
CREATE POLICY "Usuarios pueden eliminar sus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documentos' AND auth.uid()::text = owner);

-- Verificar que el bucket fue creado
SELECT * FROM storage.buckets WHERE id = 'documentos';

-- NOTA IMPORTANTE:
-- Si obtienes errores de políticas duplicadas, primero elimina las políticas existentes:
-- 
-- DROP POLICY IF EXISTS "Usuarios pueden subir documentos" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios pueden ver documentos" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios pueden actualizar sus documentos" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios pueden eliminar sus documentos" ON storage.objects;
--
-- Luego vuelve a ejecutar las sentencias CREATE POLICY de arriba.

-- ALTERNATIVA: Crear bucket con RLS deshabilitado (más permisivo)
-- Si prefieres acceso público completo para desarrollo:
--
-- DELETE FROM storage.buckets WHERE id = 'documentos';
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('documentos', 'documentos', true, 10485760, 
--   ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
--         'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
--         'image/jpeg', 'image/png', 'image/jpg']);
