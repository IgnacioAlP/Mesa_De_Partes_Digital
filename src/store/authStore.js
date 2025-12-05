import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  
  // Inicializar sesión
  initialize: async () => {
    try {
      if (!supabase) {
        console.error('❌ Supabase no está inicializado');
        set({ loading: false });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await get().fetchUserData(session.user.id);
      }
      
      set({ loading: false });
      
      // Escuchar cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await get().fetchUserData(session.user.id);
        } else {
          set({ user: null, userData: null });
        }
      });
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      set({ loading: false });
    }
  },
  
  // Obtener datos del usuario
  fetchUserData: async (authUserId) => {
    try {
      if (!supabase) {
        console.error('❌ Supabase no está inicializado');
        return null;
      }

      console.log('📊 Buscando usuario con auth_user_id:', authUserId);

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();
      
      if (error) {
        console.error('❌ Error consultando tabla usuarios:', error);
        
        // Si no encuentra por auth_user_id, intentar buscar por email
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          console.log('🔍 Intentando buscar por email:', user.email);
          const { data: userByEmail, error: emailError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (!emailError && userByEmail) {
            console.log('✅ Usuario encontrado por email');
            // Actualizar auth_user_id para futuras consultas
            await supabase
              .from('usuarios')
              .update({ auth_user_id: authUserId })
              .eq('id', userByEmail.id);
            
            set({ 
              user: { id: authUserId }, 
              userData: userByEmail 
            });
            
            return userByEmail;
          }
        }
        
        throw error;
      }
      
      console.log('✅ Datos de usuario encontrados:', data.nombres, data.apellidos, '- Rol:', data.rol);
      
      // Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', data.id);
      
      set({ 
        user: { id: authUserId }, 
        userData: data 
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo datos del usuario:', error);
      return null;
    }
  },
  
  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      if (!supabase) {
        throw new Error('Error de configuración: Supabase no está disponible');
      }

      console.log('🔐 Intentando iniciar sesión con:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Error de autenticación:', error);
        throw error;
      }

      console.log('✅ Autenticación exitosa, buscando datos de usuario...');
      
      const userData = await get().fetchUserData(data.user.id);
      
      if (!userData) {
        console.error('⚠️ Usuario autenticado pero sin datos en tabla usuarios');
        throw new Error('No se encontraron datos del usuario. Contacte al administrador.');
      }

      console.log('✅ Login completo. Rol:', userData.rol);
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ Error en inicio de sesión:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Registrarse
  signUp: async (userData) => {
    try {
      if (!supabase) {
        throw new Error('Error de configuración: Supabase no está disponible');
      }

      // Crear usuario en Supabase Auth con metadata
      // El trigger de la base de datos creará automáticamente el registro en usuarios
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nombres: userData.nombres,
            apellidos: userData.apellidos,
            dni: userData.dni,
            telefono: userData.telefono || null,
            direccion: userData.direccion || null,
            rol: 'ciudadano'
          }
        }
      });
      
      if (authError) {
        console.error('Error en auth.signUp:', authError);
        throw authError;
      }

      if (!authData?.user?.id) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('✅ Usuario creado exitosamente:', authData.user.id);
      console.log('ℹ️  El registro en la tabla usuarios se creó automáticamente via trigger');
      
      return { 
        success: true, 
        data: authData.user,
        message: 'Registro exitoso. Por favor verifica tu email.'
      };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error al registrarse. Por favor intente nuevamente.'
      };
    }
  },
  
  // Cerrar sesión
  signOut: async () => {
    try {
      if (!supabase) {
        throw new Error('Error de configuración: Supabase no está disponible');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, userData: null });
      return { success: true };
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Verificar permisos por rol
  hasRole: (roles) => {
    const { userData } = get();
    if (!userData) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userData.rol);
    }
    return userData.rol === roles;
  },
  
  // Verificar si es personal municipal
  isMunicipalStaff: () => {
    const { userData } = get();
    if (!userData) return false;
    return ['mesa_partes', 'area_tramite', 'alcalde', 'ti'].includes(userData.rol);
  },
}));

export default useAuthStore;
