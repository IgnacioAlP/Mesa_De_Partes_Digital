import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, User, MapPin, Download, MessageSquare, History, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const DetalleExpediente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthStore();
  const [expediente, setExpediente] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [derivaciones, setDerivaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarExpediente();
  }, [id]);

  const cargarExpediente = async () => {
    try {
      console.log('🔍 Cargando expediente ID:', id);
      
      // Cargar expediente
      const { data: exp, error: expError } = await supabase
        .from('expedientes')
        .select(`
          *,
          tipos_tramite(nombre, descripcion, tiempo_maximo_dias, costo, requisitos),
          usuarios!expedientes_ciudadano_id_fkey(nombres, apellidos, dni, email, telefono)
        `)
        .eq('id', id)
        .single();

      if (expError) {
        console.error('❌ Error cargando expediente:', expError);
        throw expError;
      }
      
      console.log('✅ Expediente cargado:', exp);
      setExpediente(exp);

      // Cargar documentos
      console.log('📄 Cargando documentos...');
      const { data: docs, error: docsError } = await supabase
        .from('documentos')
        .select('*')
        .eq('expediente_id', id)
        .order('fecha_subida', { ascending: false });

      if (docsError) {
        console.error('❌ Error cargando documentos:', docsError);
        throw docsError;
      }
      console.log('✅ Documentos cargados:', docs?.length || 0);
      setDocumentos(docs || []);

      // Cargar historial
      console.log('📋 Cargando historial...');
      const { data: hist, error: histError } = await supabase
        .from('historial_estados')
        .select(`
          *,
          usuarios(nombres, apellidos)
        `)
        .eq('expediente_id', id)
        .order('fecha_cambio', { ascending: false });

      if (histError) {
        console.error('❌ Error cargando historial:', histError);
        throw histError;
      }
      console.log('✅ Historial cargado:', hist?.length || 0);
      setHistorial(hist || []);

      // Cargar observaciones
      const { data: obs, error: obsError } = await supabase
        .from('observaciones')
        .select(`
          *,
          usuarios(nombres, apellidos)
        `)
        .eq('expediente_id', id)
        .order('created_at', { ascending: false });

      if (obsError) throw obsError;
      setObservaciones(obs || []);

      // Cargar derivaciones
      console.log('🔄 Cargando derivaciones...');
      const { data: der, error: derError } = await supabase
        .from('derivaciones')
        .select(`
          *,
          usuario_deriva:usuarios!derivaciones_usuario_deriva_fkey(nombres, apellidos),
          usuario_recibe:usuarios!derivaciones_usuario_recibe_fkey(nombres, apellidos)
        `)
        .eq('expediente_id', id)
        .order('fecha_derivacion', { ascending: false });

      if (derError) {
        console.error('❌ Error cargando derivaciones:', derError);
        throw derError;
      }
      console.log('✅ Derivaciones cargadas:', der?.length || 0);
      setDerivaciones(der || []);

      console.log('✅ Todos los datos cargados correctamente');

    } catch (error) {
      console.error('❌ ERROR GENERAL cargando expediente:', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      toast.error(`Error al cargar el expediente: ${error.message || 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const descargarDocumento = async (documento) => {
    try {
      // Extraer el path del storage desde ruta_almacenamiento
      const storagePath = documento.ruta_almacenamiento?.split('/documentos/').pop() || documento.ruta_almacenamiento;
      
      const { data, error } = await supabase.storage
        .from('documentos')
        .download(storagePath);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = documento.nombre_archivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Documento descargado');
    } catch (error) {
      console.error('Error descargando documento:', error);
      toast.error('Error al descargar el documento');
    }
  };

  const estadoConfig = {
    registrado: { color: 'bg-blue-100 text-blue-800', label: 'Registrado' },
    en_revision: { color: 'bg-yellow-100 text-yellow-800', label: 'En Revisión' },
    derivado: { color: 'bg-purple-100 text-purple-800', label: 'Derivado' },
    en_proceso: { color: 'bg-orange-100 text-orange-800', label: 'En Proceso' },
    observado: { color: 'bg-red-100 text-red-800', label: 'Observado' },
    aprobado: { color: 'bg-green-100 text-green-800', label: 'Aprobado' },
    rechazado: { color: 'bg-red-100 text-red-800', label: 'Rechazado' },
    finalizado: { color: 'bg-green-100 text-green-800', label: 'Finalizado' },
    archivado: { color: 'bg-gray-100 text-gray-800', label: 'Archivado' }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Expediente no encontrado</h3>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const config = estadoConfig[expediente.estado] || estadoConfig.registrado;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">
            Expediente {expediente.numero_expediente}
          </h1>
          <p className="text-neutral-600 mt-1">
            {expediente.tipos_tramite?.nombre}
          </p>
        </div>
        <span className={`badge ${config.color} text-lg px-4 py-2`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Trámite */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Información del Trámite
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Asunto</p>
                <p className="font-medium text-neutral-900">{expediente.asunto}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Descripción</p>
                <p className="text-neutral-900 whitespace-pre-wrap">{expediente.descripcion}</p>
              </div>
              {expediente.tipos_tramite?.requisitos && (
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Requisitos</p>
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <ul className="space-y-1 text-sm">
                      {expediente.tipos_tramite.requisitos.split('\n').filter(r => r.trim()).map((req, idx) => (
                        <li key={idx} className="text-neutral-700">• {req.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documentos Adjuntos */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentos Adjuntos ({documentos.length})
            </h3>
            {documentos.length === 0 ? (
              <p className="text-neutral-500 text-center py-4">No hay documentos adjuntos</p>
            ) : (
              <div className="space-y-2">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {doc.nombre_archivo}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatBytes(doc.tamanio)} • {new Date(doc.created_at).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => descargarDocumento(doc)}
                      className="btn btn-outline btn-sm"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observaciones */}
          {observaciones.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                Observaciones ({observaciones.length})
              </h3>
              <div className="space-y-3">
                {observaciones.map((obs) => (
                  <div key={obs.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {obs.usuarios?.nombres} {obs.usuarios?.apellidos}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(obs.fecha_observacion).toLocaleString('es-PE')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700">{obs.observacion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial de Derivaciones */}
          {derivaciones.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Historial de Derivaciones ({derivaciones.length})
              </h3>
              <div className="space-y-3">
                {derivaciones.map((der, index) => (
                  <div key={der.id} className="relative pl-8 pb-4 border-l-2 border-neutral-200 last:border-0">
                    <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-2 border-white"></div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {der.area_origen} → {der.area_destino}
                          </p>
                          <p className="text-xs text-neutral-600">
                            De: {der.usuario_deriva?.nombres} {der.usuario_deriva?.apellidos} → 
                            Para: {der.usuario_recibe?.nombres} {der.usuario_recibe?.apellidos}
                          </p>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {new Date(der.fecha_derivacion).toLocaleString('es-PE')}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700">{der.instrucciones}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial Completo */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historial de Estados ({historial.length})
            </h3>
            <div className="space-y-3">
              {historial.map((hist, index) => (
                <div key={hist.id} className="relative pl-8 pb-4 border-l-2 border-neutral-200 last:border-0">
                  <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-primary-500' : 'bg-neutral-300'
                  } border-2 border-white`}></div>
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {hist.estado_anterior && (
                          <span className={`badge ${estadoConfig[hist.estado_anterior]?.color || 'bg-neutral-200'} text-xs`}>
                            {estadoConfig[hist.estado_anterior]?.label || hist.estado_anterior}
                          </span>
                        )}
                        <span className="text-neutral-500">→</span>
                        <span className={`badge ${estadoConfig[hist.estado_nuevo]?.color || 'bg-neutral-200'} text-xs`}>
                          {estadoConfig[hist.estado_nuevo]?.label || hist.estado_nuevo}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {new Date(hist.fecha_cambio).toLocaleString('es-PE')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      Por: {hist.usuarios?.nombres} {hist.usuarios?.apellidos}
                    </p>
                    {hist.observacion && (
                      <p className="text-sm text-neutral-700 mt-2">{hist.observacion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          {/* Información del Ciudadano */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Ciudadano
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Nombre</p>
                <p className="font-medium text-neutral-900">
                  {expediente.usuarios?.nombres} {expediente.usuarios?.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">DNI</p>
                <p className="font-medium text-neutral-900">{expediente.usuarios?.dni}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-medium text-neutral-900">{expediente.usuarios?.email}</p>
              </div>
              {expediente.usuarios?.telefono && (
                <div>
                  <p className="text-sm text-neutral-600">Teléfono</p>
                  <p className="font-medium text-neutral-900">{expediente.usuarios.telefono}</p>
                </div>
              )}
            </div>
          </div>

          {/* Detalles del Expediente */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Detalles
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Número de Expediente</p>
                <p className="font-medium text-neutral-900">{expediente.numero_expediente}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Fecha de Registro</p>
                <p className="font-medium text-neutral-900">
                  {new Date(expediente.fecha_registro).toLocaleString('es-PE')}
                </p>
              </div>
              {expediente.fecha_limite && (
                <div>
                  <p className="text-sm text-neutral-600">Fecha Límite</p>
                  <p className={`font-medium ${
                    new Date(expediente.fecha_limite) < new Date() ? 'text-red-600' : 'text-neutral-900'
                  }`}>
                    {new Date(expediente.fecha_limite).toLocaleDateString('es-PE')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-neutral-600">Área Actual</p>
                <p className="font-medium text-neutral-900">{expediente.area_actual}</p>
              </div>
              {expediente.tipos_tramite?.tiempo_maximo_dias && (
                <div>
                  <p className="text-sm text-neutral-600">Tiempo Máximo</p>
                  <p className="font-medium text-neutral-900">
                    {expediente.tipos_tramite.tiempo_maximo_dias} días hábiles
                  </p>
                </div>
              )}
              {expediente.tipos_tramite?.costo && (
                <div>
                  <p className="text-sm text-neutral-600">Costo</p>
                  <p className="font-medium text-neutral-900">
                    S/ {expediente.tipos_tramite.costo.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleExpediente;
