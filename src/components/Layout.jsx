import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, FileText, Search, Bell, Settings, LogOut, 
  Menu, X, User, Shield, Users, BarChart 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getNavItems = () => {
    const items = [
      { path: '/dashboard', icon: Home, label: 'Inicio', roles: ['all'] },
      { path: '/tramites', icon: FileText, label: 'Mis Trámites', roles: ['ciudadano'] },
      { path: '/nuevo-tramite', icon: FileText, label: 'Nuevo Trámite', roles: ['ciudadano'] },
      { path: '/seguimiento', icon: Search, label: 'Seguimiento', roles: ['all'] },
    ];

    // Items para personal municipal
    if (['mesa_partes', 'area_tramite', 'alcalde'].includes(userData?.rol)) {
      items.push(
        { path: '/expedientes', icon: FileText, label: 'Expedientes', roles: ['mesa_partes', 'area_tramite', 'alcalde'] },
        { path: '/derivaciones', icon: BarChart, label: 'Derivaciones', roles: ['mesa_partes', 'area_tramite'] }
      );
    }

    // Items solo para TI
    if (userData?.rol === 'ti') {
      items.push(
        { path: '/usuarios', icon: Users, label: 'Usuarios', roles: ['ti'] },
        { path: '/configuracion', icon: Settings, label: 'Configuración', roles: ['ti'] }
      );
    }

    return items.filter(item => 
      item.roles.includes('all') || 
      item.roles.includes(userData?.rol)
    );
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <Link to="/dashboard" className="flex items-center gap-3">
                <img 
                  src="/logo-mochumi.png" 
                  alt="Escudo de Mochumi" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-lg font-bold text-primary-700">Mesa de Partes Digital</h1>
                  <p className="text-xs text-neutral-600 hidden sm:block">Municipalidad de Mochumi</p>
                </div>
              </Link>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <Link 
                to="/notificaciones" 
                className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Bell className="h-6 w-6 text-neutral-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </Link>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-100">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {userData?.nombres?.charAt(0)}{userData?.apellidos?.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-900">
                    {userData?.nombres} {userData?.apellidos}
                  </p>
                  <p className="text-xs text-neutral-600 capitalize">
                    {userData?.rol?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-danger-50 text-danger-600 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info en sidebar (móvil) */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {userData?.nombres?.charAt(0)}{userData?.apellidos?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {userData?.nombres} {userData?.apellidos}
                </p>
                <p className="text-xs text-neutral-600 capitalize">
                  {userData?.rol?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
