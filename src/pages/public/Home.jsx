import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Search, ArrowRight, CheckCircle, Shield, Bell, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Home = () => {
  const [tramitesComunes, setTramitesComunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTramitesComunes();
  }, []);

  const fetchTramitesComunes = async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_tramite')
        .select('*')
        .eq('es_comun', true)
        .eq('estado', 'activo')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setTramitesComunes(data || []);
    } catch (error) {
      console.error('Error cargando trámites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo-mochumi.png" 
                alt="Escudo de Mochumi" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-primary-700">Mesa de Partes Digital</h1>
                <p className="text-sm text-neutral-600">Municipalidad Distrital de Mochumi</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="btn btn-outline">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Realiza tus trámites de forma digital
              </h2>
              <p className="text-xl text-primary-100 mb-6">
                Sistema de Mesa de Partes disponible 24/7. Registra, envía y consulta el estado de tus documentos desde cualquier lugar.
              </p>
              <div className="flex gap-4">
                <Link to="/register" className="btn bg-white text-primary-600 hover:bg-neutral-100">
                  Comenzar Ahora
                </Link>
                <Link to="/seguimiento" className="btn btn-outline border-white text-white hover:bg-white/10">
                  <Search className="h-5 w-5 mr-2" />
                  Seguir Trámite
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <FileText className="h-10 w-10 text-secondary-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">100%</h3>
                <p className="text-primary-100">Digital</p>
              </div>
              <div className="card bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <Clock className="h-10 w-10 text-secondary-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">24/7</h3>
                <p className="text-primary-100">Disponible</p>
              </div>
              <div className="card bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CheckCircle className="h-10 w-10 text-secondary-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">Rápido</h3>
                <p className="text-primary-100">En línea</p>
              </div>
              <div className="card bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <Shield className="h-10 w-10 text-secondary-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">Seguro</h3>
                <p className="text-primary-100">Cifrado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">
              ¿Por qué usar Mesa de Partes Digital?
            </h2>
            <p className="text-lg text-neutral-600">
              Moderniza tus trámites con transparencia y eficiencia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Notificaciones Automáticas</h3>
              <p className="text-neutral-600">
                Recibe alertas por email y SMS sobre el estado de tus expedientes en tiempo real
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Seguimiento en Línea</h3>
              <p className="text-neutral-600">
                Consulta en cualquier momento la ubicación y estado de tu trámite documental
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-700 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Trámites Rápidos</h3>
              <p className="text-neutral-600">
                Workflow optimizado para reducir tiempos de respuesta y mejorar la atención
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trámites Comunes */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">
              Trámites Más Solicitados
            </h2>
            <p className="text-lg text-neutral-600">
              Conoce los procedimientos más comunes y sus requisitos
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-neutral-600">Cargando trámites...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tramitesComunes.map((tramite) => (
                <div key={tramite.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {tramite.nombre}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">
                        {tramite.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-neutral-400 mr-2" />
                      <span className="text-neutral-600">
                        Tiempo máximo: <strong>{tramite.tiempo_maximo_dias} días</strong>
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 text-neutral-400 mr-2" />
                      <span className="text-neutral-600">
                        Costo: <strong>S/ {tramite.costo.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <p className="text-xs font-medium text-neutral-700 mb-2">Requisitos:</p>
                    <ul className="space-y-1">
                      {tramite.requisitos && typeof tramite.requisitos === 'string' ? (
                        tramite.requisitos.split('\n').filter(r => r.trim()).slice(0, 3).map((req, idx) => (
                          <li key={idx} className="text-xs text-neutral-600 flex items-start">
                            <CheckCircle className="h-3 w-3 text-accent-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{req.trim()}</span>
                          </li>
                        ))
                      ) : Array.isArray(tramite.requisitos) ? (
                        tramite.requisitos.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="text-xs text-neutral-600 flex items-start">
                            <CheckCircle className="h-3 w-3 text-accent-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))
                      ) : null}
                      {tramite.requisitos && typeof tramite.requisitos === 'string' && tramite.requisitos.split('\n').filter(r => r.trim()).length > 3 && (
                        <li className="text-xs text-primary-600 font-medium">
                          + {tramite.requisitos.split('\n').filter(r => r.trim()).length - 3} más...
                        </li>
                      )}
                      {Array.isArray(tramite.requisitos) && tramite.requisitos.length > 3 && (
                        <li className="text-xs text-primary-600 font-medium">
                          + {tramite.requisitos.length - 3} más...
                        </li>
                      )}
                    </ul>
                  </div>

                  <Link 
                    to="/register" 
                    className="mt-4 btn btn-outline w-full flex items-center justify-center gap-2 text-sm"
                  >
                    Iniciar Trámite
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Regístrate ahora y experimenta la nueva forma de realizar trámites municipales
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-neutral-100">
            Crear Cuenta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Municipalidad Distrital de Mochumi</h4>
              <p className="text-sm text-neutral-400">
                Tierra Fértil - Mochumi<br />
                Región Lambayeque, Perú
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-sm text-neutral-400">
                Mesa de Partes Digital<br />
                Email: mesapartes@mochumi.gob.pe<br />
                Teléfono: (074) 123-4567
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horario de Atención</h4>
              <p className="text-sm text-neutral-400">
                Sistema Digital: 24/7<br />
                Atención Presencial:<br />
                Lunes a Viernes: 8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-6 text-center text-sm text-neutral-400">
            <p>© 2024 Municipalidad Distrital de Mochumi. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
