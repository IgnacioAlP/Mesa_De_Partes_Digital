-- =====================================================
-- TRIGGER AUTOMÁTICO PARA CREAR USUARIOS
-- =====================================================
-- Este trigger crea automáticamente un registro en la tabla usuarios
-- cuando se registra un nuevo usuario en auth.users
-- =====================================================

-- Paso 1: Crear función que se ejecutará automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar en la tabla usuarios cuando se crea un usuario en auth.users
    INSERT INTO public.usuarios (
        auth_user_id,
        email,
        nombres,
        apellidos,
        dni,
        telefono,
        direccion,
        rol,
        estado
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombres', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'apellidos', 'Nuevo'),
        COALESCE(NEW.raw_user_meta_data->>'dni', '00000000'),
        COALESCE(NEW.raw_user_meta_data->>'telefono', NULL),
        COALESCE(NEW.raw_user_meta_data->>'direccion', NULL),
        COALESCE(NEW.raw_user_meta_data->>'rol', 'ciudadano')::user_role,
        'activo'::user_status
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Paso 2: Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Paso 3: Crear el trigger que se activa al crear un usuario
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Paso 4: Verificar que el trigger fue creado
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Mensaje de confirmación
DO $$ 
BEGIN 
    RAISE NOTICE '✅ TRIGGER AUTOMÁTICO CONFIGURADO';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Cómo funciona:';
    RAISE NOTICE '   1. Usuario se registra con supabase.auth.signUp()';
    RAISE NOTICE '   2. Se crea el registro en auth.users';
    RAISE NOTICE '   3. El trigger se ejecuta automáticamente';
    RAISE NOTICE '   4. Se crea el registro en la tabla usuarios';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE: Ahora debes pasar los datos en metadata';
    RAISE NOTICE '   Ejemplo en tu código React:';
    RAISE NOTICE '   supabase.auth.signUp({';
    RAISE NOTICE '     email: email,';
    RAISE NOTICE '     password: password,';
    RAISE NOTICE '     options: {';
    RAISE NOTICE '       data: {';
    RAISE NOTICE '         nombres: "Juan",';
    RAISE NOTICE '         apellidos: "Pérez",';
    RAISE NOTICE '         dni: "12345678",';
    RAISE NOTICE '         telefono: "999888777",';
    RAISE NOTICE '         direccion: "Calle Principal 123"';
    RAISE NOTICE '       }';
    RAISE NOTICE '     }';
    RAISE NOTICE '   })';
END $$;
