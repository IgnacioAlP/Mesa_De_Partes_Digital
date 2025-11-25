import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Clock, CheckCircle, TrendingUp, Users, Building, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardAlcalde = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('resumen'); // resumen, expedientes, areas

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar todos los expedientes
      const { data: exps, error: errorExps } = await supabase
        .from('expedientes')
        .select(`
          *,
          tipos_tramite(nombre),
          usuarios!expedientes_ciudadano_id_fkey(nombres, apellidos)
        `)
        .order('created_at', { ascending: false });

      if (errorExps) throw errorExps;
      setExpedientes(exps || []);

      // Calcular estadísticas
      const stats = calcularEstadisticas(exps || []);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (exps) => {
    const hoy = new Date();
    const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const hace30dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Estadísticas por estado
    const porEstado = {
      registrado: exps.filter(e => e.estado === 'registrado').length,
      en_revision: exps.filter(e => e.estado === 'en_revision').length,
      derivado: exps.filter(e => e.estado === 'derivado').length,
      en_proceso: exps.filter(e => e.estado === 'en_proceso').length,
      observado: exps.filter(e => e.estado === 'observado').length,
      aprobado: exps.filter(e => e.estado === 'aprobado').length,
      rechazado: exps.filter(e => e.estado === 'rechazado').length,
      finalizado: exps.filter(e => e.estado === 'finalizado').length
    };

    // Estadísticas por área
    const porArea = {};
    exps.forEach(exp => {
      if (exp.area_actual) {
        porArea[exp.area_actual] = (porArea[exp.area_actual] || 0) + 1;
      }
    });

    // Trámites nuevos
    const nuevos7dias = exps.filter(e => new Date(e.created_at) >= hace7dias).length;
    const nuevos30dias = exps.filter(e => new Date(e.created_at) >= hace30dias).length;

    // Trámites completados
    const completados7dias = exps.filter(e => 
      ['finalizado', 'aprobado'].includes(e.estado) && 
      new Date(e.updated_at) >= hace7dias
    ).length;
    const completados30dias = exps.filter(e => 
      ['finalizado', 'aprobado'].includes(e.estado) && 
      new Date(e.updated_at) >= hace30dias
    ).length;

    // Tiempo promedio de atención
    const finalizados = exps.filter(e => e.estado === 'finalizado');
    let tiempoPromedio = 0;
    if (finalizados.length > 0) {
      const tiempos = finalizados.map(e => {
        const inicio = new Date(e.fecha_registro);
        const fin = new Date(e.updated_at);
        return (fin - inicio) / (1000 * 60 * 60 * 24); // días
      });
      tiempoPromedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
    }

    // Expedientes atrasados
    const atrasados = exps.filter(e => {
      if (!e.fecha_limite) return false;
      const limite = new Date(e.fecha_limite);
      return limite < hoy && !['finalizado', 'aprobado', 'rechazado'].includes(e.estado);
    }).length;

    // Top 5 tipos de trámite
    const tiposCuenta = {};
    exps.forEach(exp => {
      const tipo = exp.tipos_tramite?.nombre || 'Otros';
      tiposCuenta[tipo] = (tiposCuenta[tipo] || 0) + 1;
    });
    const topTipos = Object.entries(tiposCuenta)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tipo, cantidad]) => ({ tipo, cantidad }));

    return {
      total: exps.length,
      porEstado,
      porArea: Object.entries(porArea)
        .sort((a, b) => b[1] - a[1])
        .map(([area, cantidad]) => ({ area, cantidad })),
      nuevos7dias,
      nuevos30dias,
      completados7dias,
      completados30dias,
      tiempoPromedio: Math.round(tiempoPromedio * 10) / 10,
      atrasados,
      topTipos,
      enProceso: porEstado.registrado + porEstado.en_revision + porEstado.derivado + porEstado.en_proceso
    };
  };

  if (loading || !estadisticas) {
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
            Panel de Control - Alcaldía
          </h1>
          <p className="text-neutral-600 mt-1">
            Vista general del sistema de trámites municipales
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVista('resumen')}
            className={`btn btn-sm ${vista === 'resumen' ? 'btn-primary' : 'btn-outline'}`}
          >
            Resumen
          </button>
          <button
            onClick={() => setVista('expedientes')}
            className={`btn btn-sm ${vista === 'expedientes' ? 'btn-primary' : 'btn-outline'}`}
          >
            Expedientes
          </button>
          <button
            onClick={() => setVista('areas')}
            className={`btn btn-sm ${vista === 'areas' ? 'btn-primary' : 'btn-outline'}`}
          >
            Por Área
          </button>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Trámites</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.total}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {estadisticas.nuevos30dias} nuevos este mes
              </p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="card bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">En Proceso</p>
              <p className="text-3xl font-bold text-orange-600">{estadisticas.enProceso}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {estadisticas.nuevos7dias} nuevos esta semana
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Finalizados</p>
              <p className="text-3xl font-bold text-green-600">
                {estadisticas.porEstado.finalizado + estadisticas.porEstado.aprobado}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {estadisticas.completados30dias} este mes
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="card bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Atrasados</p>
              <p className="text-3xl font-bold text-red-600">{estadisticas.atrasados}</p>
              <p className="text-xs text-neutral-500 mt-1">
                Requieren atención urgente
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Métricas de Rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Tiempo Promedio</p>
              <p className="text-xl font-bold text-neutral-900">
                {estadisticas.tiempoPromedio} días
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Tasa de Aprobación</p>
              <p className="text-xl font-bold text-neutral-900">
                {estadisticas.total > 0 
                  ? Math.round((estadisticas.porEstado.aprobado / estadisticas.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Eficiencia</p>
              <p className="text-xl font-bold text-neutral-900">
                {estadisticas.total > 0
                  ? Math.round(((estadisticas.porEstado.finalizado + estadisticas.porEstado.aprobado) / estadisticas.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {vista === 'resumen' && (
        <>
          {/* Distribución por Estado */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribución por Estado
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => {
                const configs = {
                  registrado: { label: 'Registrado', color: 'bg-blue-100 text-blue-800' },
                  en_revision: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
                  derivado: { label: 'Derivado', color: 'bg-purple-100 text-purple-800' },
                  en_proceso: { label: 'En Proceso', color: 'bg-orange-100 text-orange-800' },
                  observado: { label: 'Observado', color: 'bg-red-100 text-red-800' },
                  aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
                  rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
                  finalizado: { label: 'Finalizado', color: 'bg-green-100 text-green-800' }
                };
                const config = configs[estado];
                
                return (
                  <div key={estado} className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-900">{cantidad}</p>
                    <p className={`text-xs mt-1 inline-block px-2 py-1 rounded ${config.color}`}>
                      {config.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tipos de Trámite */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Top 5 Tipos de Trámite
            </h3>
            <div className="space-y-3">
              {estadisticas.topTipos.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-neutral-900">{item.tipo}</span>
                      <span className="text-sm text-neutral-600">{item.cantidad} trámites</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(item.cantidad / estadisticas.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {vista === 'areas' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Distribución por Área
          </h3>
          <div className="space-y-3">
            {estadisticas.porArea.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-neutral-900">{item.area}</span>
                    <span className="text-sm text-neutral-600">{item.cantidad} expedientes</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${(item.cantidad / estadisticas.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vista === 'expedientes' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Todos los Expedientes
          </h3>
          <div className="space-y-2">
            {expedientes.slice(0, 20).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
                onClick={() => navigate(`/dashboard/expediente/${exp.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">{exp.numero_expediente}</span>
                    <span className="badge bg-neutral-200 text-neutral-700 text-xs">
                      {exp.tipos_tramite?.nombre}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-1">{exp.asunto}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">{exp.area_actual}</span>
                  <span className={`badge ${
                    exp.estado === 'finalizado' || exp.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                    exp.estado === 'observado' || exp.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {exp.estado}
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

export default DashboardAlcalde;
