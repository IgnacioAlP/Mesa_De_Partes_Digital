import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Filter, Eye, Send, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardMesaPartes = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('registrado');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalDerivar, setMostrarModalDerivar] = useState(false);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar expedientes
      const { data: exps, error: errorExps } = await supabase
        .from('expedientes')
        .select(`
          *,
          tipos_tramite(nombre, tiempo_maximo_dias),
          usuarios!expedientes_ciudadano_id_fkey(nombres, apellidos, dni)
        `)
        .in('estado', ['registrado', 'en_revision', 'observado'])
        .order('created_at', { ascending: false });

      if (errorExps) throw errorExps;
      setExpedientes(exps || []);

      // Cargar usuarios de áreas de trámite
      const { data: users, error: errorUsers } = await supabase
        .from('usuarios')
        .select('*')
        .eq('rol', 'area_tramite')
        .eq('estado', 'activo')
        .order('nombres');

      if (errorUsers) throw errorUsers;
      setUsuarios(users || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const estadoConfig = {
    registrado: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Nuevo - Registrado' },
    en_revision: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En Revisión' },
    observado: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Observado' }
  };

  const revisarExpediente = async (expedienteId) => {
    try {
      const { error } = await supabase
        .from('expedientes')
        .update({ 
          estado: 'en_revision',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteId);

      if (error) throw error;

      // Registrar en historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteId,
          estado_anterior: 'registrado',
          estado_nuevo: 'en_revision',
          comentario: 'Expediente en revisión por Mesa de Partes',
          usuario_id: userData.id
        });

      toast.success('Expediente marcado como en revisión');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar expediente');
    }
  };

  const abrirModalDerivar = (expediente) => {
    setExpedienteSeleccionado(expediente);
    setMostrarModalDerivar(true);
  };

  const derivarExpediente = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const area = formData.get('area');
    const responsableId = formData.get('responsable_id');
    const instrucciones = formData.get('instrucciones');

    try {
      // Actualizar expediente
      const { error: errorExp } = await supabase
        .from('expedientes')
        .update({
          estado: 'derivado',
          area_actual: area,
          responsable_actual: responsableId,
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteSeleccionado.id);

      if (errorExp) throw errorExp;

      // Crear derivación
      const { error: errorDer } = await supabase
        .from('derivaciones')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          usuario_deriva: userData.id,
          usuario_recibe: responsableId,
          area_origen: 'Mesa de Partes',
          area_destino: area,
          instrucciones: instrucciones,
          fecha_derivacion: new Date().toISOString()
        });

      if (errorDer) throw errorDer;

      // Registrar en historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          estado_anterior: 'en_revision',
          estado_nuevo: 'derivado',
          comentario: `Derivado a ${area} - ${instrucciones}`,
          usuario_id: userData.id,
          area: area
        });

      // Crear notificación
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: responsableId,
          expediente_id: expedienteSeleccionado.id,
          tipo: 'derivacion',
          titulo: 'Nuevo expediente asignado',
          mensaje: `Se le ha asignado el expediente ${expedienteSeleccionado.numero_expediente}`,
          leida: false
        });

      toast.success('Expediente derivado exitosamente');
      setMostrarModalDerivar(false);
      setExpedienteSeleccionado(null);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al derivar expediente');
    }
  };

  const observarExpediente = async (expedienteId) => {
    const observacion = prompt('Ingrese la observación para el ciudadano:');
    if (!observacion) return;

    try {
      // Actualizar estado
      const { error: errorExp } = await supabase
        .from('expedientes')
        .update({
          estado: 'observado',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteId);

      if (errorExp) throw errorExp;

      // Crear observación
      const expediente = expedientes.find(e => e.id === expedienteId);
      await supabase
        .from('observaciones')
        .insert({
          expediente_id: expedienteId,
          usuario_id: userData.id,
          tipo: 'observacion',
          descripcion: observacion,
          requiere_subsanacion: true
        });

      // Historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteId,
          estado_anterior: expediente.estado,
          estado_nuevo: 'observado',
          comentario: observacion,
          usuario_id: userData.id
        });

      // Notificar ciudadano
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: expediente.ciudadano_id,
          expediente_id: expedienteId,
          tipo: 'observacion',
          titulo: 'Expediente observado',
          mensaje: `Su expediente ${expediente.numero_expediente} tiene observaciones`,
          leida: false
        });

      toast.success('Expediente observado');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al observar expediente');
    }
  };

  const expedientesFiltrados = expedientes.filter(exp => {
    const cumpleFiltro = filtro === 'todos' || exp.estado === filtro;
    const cumpleBusqueda = exp.numero_expediente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          exp.asunto?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          exp.usuarios?.dni?.includes(busqueda);
    return cumpleFiltro && cumpleBusqueda;
  });

  const estadisticas = {
    nuevos: expedientes.filter(e => e.estado === 'registrado').length,
    en_revision: expedientes.filter(e => e.estado === 'en_revision').length,
    observados: expedientes.filter(e => e.estado === 'observado').length,
    total: expedientes.length
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mesa de Partes</h1>
        <p className="text-neutral-600 mt-1">
          Gestión de expedientes nuevos y en revisión
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Nuevos</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.nuevos}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">En Revisión</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.en_revision}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
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

        <div className="card bg-neutral-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Pendientes</p>
              <p className="text-2xl font-bold text-neutral-900">{estadisticas.total}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-neutral-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por expediente, DNI o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="input">
              <option value="todos">Todos</option>
              <option value="registrado">Nuevos</option>
              <option value="en_revision">En Revisión</option>
              <option value="observado">Observados</option>
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
              No hay expedientes pendientes
            </h3>
            <p className="text-neutral-600">
              Todos los expedientes han sido procesados
            </p>
          </div>
        ) : (
          expedientesFiltrados.map((expediente) => {
            const config = estadoConfig[expediente.estado];
            const Icon = config.icon;

            return (
              <div key={expediente.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-neutral-900">
                            {expediente.numero_expediente}
                          </h3>
                          <span className={`badge ${config.color} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neutral-800 mb-1">
                          {expediente.tipos_tramite?.nombre}
                        </p>
                        <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                          {expediente.asunto}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {expediente.usuarios?.nombres} {expediente.usuarios?.apellidos}
                          </span>
                          <span>DNI: {expediente.usuarios?.dni}</span>
                          <span>
                            Registrado: {new Date(expediente.fecha_registro).toLocaleDateString('es-PE')}
                          </span>
                          {expediente.fecha_limite && (
                            <span className="text-red-600">
                              Vence: {new Date(expediente.fecha_limite).toLocaleDateString('es-PE')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/expediente/${expediente.id}`)}
                      className="btn btn-outline btn-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>

                    {expediente.estado === 'registrado' && (
                      <button
                        onClick={() => revisarExpediente(expediente.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Revisar
                      </button>
                    )}

                    {expediente.estado === 'en_revision' && (
                      <>
                        <button
                          onClick={() => abrirModalDerivar(expediente)}
                          className="btn btn-primary btn-sm flex items-center gap-1"
                        >
                          <Send className="w-4 h-4" />
                          Derivar
                        </button>
                        <button
                          onClick={() => observarExpediente(expediente.id)}
                          className="btn btn-outline btn-sm text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Observar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Derivar */}
      {mostrarModalDerivar && expedienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Derivar Expediente
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Expediente: <strong>{expedienteSeleccionado.numero_expediente}</strong>
            </p>

            <form onSubmit={derivarExpediente} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Área de Destino *
                </label>
                <select name="area" required className="input w-full">
                  <option value="">Seleccione área...</option>
                  <option value="Gerencia Municipal">Gerencia Municipal</option>
                  <option value="Secretaría General">Secretaría General</option>
                  <option value="Rentas">Rentas</option>
                  <option value="Obras Públicas">Obras Públicas</option>
                  <option value="Desarrollo Social">Desarrollo Social</option>
                  <option value="Desarrollo Económico">Desarrollo Económico</option>
                  <option value="Servicios Públicos">Servicios Públicos</option>
                  <option value="Asesoría Legal">Asesoría Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Responsable *
                </label>
                <select name="responsable_id" required className="input w-full">
                  <option value="">Seleccione responsable...</option>
                  {usuarios.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nombres} {user.apellidos} - {user.area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Instrucciones *
                </label>
                <textarea
                  name="instrucciones"
                  required
                  rows="3"
                  className="input w-full"
                  placeholder="Ingrese las instrucciones para el área..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Derivar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalDerivar(false);
                    setExpedienteSeleccionado(null);
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMesaPartes;

