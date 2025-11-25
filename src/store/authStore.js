import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  
  // Inicializar sesión
  initialize: async () => {
    try {
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
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();
      
      if (error) throw error;
      
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
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  },
  
  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      await get().fetchUserData(data.user.id);
      
      return { success: true, data };
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Registrarse
  signUp: async (userData) => {
    try {
      // Paso 1: Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        console.error('Error en auth.signUp:', authError);
        throw authError;
      }

      // Verificar que el usuario fue creado
      if (!authData?.user?.id) {
        throw new Error('No se pudo crear el usuario en auth.users');
      }

      console.log('Usuario creado en auth.users:', authData.user.id);

      // Paso 2: Esperar un momento para asegurar que auth.users esté sincronizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Paso 3: Crear registro en tabla usuarios
      const { data: userRecord, error: userError } = await supabase
        .from('usuarios')
        .insert([{
          auth_user_id: authData.user.id,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          dni: userData.dni,
          email: userData.email,
          telefono: userData.telefono || null,
          direccion: userData.direccion || null,
          rol: 'ciudadano',
          estado: 'activo'
        }])
        .select()
        .single();
      
      if (userError) {
        console.error('Error insertando en tabla usuarios:', userError);
        // Intentar eliminar el usuario de auth si falla la inserción
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error('Error en limpieza:', cleanupError);
        }
        throw userError;
      }

      console.log('Usuario creado en tabla usuarios:', userRecord);
      
      return { success: true, data: userRecord };
    } catch (error) {
      console.error('Error completo en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error desconocido al registrarse'
      };
    }
  },
  
  // Cerrar sesión
  signOut: async () => {
    try {
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
