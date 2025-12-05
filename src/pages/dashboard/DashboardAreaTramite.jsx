import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Search, Eye, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardAreaTramite = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('derivado');
  const [busqueda, setBusqueda] = useState('');
  const [modalAccion, setModalAccion] = useState(null); // 'aprobar', 'rechazar', 'derivar', 'observar'
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [userData]);

  const cargarDatos = async () => {
    try {
      // Cargar expedientes asignados al área del usuario
      const { data: exps, error: errorExps } = await supabase
        .from('expedientes')
        .select(`
          *,
          tipos_tramite(nombre, tiempo_maximo_dias),
          usuarios!expedientes_ciudadano_id_fkey(nombres, apellidos, dni),
          derivaciones!derivaciones_expediente_id_fkey(
            usuario_deriva:usuarios!derivaciones_usuario_deriva_fkey(nombres, apellidos),
            instrucciones,
            fecha_derivacion
          )
        `)
        .eq('area_actual', userData.area)
        .in('estado', ['derivado', 'en_proceso', 'observado'])
        .order('created_at', { ascending: false });

      if (errorExps) throw errorExps;
      setExpedientes(exps || []);

      // Cargar usuarios para derivaciones
      const { data: users, error: errorUsers } = await supabase
        .from('usuarios')
        .select('*')
        .in('rol', ['area_tramite', 'alcalde'])
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
    derivado: { color: 'bg-purple-100 text-purple-800', icon: Send, label: 'Derivado - Pendiente' },
    en_proceso: { color: 'bg-orange-100 text-orange-800', icon: Clock, label: 'En Proceso' },
    observado: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Observado' }
  };

  const tomarExpediente = async (expedienteId) => {
    try {
      const { error } = await supabase
        .from('expedientes')
        .update({
          estado: 'en_proceso',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteId);

      if (error) throw error;

      // Registrar en historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteId,
          estado_anterior: 'derivado',
          estado_nuevo: 'en_proceso',
          comentario: `Expediente tomado por ${userData.nombres} ${userData.apellidos} del área ${userData.area}`,
          usuario_id: userData.id
        });

      toast.success('Expediente en proceso');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al tomar expediente');
    }
  };

  const abrirModal = (tipo, expediente) => {
    setModalAccion(tipo);
    setExpedienteSeleccionado(expediente);
  };

  const aprobarExpediente = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const observacion = formData.get('observacion');

    try {
      const { error } = await supabase
        .from('expedientes')
        .update({
          estado: 'aprobado',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteSeleccionado.id);

      if (error) throw error;

      // Historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          estado_anterior: 'en_proceso',
          estado_nuevo: 'aprobado',
          comentario: `Aprobado por ${userData.area}: ${observacion}`,
          usuario_id: userData.id
        });

      // Notificar ciudadano
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: expedienteSeleccionado.ciudadano_id,
          expediente_id: expedienteSeleccionado.id,
          tipo: 'aprobacion',
          titulo: 'Expediente aprobado',
          mensaje: `Su expediente ${expedienteSeleccionado.numero_expediente} ha sido aprobado`,
          leida: false
        });

      toast.success('Expediente aprobado exitosamente');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al aprobar expediente');
    }
  };

  const rechazarExpediente = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const motivo = formData.get('motivo');

    try {
      const { error } = await supabase
        .from('expedientes')
        .update({
          estado: 'rechazado',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteSeleccionado.id);

      if (error) throw error;

      // Historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          estado_anterior: 'en_proceso',
          estado_nuevo: 'rechazado',
          comentario: `Rechazado por ${userData.area}: ${motivo}`,
          usuario_id: userData.id
        });

      // Notificar ciudadano
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: expedienteSeleccionado.ciudadano_id,
          expediente_id: expedienteSeleccionado.id,
          tipo: 'rechazo',
          titulo: 'Expediente rechazado',
          mensaje: `Su expediente ${expedienteSeleccionado.numero_expediente} ha sido rechazado`,
          leida: false
        });

      toast.success('Expediente rechazado');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al rechazar expediente');
    }
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
          area_origen: userData.area,
          area_destino: area,
          instrucciones: instrucciones,
          fecha_derivacion: new Date().toISOString()
        });

      if (errorDer) throw errorDer;

      // Historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          estado_anterior: 'en_proceso',
          estado_nuevo: 'derivado',
          comentario: `Derivado de ${userData.area} a ${area}`,
          usuario_id: userData.id
        });

      // Notificar
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: responsableId,
          expediente_id: expedienteSeleccionado.id,
          tipo: 'derivacion',
          titulo: 'Expediente derivado',
          mensaje: `Expediente ${expedienteSeleccionado.numero_expediente} derivado a su área`,
          leida: false
        });

      toast.success('Expediente derivado exitosamente');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al derivar expediente');
    }
  };

  const observarExpediente = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const observacion = formData.get('observacion');

    try {
      const { error: errorExp } = await supabase
        .from('expedientes')
        .update({
          estado: 'observado',
          updated_at: new Date().toISOString()
        })
        .eq('id', expedienteSeleccionado.id);

      if (errorExp) throw errorExp;

      // Crear observación
      await supabase
        .from('observaciones')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          usuario_id: userData.id,
          tipo: 'observacion',
          descripcion: observacion,
          requiere_subsanacion: true
        });

      // Historial
      await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expedienteSeleccionado.id,
          estado_anterior: 'en_proceso',
          estado_nuevo: 'observado',
          comentario: `Observado por ${userData.area}: ${observacion}`,
          usuario_id: userData.id
        });

      // Notificar ciudadano
      await supabase
        .from('notificaciones')
        .insert({
          usuario_id: expedienteSeleccionado.ciudadano_id,
          expediente_id: expedienteSeleccionado.id,
          tipo: 'observacion',
          titulo: 'Expediente observado',
          mensaje: `Su expediente ${expedienteSeleccionado.numero_expediente} tiene observaciones`,
          leida: false
        });

      toast.success('Observación registrada');
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al observar expediente');
    }
  };

  const cerrarModal = () => {
    setModalAccion(null);
    setExpedienteSeleccionado(null);
  };

  const expedientesFiltrados = expedientes.filter(exp => {
    const cumpleFiltro = filtro === 'todos' || exp.estado === filtro;
    const cumpleBusqueda = exp.numero_expediente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          exp.asunto?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const estadisticas = {
    pendientes: expedientes.filter(e => e.estado === 'derivado').length,
    en_proceso: expedientes.filter(e => e.estado === 'en_proceso').length,
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
        <h1 className="text-2xl font-bold text-neutral-900">
          {userData.area}
        </h1>
        <p className="text-neutral-600 mt-1">
          Gestión de expedientes del área
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pendientes</p>
              <p className="text-2xl font-bold text-purple-600">{estadisticas.pendientes}</p>
            </div>
            <Send className="w-8 h-8 text-purple-600" />
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
              <p className="text-sm text-neutral-600">Total Asignados</p>
              <p className="text-2xl font-bold text-neutral-900">{estadisticas.total}</p>
            </div>
            <FileText className="w-8 h-8 text-neutral-600" />
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
              placeholder="Buscar expediente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="input">
            <option value="todos">Todos</option>
            <option value="derivado">Pendientes</option>
            <option value="en_proceso">En Proceso</option>
            <option value="observado">Observados</option>
          </select>
        </div>
      </div>

      {/* Lista de Expedientes */}
      <div className="space-y-4">
        {expedientesFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No hay expedientes asignados
            </h3>
            <p className="text-neutral-600">
              No tienes expedientes en tu área actualmente
            </p>
          </div>
        ) : (
          expedientesFiltrados.map((expediente) => {
            const config = estadoConfig[expediente.estado];
            const Icon = config.icon;
            const ultimaDerivacion = expediente.derivaciones?.[expediente.derivaciones.length - 1];

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
                        
                        {ultimaDerivacion && (
                          <div className="bg-neutral-50 p-2 rounded text-xs mb-2">
                            <p className="text-neutral-600">
                              <strong>Derivado por:</strong> {ultimaDerivacion.usuario_deriva?.nombres} {ultimaDerivacion.usuario_deriva?.apellidos}
                            </p>
                            <p className="text-neutral-600 mt-1">
                              <strong>Instrucciones:</strong> {ultimaDerivacion.instrucciones}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span>
                            Ciudadano: {expediente.usuarios?.nombres} {expediente.usuarios?.apellidos}
                          </span>
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

                    {expediente.estado === 'derivado' && (
                      <button
                        onClick={() => tomarExpediente(expediente.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Tomar
                      </button>
                    )}

                    {expediente.estado === 'en_proceso' && (
                      <>
                        <button
                          onClick={() => abrirModal('aprobar', expediente)}
                          className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => abrirModal('rechazar', expediente)}
                          className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </button>
                        <button
                          onClick={() => abrirModal('derivar', expediente)}
                          className="btn btn-outline btn-sm"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Derivar
                        </button>
                        <button
                          onClick={() => abrirModal('observar', expediente)}
                          className="btn btn-outline btn-sm"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
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

      {/* Modales */}
      {modalAccion && expedienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              {modalAccion === 'aprobar' && 'Aprobar Expediente'}
              {modalAccion === 'rechazar' && 'Rechazar Expediente'}
              {modalAccion === 'derivar' && 'Derivar Expediente'}
              {modalAccion === 'observar' && 'Observar Expediente'}
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Expediente: <strong>{expedienteSeleccionado.numero_expediente}</strong>
            </p>

            {modalAccion === 'aprobar' && (
              <form onSubmit={aprobarExpediente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Observación (opcional)
                  </label>
                  <textarea
                    name="observacion"
                    rows="3"
                    className="input w-full"
                    placeholder="Comentarios adicionales..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn bg-green-600 text-white hover:bg-green-700 flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </button>
                  <button type="button" onClick={cerrarModal} className="btn btn-outline flex-1">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {modalAccion === 'rechazar' && (
              <form onSubmit={rechazarExpediente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Motivo del Rechazo *
                  </label>
                  <textarea
                    name="motivo"
                    required
                    rows="3"
                    className="input w-full"
                    placeholder="Explique el motivo del rechazo..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn bg-red-600 text-white hover:bg-red-700 flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                  <button type="button" onClick={cerrarModal} className="btn btn-outline flex-1">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {modalAccion === 'derivar' && (
              <form onSubmit={derivarExpediente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Área de Destino *
                  </label>
                  <select name="area" required className="input w-full">
                    <option value="">Seleccione área...</option>
                    <option value="Gerencia Municipal">Gerencia Municipal</option>
                    <option value="Mesa de Partes">Mesa de Partes</option>
                    <option value="Alcaldía">Alcaldía</option>
                    <option value="Rentas">Rentas</option>
                    <option value="Obras Públicas">Obras Públicas</option>
                    <option value="Desarrollo Social">Desarrollo Social</option>
                    <option value="Desarrollo Económico">Desarrollo Económico</option>
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
                    placeholder="Instrucciones para el área destino..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Derivar
                  </button>
                  <button type="button" onClick={cerrarModal} className="btn btn-outline flex-1">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {modalAccion === 'observar' && (
              <form onSubmit={observarExpediente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Observación *
                  </label>
                  <textarea
                    name="observacion"
                    required
                    rows="4"
                    className="input w-full"
                    placeholder="Describa las observaciones para el ciudadano..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Registrar Observación
                  </button>
                  <button type="button" onClick={cerrarModal} className="btn btn-outline flex-1">
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAreaTramite;

