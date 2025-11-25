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
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) throw authError;
      
      // Crear registro en tabla usuarios
      const { data: userRecord, error: userError } = await supabase
        .from('usuarios')
        .insert([{
          auth_user_id: authData.user.id,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          dni: userData.dni,
          email: userData.email,
          telefono: userData.telefono,
          direccion: userData.direccion,
          rol: 'ciudadano',
          estado: 'activo'
        }])
        .select()
        .single();
      
      if (userError) throw userError;
      
      return { success: true, data: userRecord };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
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
