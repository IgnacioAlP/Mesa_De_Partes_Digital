import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, MapPin, CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.dni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData);
      
      if (result.success) {
        toast.success('¡Registro exitoso! Por favor, inicie sesión.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Error al registrarse');
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
      <div className="max-w-2xl w-full">
        {/* Logo y título */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white rounded-full p-3 shadow-lg mb-3">
            <img 
              src="/logo-mochumi.png" 
              alt="Escudo de Mochumi" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Registro de Ciudadano</h1>
          <p className="text-primary-100">Complete sus datos para crear una cuenta</p>
        </div>

        {/* Formulario de Registro */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombres" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombres *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Juan Carlos"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-neutral-700 mb-2">
                  Apellidos *
                </label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  required
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="input"
                  placeholder="García López"
                />
              </div>
            </div>

            {/* DNI y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-neutral-700 mb-2">
                  DNI *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="dni"
                    name="dni"
                    type="text"
                    required
                    maxLength="8"
                    pattern="[0-9]{8}"
                    value={formData.dni}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-neutral-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="979123456"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Correo Electrónico *
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

            {/* Dirección */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-neutral-700 mb-2">
                Dirección *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Jr. San Martín 123, Mochumi"
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Contraseña *
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
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength="6"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                Acepto los términos y condiciones de uso del sistema de Mesa de Partes Digital
              </label>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {/* Link a Login */}
          <div className="mt-6 text-center">
            <span className="text-neutral-600">¿Ya tiene una cuenta? </span>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-white text-sm">
          <p>© 2024 Municipalidad Distrital de Mochumi</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
