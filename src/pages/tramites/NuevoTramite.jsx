import React, { useState, useEffect } from 'react';
import { FileText, Upload, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const NuevoTramite = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [tiposTramite, setTiposTramite] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState(1); // 1: selección tipo, 2: formulario

  useEffect(() => {
    cargarTiposTramite();
  }, []);

  // Validar que userData esté cargado
  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    // Si viene desde el dashboard con un tipo preseleccionado
    if (location.state?.tipoTramiteId) {
      const tipo = tiposTramite.find(t => t.id === location.state.tipoTramiteId);
      if (tipo) {
        setTipoSeleccionado(tipo);
        setPaso(2);
      }
    }
  }, [location.state, tiposTramite]);

  const cargarTiposTramite = async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_tramite')
        .select('*')
        .eq('estado', 'activo')
        .order('es_comun', { ascending: false })
        .order('nombre');

      if (error) throw error;
      setTiposTramite(data || []);
    } catch (error) {
      console.error('Error cargando tipos de trámite:', error);
      toast.error('Error al cargar los tipos de trámite');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setPaso(2);
  };

  const handleArchivoChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    const archivosValidos = nuevosArchivos.filter(archivo => {
      const esValido = archivo.size <= 10 * 1024 * 1024; // 10MB max
      if (!esValido) {
        toast.error(`${archivo.name} excede el tamaño máximo de 10MB`);
      }
      return esValido;
    });
    setArchivos([...archivos, ...archivosValidos]);
  };

  const eliminarArchivo = (index) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  const subirArchivos = async (expedienteId) => {
    const archivosSubidos = [];
    
    for (const archivo of archivos) {
      try {
        const nombreArchivo = `${expedienteId}/${Date.now()}_${archivo.name}`;
        
        // Subir archivo a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documentos')
          .upload(nombreArchivo, archivo);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('documentos')
          .getPublicUrl(nombreArchivo);

        // Registrar en la base de datos
        const { data: docData, error: docError } = await supabase
          .from('documentos')
          .insert({
            expediente_id: expedienteId,
            nombre_archivo: archivo.name,
            ruta_archivo: nombreArchivo,
            url_archivo: publicUrl,
            tipo_documento: archivo.type,
            tamanio: archivo.size
          })
          .select()
          .single();

        if (docError) throw docError;
        archivosSubidos.push(docData);
      } catch (error) {
        console.error('Error subiendo archivo:', archivo.name, error);
        toast.error(`Error al subir ${archivo.name}`);
      }
    }

    return archivosSubidos;
  };

  const crearTramite = async (e) => {
    e.preventDefault();
    
    // Validaciones iniciales
    if (!userData?.id) {
      toast.error('Error: Usuario no identificado');
      return;
    }
    
    if (!tipoSeleccionado?.id) {
      toast.error('Error: Tipo de trámite no seleccionado');
      return;
    }
    
    if (archivos.length === 0) {
      toast.error('Debe adjuntar al menos un documento');
      return;
    }

    setCargando(true);

    try {
      console.log('Creando expediente...');
      
      // Crear expediente con asunto y descripción automáticos basados en el tipo de trámite
      const asunto = `Solicitud de ${tipoSeleccionado.nombre}`;
      const descripcion = tipoSeleccionado.descripcion || `Trámite de ${tipoSeleccionado.nombre} solicitado por el ciudadano`;
      
      // Crear expediente
      const { data: expediente, error: expedienteError } = await supabase
        .from('expedientes')
        .insert({
          ciudadano_id: userData.id,
          tipo_tramite_id: tipoSeleccionado.id,
          asunto: asunto,
          descripcion: descripcion,
          estado: 'registrado',
          area_actual: 'Mesa de Partes',
          fecha_registro: new Date().toISOString(),
          fecha_limite: calcularFechaLimite(tipoSeleccionado.tiempo_maximo_dias)
        })
        .select()
        .single();

      if (expedienteError) {
        console.error('Error al crear expediente:', expedienteError);
        throw new Error(`Error al crear expediente: ${expedienteError.message}`);
      }

      if (!expediente) {
        throw new Error('No se pudo crear el expediente');
      }

      console.log('Expediente creado:', expediente.id);
      console.log('Subiendo archivos...');

      // Subir archivos
      const archivosSubidos = await subirArchivos(expediente.id);
      console.log('Archivos subidos:', archivosSubidos.length);

      // Registrar en historial
      const { error: historialError } = await supabase
        .from('historial_estados')
        .insert({
          expediente_id: expediente.id,
          estado_anterior: null,
          estado_nuevo: 'registrado',
          observacion: 'Expediente creado por el ciudadano',
          usuario_id: userData.id
        });

      if (historialError) {
        console.error('Error al crear historial:', historialError);
      }

      // Crear notificación para Mesa de Partes
      const { data: usuariosMesa, error: mesaError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('rol', 'mesa_partes')
        .eq('estado', 'activo')
        .limit(1);

      if (mesaError) {
        console.error('Error al buscar usuarios de mesa:', mesaError);
      }

      if (usuariosMesa && usuariosMesa.length > 0) {
        const { error: notifError } = await supabase
          .from('notificaciones')
          .insert({
            usuario_id: usuariosMesa[0].id,
            expediente_id: expediente.id,
            tipo: 'nuevo_tramite',
            titulo: 'Nuevo trámite registrado',
            mensaje: `Nuevo expediente ${expediente.numero_expediente} de ${userData.nombres} ${userData.apellidos}`,
            leida: false
          });

        if (notifError) {
          console.error('Error al crear notificación:', notifError);
        }
      }

      toast.success('Trámite creado exitosamente');
      
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error creando trámite:', error);
      toast.error(error.message || 'Error al crear el trámite');
      setCargando(false); // Asegurar que se desactive el loading en caso de error
    }
  };

  const calcularFechaLimite = (dias) => {
    if (!dias) return null;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Verificar que userData esté cargado
  if (!userData || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">
            {!userData ? 'Cargando información del usuario...' : 'Cargando tipos de trámite...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => paso === 1 ? navigate('/dashboard') : setPaso(1)}
          className="btn btn-outline"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Nuevo Trámite
          </h1>
          <p className="text-neutral-600 mt-1">
            {paso === 1 ? 'Seleccione el tipo de trámite' : `Completar formulario - ${tipoSeleccionado?.nombre}`}
          </p>
        </div>
      </div>

      {/* Paso 1: Selección de Tipo de Trámite */}
      {paso === 1 && (
        <>
          {/* Trámites Comunes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Trámites Más Comunes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposTramite.filter(t => t.es_comun).map((tipo) => (
                <div
                  key={tipo.id}
                  onClick={() => seleccionarTipo(tipo)}
                  className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">{tipo.nombre}</h4>
                    <span className="badge bg-primary-100 text-primary-800">
                      {tipo.tiempo_maximo_dias} días
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {tipo.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600">
                      S/ {tipo.costo?.toFixed(2)}
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Todos los Trámites */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Todos los Trámites Disponibles
            </h3>
            <div className="space-y-2">
              {tiposTramite.filter(t => !t.es_comun).map((tipo) => (
                <div
                  key={tipo.id}
                  onClick={() => seleccionarTipo(tipo)}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 mb-1">{tipo.nombre}</h4>
                    <p className="text-sm text-neutral-600 line-clamp-1">{tipo.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="text-sm text-neutral-600">{tipo.tiempo_maximo_dias} días</p>
                      <p className="text-sm font-medium text-primary-600">S/ {tipo.costo?.toFixed(2)}</p>
                    </div>
                    <FileText className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Paso 2: Formulario de Trámite */}
      {paso === 2 && tipoSeleccionado && (
        <form onSubmit={crearTramite} className="space-y-6">
          {/* Información del Trámite Seleccionado */}
          <div className="card bg-primary-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {tipoSeleccionado.nombre}
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {tipoSeleccionado.descripcion}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1 text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Tiempo: {tipoSeleccionado.tiempo_maximo_dias} días hábiles
                  </span>
                  <span className="flex items-center gap-1 text-neutral-700">
                    <FileText className="w-4 h-4 text-primary-600" />
                    Costo: S/ {tipoSeleccionado.costo?.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPaso(1);
                  setTipoSeleccionado(null);
                }}
                className="btn btn-outline btn-sm"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Requisitos del Trámite */}
          <div className="card border-2 border-blue-500 bg-blue-50">
            <h3 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Requisitos del Trámite
            </h3>
            <div className="bg-white border border-blue-200 rounded-lg p-5">
              {tipoSeleccionado.requisitos && typeof tipoSeleccionado.requisitos === 'string' && (
                <>
                  <p className="text-sm text-neutral-700 mb-4 font-semibold">
                    Para completar este trámite, debe cumplir con los siguientes requisitos:
                  </p>
                  <ul className="space-y-3">
                    {tipoSeleccionado.requisitos.split('\n').filter(r => r.trim()).map((requisito, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-800 font-medium">{requisito.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {(!tipoSeleccionado.requisitos || typeof tipoSeleccionado.requisitos !== 'string') && (
                <p className="text-sm text-neutral-600 italic">No se especificaron requisitos para este trámite.</p>
              )}
            </div>
          </div>

          {/* Datos del Solicitante */
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Datos del Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-neutral-600">Nombres y Apellidos</p>
                <p className="font-medium text-neutral-900">
                  {userData.nombres} {userData.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">DNI</p>
                <p className="font-medium text-neutral-900">{userData.dni}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-medium text-neutral-900">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Teléfono</p>
                <p className="font-medium text-neutral-900">{userData.telefono || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* Documentos Necesarios */}
          <div className="card bg-amber-50 border-amber-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Documentos Necesarios *
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Adjunte los documentos solicitados en los requisitos. Todos los archivos deben estar en formato digital.
            </p>
            
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors bg-white">
              <Upload className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-neutral-700 mb-2 font-medium">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                PDF, Word, Excel, imágenes (máx. 10MB por archivo)
              </p>
              <input
                type="file"
                multiple
                onChange={handleArchivoChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                Seleccionar Archivos
              </label>
            </div>

            {archivos.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-neutral-700">
                  Archivos seleccionados ({archivos.length}):
                </p>
                {archivos.map((archivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {archivo.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatBytes(archivo.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarArchivo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Términos y Condiciones */}
          <div className="card bg-neutral-50">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                id="terminos"
                className="mt-1"
              />
              <label htmlFor="terminos" className="text-sm text-neutral-700">
                Declaro que la información proporcionada es veraz y completa. Entiendo que cualquier
                información falsa o incompleta puede resultar en el rechazo de mi solicitud. He leído
                y acepto los términos y condiciones del servicio.
              </label>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline flex-1"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={cargando || archivos.length === 0}
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando Trámite...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Crear Trámite
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NuevoTramite;
