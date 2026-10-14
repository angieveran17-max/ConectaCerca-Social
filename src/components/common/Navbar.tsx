import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './Avatar';
import { 
  Users, 
  MessageSquare, 
  Compass, 
  LogOut, 
  Settings, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { RoutePath } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    currentRoute, 
    setCurrentRoute, 
    logout, 
    connections, 
    messages 
  } = useAuth();

  // Pending connections count
  const pendingRequestsCount = connections.filter(
    c => c.receiver_id === currentUser?.id && c.status === 'pending'
  ).length;

  // Unread messages count
  const unreadMessagesCount = messages.filter(
    m => m.sender_id !== currentUser?.id && !m.read_at
  ).length;

  const handleNav = (path: RoutePath) => {
    setCurrentRoute(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-600 bg-clip-text text-transparent">
                ConectaCerca
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block -mt-1 hidden sm:block">
              Amistades & actividades cercanas
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => handleNav('/dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === '/dashboard' || currentRoute === '/discover'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Descubrir</span>
            </button>

            <button
              onClick={() => handleNav('/connections')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === '/connections'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Conexiones</span>
              {pendingRequestsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('/messages')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === '/messages'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mensajes</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </nav>
        ) : null}

        {/* User profile / Auth buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/profile')}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer"
              >
                <Avatar
                  src={currentUser.avatar_url}
                  name={currentUser.name}
                  size="sm"
                  isOnline={currentUser.is_online}
                />
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {currentUser.city}
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleNav('/settings')}
                className={`p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
                  currentRoute === '/settings' ? 'text-indigo-600 bg-indigo-50' : ''
                }`}
                title="Ajustes y privacidad"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
              >
                Crear mi perfil
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
