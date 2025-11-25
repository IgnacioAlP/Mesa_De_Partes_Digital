import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

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

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
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
  );
}

export default App;
