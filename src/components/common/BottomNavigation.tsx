import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, Users, MessageSquare, User } from 'lucide-react';
import { RoutePath } from '../../types';

export const BottomNavigation: React.FC = () => {
  const { 
    isAuthenticated, 
    currentRoute, 
    setCurrentRoute, 
    connections, 
    messages, 
    currentUser 
  } = useAuth();

  if (!isAuthenticated) return null;

  const pendingRequestsCount = connections.filter(
    c => c.receiver_id === currentUser?.id && c.status === 'pending'
  ).length;

  const unreadMessagesCount = messages.filter(
    m => m.sender_id !== currentUser?.id && !m.read_at
  ).length;

  const navItems: { label: string; path: RoutePath; icon: React.ReactNode; badge?: number }[] = [
    {
      label: 'Descubrir',
      path: '/dashboard',
      icon: <Compass className="w-5 h-5" />
    },
    {
      label: 'Conexiones',
      path: '/connections',
      icon: <Users className="w-5 h-5" />,
      badge: pendingRequestsCount
    },
    {
      label: 'Mensajes',
      path: '/messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadMessagesCount
    },
    {
      label: 'Mi perfil',
      path: '/profile',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = 
            currentRoute === item.path || 
            (item.path === '/dashboard' && currentRoute === '/discover');

          return (
            <button
              key={item.path}
              onClick={() => setCurrentRoute(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-indigo-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
