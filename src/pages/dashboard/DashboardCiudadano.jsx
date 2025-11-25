import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardCiudadano = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (userData?.id) {
      cargarDatos();
    }
  }, [userData]);

  const cargarDatos = async () => {
    if (!userData?.id) {
      setLoading(false);
      return;
    }
    
    try {
      // Cargar expedientes del ciudadano
      const { data: exps, error: errorExps } = await supabase
        .from('expedientes')
        .select(`
          *,
          tipos_tramite(nombre, tiempo_maximo_dias)
        `)
        .eq('ciudadano_id', userData.id)
        .order('created_at', { ascending: false });

      if (errorExps) throw errorExps;
      setExpedientes(exps || []);

      // Cargar tipos de trámite
      const { data: tipos, error: errorTipos } = await supabase
        .from('tipos_tramite')
        .select('*')
        .eq('estado', 'activo')
        .order('es_comun', { ascending: false });

      if (errorTipos) throw errorTipos;
      setTiposTramite(tipos || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const estadoConfig = {
    registrado: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Registrado' },
    en_revision: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En Revisión' },
    derivado: { color: 'bg-purple-100 text-purple-800', icon: FileText, label: 'Derivado' },
    en_proceso: { color: 'bg-orange-100 text-orange-800', icon: Clock, label: 'En Proceso' },
    observado: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Observado' },
    aprobado: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aprobado' },
    rechazado: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rechazado' },
    finalizado: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Finalizado' },
    archivado: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Archivado' }
  };

  const expedientesFiltrados = expedientes.filter(exp => {
    const cumpleFiltro = filtro === 'todos' || exp.estado === filtro;
    const cumpleBusqueda = exp.numero_expediente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          exp.asunto?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const estadisticas = {
    total: expedientes.length,
    en_proceso: expedientes.filter(e => ['registrado', 'en_revision', 'derivado', 'en_proceso'].includes(e.estado)).length,
    finalizados: expedientes.filter(e => e.estado === 'finalizado').length,
    observados: expedientes.filter(e => e.estado === 'observado').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Mis Trámites
          </h1>
          <p className="text-neutral-600 mt-1">
            Bienvenido, {userData.nombres} {userData.apellidos}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/nuevo-tramite')}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Trámite
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Trámites</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">En Proceso</p>
              <p className="text-2xl font-bold text-orange-600">{estadisticas.en_proceso}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Finalizados</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.finalizados}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Observados</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.observados}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de expediente o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="input"
            >
              <option value="todos">Todos los estados</option>
              <option value="registrado">Registrado</option>
              <option value="en_revision">En Revisión</option>
              <option value="en_proceso">En Proceso</option>
              <option value="observado">Observado</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Expedientes */}
      <div className="space-y-4">
        {expedientesFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No hay trámites {filtro !== 'todos' ? 'con este estado' : ''}
            </h3>
            <p className="text-neutral-600 mb-4">
              {expedientes.length === 0 
                ? 'Comienza creando tu primer trámite'
                : 'Prueba con otro filtro o búsqueda'}
            </p>
            {expedientes.length === 0 && (
              <button
                onClick={() => navigate('/dashboard/nuevo-tramite')}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Primer Trámite
              </button>
            )}
          </div>
        ) : (
          expedientesFiltrados.map((expediente) => {
            const config = estadoConfig[expediente.estado] || estadoConfig.registrado;
            const Icon = config.icon;
            
            return (
              <div key={expediente.id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => navigate(`/dashboard/expediente/${expediente.id}`)}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">
                            {expediente.numero_expediente}
                          </h3>
                          <span className={`badge ${config.color} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neutral-800 mb-1">
                          {expediente.tipos_tramite?.nombre || 'Trámite'}
                        </p>
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {expediente.asunto}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                          <span>
                            Registrado: {new Date(expediente.fecha_registro).toLocaleDateString('es-PE')}
                          </span>
                          {expediente.fecha_limite && (
                            <span>
                              Vence: {new Date(expediente.fecha_limite).toLocaleDateString('es-PE')}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-neutral-100 rounded">
                            {expediente.area_actual}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/expediente/${expediente.id}`);
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trámites Comunes */}
      {expedientes.length === 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Trámites Más Comunes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposTramite.filter(t => t.es_comun).slice(0, 6).map((tipo) => (
              <div
                key={tipo.id}
                className="p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate('/dashboard/nuevo-tramite', { state: { tipoTramiteId: tipo.id } })}
              >
                <h4 className="font-medium text-neutral-900 mb-2">{tipo.nombre}</h4>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{tipo.descripcion}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {tipo.tiempo_maximo_dias} días
                  </span>
                  <span className="font-medium text-primary-600">
                    S/ {tipo.costo?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCiudadano;
