import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        toast.success('¡Bienvenido al Sistema de Mesa de Partes!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error inesperado. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-lg mb-4">
            <img 
              src="/logo-mochumi.png" 
              alt="Escudo de Mochumi" 
              className="w-24 h-24 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mesa de Partes Digital</h1>
          <p className="text-primary-100">Municipalidad Distrital de Mochumi</p>
        </div>

        {/* Formulario de Login */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Iniciar Sesión</h2>
            <p className="text-neutral-600">Ingrese sus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">¿No tiene una cuenta?</span>
              </div>
            </div>

            <Link to="/register" className="btn btn-outline w-full flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Registrarse
            </Link>
          </div>

          {/* Información de acceso rápido */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-xs text-primary-800 text-center">
              <strong>Acceso 24/7:</strong> Realice sus trámites en cualquier momento, desde cualquier lugar
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white text-sm">
          <p>© 2024 Municipalidad Distrital de Mochumi</p>
          <p className="mt-1 text-primary-100">Tierra Fértil - Mochumi</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
