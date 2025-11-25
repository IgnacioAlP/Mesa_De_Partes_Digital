import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Dashboard = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (userData?.rol) {
      // Redirigir según el rol del usuario
      switch (userData.rol) {
        case 'ciudadano':
          navigate('/dashboard/ciudadano', { replace: true });
          break;
        case 'mesa_partes':
          navigate('/dashboard/mesa-partes', { replace: true });
          break;
        case 'area_tramite':
          navigate('/dashboard/area-tramite', { replace: true });
          break;
        case 'alcalde':
          navigate('/dashboard/alcalde', { replace: true });
          break;
        case 'ti':
          navigate('/dashboard/ti', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [userData, navigate]);

  // Loading mientras redirige
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Cargando dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
