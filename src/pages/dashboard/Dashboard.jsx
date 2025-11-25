import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, AlertCircle, TrendingUp, 
  Users, BarChart, Bell 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const { userData } = useAuthStore();
  const [stats, setStats] = useState({
    totalExpedientes: 0,
    enProceso: 0,
    finalizados: 0,
    pendientes: 0,
  });
  const [recentExpedientes, setRecentExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userData]);

  const fetchDashboardData = async () => {
    try {
      if (userData?.rol === 'ciudadano') {
        await fetchCiudadanoData();
      } else {
        await fetchMunicipalData();
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCiudadanoData = async () => {
    // Obtener estadísticas del ciudadano
    const { data: expedientes, error } = await supabase
      .from('expedientes')
      .select('*, tipos_tramite(nombre)')
      .eq('ciudadano_id', userData.id)
      .order('fecha_registro', { ascending: false });

    if (error) throw error;

    setStats({
      totalExpedientes: expedientes?.length || 0,
      enProceso: expedientes?.filter(e => ['en_proceso', 'derivado', 'en_revision'].includes(e.estado)).length || 0,
      finalizados: expedientes?.filter(e => e.estado === 'finalizado').length || 0,
      pendientes: expedientes?.filter(e => e.estado === 'registrado').length || 0,
    });

    setRecentExpedientes(expedientes?.slice(0, 5) || []);
  };

  const fetchMunicipalData = async () => {
    // Obtener estadísticas para personal municipal
    let query = supabase
      .from('expedientes')
      .select('*, tipos_tramite(nombre), usuarios!expedientes_ciudadano_id_fkey(nombres, apellidos)')
      .order('fecha_registro', { ascending: false });

    // Filtrar por área si es personal de área
    if (userData?.rol === 'area_tramite' && userData?.area_asignada) {
      query = query.eq('area_actual', userData.area_asignada);
    }

    const { data: expedientes, error } = await query;

    if (error) throw error;

    setStats({
      totalExpedientes: expedientes?.length || 0,
      enProceso: expedientes?.filter(e => ['en_proceso', 'derivado'].includes(e.estado)).length || 0,
      finalizados: expedientes?.filter(e => e.estado === 'finalizado').length || 0,
      pendientes: expedientes?.filter(e => ['registrado', 'en_revision'].includes(e.estado)).length || 0,
    });

    setRecentExpedientes(expedientes?.slice(0, 5) || []);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'registrado': { class: 'badge-info', label: 'Registrado' },
      'en_revision': { class: 'badge-warning', label: 'En Revisión' },
      'derivado': { class: 'badge-info', label: 'Derivado' },
      'en_proceso': { class: 'badge-warning', label: 'En Proceso' },
      'observado': { class: 'badge-danger', label: 'Observado' },
      'aprobado': { class: 'badge-success', label: 'Aprobado' },
      'rechazado': { class: 'badge-danger', label: 'Rechazado' },
      'finalizado': { class: 'badge-success', label: 'Finalizado' },
    };

    const badge = badges[estado] || { class: 'badge-info', label: estado };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">Cargando dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Bienvenido, {userData?.nombres}
            </h1>
            <p className="text-neutral-600 mt-1">
              {userData?.rol === 'ciudadano' 
                ? 'Gestiona tus trámites y consulta el estado de tus expedientes' 
                : `Panel de ${userData?.area_asignada || 'Administración'}`
              }
            </p>
          </div>
          {userData?.rol === 'ciudadano' && (
            <Link to="/nuevo-tramite" className="btn btn-primary">
              <FileText className="h-5 w-5 mr-2" />
              Nuevo Trámite
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Total Expedientes</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalExpedientes}</h3>
              </div>
              <FileText className="h-12 w-12 text-primary-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm">En Proceso</p>
                <h3 className="text-3xl font-bold mt-1">{stats.enProceso}</h3>
              </div>
              <Clock className="h-12 w-12 text-secondary-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 text-sm">Finalizados</p>
                <h3 className="text-3xl font-bold mt-1">{stats.finalizados}</h3>
              </div>
              <CheckCircle className="h-12 w-12 text-accent-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-danger-100 text-sm">Pendientes</p>
                <h3 className="text-3xl font-bold mt-1">{stats.pendientes}</h3>
              </div>
              <AlertCircle className="h-12 w-12 text-danger-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {userData?.rol === 'ciudadano' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/nuevo-tramite"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Nuevo Trámite</h3>
                  <p className="text-sm text-neutral-600">Iniciar procedimiento</p>
                </div>
              </Link>

              <Link 
                to="/seguimiento"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-neutral-200 hover:border-accent-500 hover:bg-accent-50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600">
                  <BarChart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Seguimiento</h3>
                  <p className="text-sm text-neutral-600">Consultar estado</p>
                </div>
              </Link>

              <Link 
                to="/tramites"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-neutral-200 hover:border-secondary-500 hover:bg-secondary-50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-700">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Mis Trámites</h3>
                  <p className="text-sm text-neutral-600">Ver historial</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Expedientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              {userData?.rol === 'ciudadano' ? 'Mis Expedientes Recientes' : 'Expedientes Recientes'}
            </h2>
            <Link 
              to={userData?.rol === 'ciudadano' ? '/tramites' : '/expedientes'}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {recentExpedientes.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <p>No hay expedientes registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      N° Expediente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Trámite
                    </th>
                    {userData?.rol !== 'ciudadano' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                        Ciudadano
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {recentExpedientes.map((expediente) => (
                    <tr key={expediente.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm font-medium text-primary-600">
                        {expediente.numero_expediente}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">
                        {expediente.tipos_tramite?.nombre || 'N/A'}
                      </td>
                      {userData?.rol !== 'ciudadano' && (
                        <td className="px-4 py-3 text-sm text-neutral-700">
                          {expediente.usuarios?.nombres} {expediente.usuarios?.apellidos}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        {getEstadoBadge(expediente.estado)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {new Date(expediente.fecha_registro).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        <Link 
                          to={`/expediente/${expediente.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
