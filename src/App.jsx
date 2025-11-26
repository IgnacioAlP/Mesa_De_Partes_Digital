import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import { supabase } from './lib/supabase';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/public/Home';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import DashboardCiudadano from './pages/dashboard/DashboardCiudadano';
import DashboardMesaPartes from './pages/dashboard/DashboardMesaPartes';
import DashboardAreaTramite from './pages/dashboard/DashboardAreaTramite';
import DashboardAlcalde from './pages/dashboard/DashboardAlcalde';
import DashboardTI from './pages/dashboard/DashboardTI';

// Tramites
import NuevoTramite from './pages/tramites/NuevoTramite';
import DetalleExpediente from './pages/tramites/DetalleExpediente';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const [configError, setConfigError] = useState(false);

  // Suprimir errores de extensiones del navegador
  useEffect(() => {
    // Ignorar errores de extensiones de Chrome
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Could not establish connection') ||
         args[0].includes('Extension context invalidated') ||
         args[0].includes('chrome-extension://'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setConfigError(true);
      return;
    }
    initialize();
  }, [initialize]);

  if (configError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
            ⚠️ Error de Configuración
          </h1>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            Las variables de entorno de Supabase no están configuradas.
          </p>
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <strong>Para el administrador:</strong>
            <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Ve a tu proyecto en Vercel</li>
              <li>Settings → Environment Variables</li>
              <li>Agrega estas variables:
                <ul style={{ marginTop: '5px' }}>
                  <li><code>VITE_SUPABASE_URL</code></li>
                  <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                </ul>
              </li>
              <li>Redeploy el proyecto</li>
            </ol>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Abre la consola del navegador (F12) para ver más detalles del error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#F44336',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/ciudadano" 
          element={
            <ProtectedRoute allowedRoles={['ciudadano']}>
              <Layout>
                <DashboardCiudadano />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/mesa-partes" 
          element={
            <ProtectedRoute allowedRoles={['mesa_partes']}>
              <Layout>
                <DashboardMesaPartes />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/area-tramite" 
          element={
            <ProtectedRoute allowedRoles={['area_tramite']}>
              <Layout>
                <DashboardAreaTramite />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/alcalde" 
          element={
            <ProtectedRoute allowedRoles={['alcalde']}>
              <Layout>
                <DashboardAlcalde />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/ti" 
          element={
            <ProtectedRoute allowedRoles={['ti']}>
              <Layout>
                <DashboardTI />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/nuevo-tramite" 
          element={
            <ProtectedRoute allowedRoles={['ciudadano']}>
              <Layout>
                <NuevoTramite />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard/expediente/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <DetalleExpediente />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
