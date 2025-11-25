import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userData, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-neutral-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return <Navigate to="/login" replace />;
  }

  // Verificar estado del usuario
  if (userData.estado !== 'activo') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-danger-600 mb-4">Cuenta Inactiva</h2>
          <p className="text-neutral-600 mb-4">
            Su cuenta está {userData.estado}. Por favor, contacte al administrador.
          </p>
          <button 
            onClick={() => useAuthStore.getState().signOut()}
            className="btn btn-outline"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Verificar roles si se especificaron
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.rol)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-danger-600 mb-4">Acceso Denegado</h2>
          <p className="text-neutral-600 mb-4">
            No tiene permisos para acceder a esta sección.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
