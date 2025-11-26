import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCog, Shield, Database, Activity, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const DashboardTI = () => {
  const { userData } = useAuthStore();
  const [usuarios, setUsuarios] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('usuarios'); // usuarios, auditoria, sistema
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [vista]);

  const cargarDatos = async () => {
    try {
      if (vista === 'usuarios') {
        const { data: users, error } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsuarios(users || []);
      } else if (vista === 'auditoria') {
        const { data: audit, error } = await supabase
          .from('auditoria')
          .select(`
            *,
            usuarios(nombres, apellidos)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setAuditoria(audit || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEditar = (usuario = null) => {
    setUsuarioEditar(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEditar(null);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const usuarioData = {
      dni: formData.get('dni'),
      nombres: formData.get('nombres'),
      apellidos: formData.get('apellidos'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      direccion: formData.get('direccion'),
      rol: formData.get('rol'),
      area: formData.get('area'),
      estado: formData.get('estado')
    };

    try {
      if (usuarioEditar) {
        // Actualizar usuario existente
        const { error } = await supabase
          .from('usuarios')
          .update(usuarioData)
          .eq('id', usuarioEditar.id);

        if (error) throw error;
        toast.success('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario (solo actualiza la tabla usuarios, no auth.users)
        toast.info('Para crear usuarios completos, use el registro normal del sistema');
        cerrarModal();
        return;
      }

      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar usuario');
    }
  };

  const cambiarEstadoUsuario = async (userId, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: nuevoEstado })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'suspendido'}`);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cambiar estado');
    }
  };

  const eliminarUsuario = async (userId) => {
    if (!confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: 'inactivo' })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Usuario desactivado');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(user => {
    const termino = busqueda.toLowerCase();
    return user.nombres?.toLowerCase().includes(termino) ||
           user.apellidos?.toLowerCase().includes(termino) ||
           user.dni?.includes(termino) ||
           user.email?.toLowerCase().includes(termino);
  });

  const estadisticas = {
    total: usuarios.length,
    activos: usuarios.filter(u => u.estado === 'activo').length,
    suspendidos: usuarios.filter(u => u.estado === 'suspendido').length,
    inactivos: usuarios.filter(u => u.estado === 'inactivo').length,
    porRol: {
      ciudadano: usuarios.filter(u => u.rol === 'ciudadano').length,
      mesa_partes: usuarios.filter(u => u.rol === 'mesa_partes').length,
      area_tramite: usuarios.filter(u => u.rol === 'area_tramite').length,
      alcalde: usuarios.filter(u => u.rol === 'alcalde').length,
      ti: usuarios.filter(u => u.rol === 'ti').length
    }
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
            Administración del Sistema
          </h1>
          <p className="text-neutral-600 mt-1">
            Gestión de usuarios y configuración
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVista('usuarios')}
            className={`btn btn-sm ${vista === 'usuarios' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Users className="w-4 h-4 mr-1" />
            Usuarios
          </button>
          <button
            onClick={() => setVista('auditoria')}
            className={`btn btn-sm ${vista === 'auditoria' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Database className="w-4 h-4 mr-1" />
            Auditoría
          </button>
          <button
            onClick={() => setVista('sistema')}
            className={`btn btn-sm ${vista === 'sistema' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Activity className="w-4 h-4 mr-1" />
            Sistema
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.activos}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Suspendidos</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.suspendidos}</p>
            </div>
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.inactivos}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {vista === 'usuarios' && (
        <>
          {/* Filtros */}
          <div className="card">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* Distribución por Rol */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Usuarios por Rol</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(estadisticas.porRol).map(([rol, cantidad]) => {
                const labels = {
                  ciudadano: 'Ciudadanos',
                  mesa_partes: 'Mesa de Partes',
                  area_tramite: 'Áreas de Trámite',
                  alcalde: 'Alcalde',
                  ti: 'TI'
                };
                return (
                  <div key={rol} className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">{cantidad}</p>
                    <p className="text-xs text-neutral-600 mt-1">{labels[rol]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de Usuarios */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Lista de Usuarios ({usuariosFiltrados.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">DNI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Área</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">{usuario.dni}</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">
                        {usuario.nombres} {usuario.apellidos}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{usuario.email}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary-100 text-primary-800">
                          {usuario.rol?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{usuario.area || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          usuario.estado === 'activo' ? 'bg-green-100 text-green-800' :
                          usuario.estado === 'suspendido' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {usuario.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModalEditar(usuario)}
                            className="text-primary-600 hover:text-primary-700"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {usuario.estado === 'activo' ? (
                            <button
                              onClick={() => cambiarEstadoUsuario(usuario.id, 'suspendido')}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Suspender"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => cambiarEstadoUsuario(usuario.id, 'activo')}
                              className="text-green-600 hover:text-green-700"
                              title="Activar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => eliminarUsuario(usuario.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {vista === 'auditoria' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Registro de Auditoría (Últimas 50 acciones)
          </h3>
          <div className="space-y-2">
            {auditoria.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded">
                  <Activity className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-900">
                      {item.usuarios?.nombres} {item.usuarios?.apellidos}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {new Date(item.created_at).toLocaleString('es-PE')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {item.accion} {item.tabla_afectada ? `- ${item.tabla_afectada}` : ''}
                  </p>
                  {item.datos_nuevos && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {JSON.stringify(item.datos_nuevos).substring(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vista === 'sistema' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Información del Sistema</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                <span className="text-neutral-600">Versión</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                <span className="text-neutral-600">Base de Datos</span>
                <span className="font-medium text-green-600">● Conectado</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                <span className="text-neutral-600">Servidor</span>
                <span className="font-medium text-green-600">● Operativo</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                <span className="text-neutral-600">Última Actualización</span>
                <span className="font-medium">{new Date().toLocaleDateString('es-PE')}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Acciones del Sistema</h3>
            <div className="space-y-2">
              <button className="btn btn-outline w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Respaldar Base de Datos
              </button>
              <button className="btn btn-outline w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Ver Logs del Sistema
              </button>
              <button className="btn btn-outline w-full justify-start">
                <UserCog className="w-4 h-4 mr-2" />
                Configuración General
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {mostrarModal && usuarioEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Editar Usuario
            </h3>

            <form onSubmit={guardarUsuario} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">DNI *</label>
                  <input
                    type="text"
                    name="dni"
                    defaultValue={usuarioEditar.dni}
                    required
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={usuarioEditar.email}
                    required
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    defaultValue={usuarioEditar.nombres}
                    required
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    defaultValue={usuarioEditar.apellidos}
                    required
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    defaultValue={usuarioEditar.telefono || ''}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    defaultValue={usuarioEditar.direccion || ''}
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Rol *</label>
                  <select name="rol" defaultValue={usuarioEditar.rol} required className="input w-full">
                    <option value="ciudadano">Ciudadano</option>
                    <option value="mesa_partes">Mesa de Partes</option>
                    <option value="area_tramite">Área de Trámite</option>
                    <option value="alcalde">Alcalde</option>
                    <option value="ti">TI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Área</label>
                  <input
                    type="text"
                    name="area"
                    defaultValue={usuarioEditar.area || ''}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Estado *</label>
                  <select name="estado" defaultValue={usuarioEditar.estado} required className="input w-full">
                    <option value="activo">Activo</option>
                    <option value="suspendido">Suspendido</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Guardar Cambios
                </button>
                <button type="button" onClick={cerrarModal} className="btn btn-outline flex-1">
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

export default DashboardTI;
