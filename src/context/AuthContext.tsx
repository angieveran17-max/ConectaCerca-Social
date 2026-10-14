import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Profile, 
  Connection, 
  Message, 
  Block, 
  Report, 
  RoutePath, 
  ToastMessage,
  ConnectionStatus 
} from '../types';
import { MOCK_CURRENT_USER, MOCK_PROFILES, MOCK_CONNECTIONS, MOCK_MESSAGES } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: Profile | null;
  isAuthenticated: boolean;
  currentRoute: RoutePath;
  setCurrentRoute: (route: RoutePath) => void;
  selectedUserProfile: Profile | null;
  setSelectedUserProfile: (profile: Profile | null) => void;
  activeChatConnectionId: string | null;
  setActiveChatConnectionId: (id: string | null) => void;
  profiles: Profile[];
  connections: Connection[];
  messages: Message[];
  blocks: Block[];
  reports: Report[];
  toasts: ToastMessage[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  quickDemoLogin: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<Profile>) => void;
  sendConnectionRequest: (targetUserId: string) => void;
  respondConnectionRequest: (connectionId: string, status: ConnectionStatus) => void;
  sendMessage: (connectionId: string, content: string) => void;
  blockUser: (targetUserId: string) => void;
  unblockUser: (targetUserId: string) => void;
  reportUser: (targetUserId: string, reason: string, description: string) => void;
  deleteAccount: () => void;
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  removeToast: (id: string) => void;
  viewUserProfile: (profile: Profile) => void;
  openChatWithUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'conectacerca_user';
const STORAGE_KEY_PROFILES = 'conectacerca_profiles';
const STORAGE_KEY_CONNECTIONS = 'conectacerca_connections';
const STORAGE_KEY_MESSAGES = 'conectacerca_messages';
const STORAGE_KEY_BLOCKS = 'conectacerca_blocks';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : MOCK_CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(STORAGE_KEY_USER) || true); // default demo logged-in for fast access
  });

  const [currentRoute, setCurrentRoute] = useState<RoutePath>('/');
  const [selectedUserProfile, setSelectedUserProfile] = useState<Profile | null>(null);
  const [activeChatConnectionId, setActiveChatConnectionId] = useState<string | null>(null);

  const [profiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
    return saved ? JSON.parse(saved) : MOCK_PROFILES;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
    return saved ? JSON.parse(saved) : MOCK_CONNECTIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return saved ? JSON.parse(saved) : MOCK_MESSAGES;
  });

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BLOCKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage for realistic persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks));
  }, [blocks]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;
      }
      // Demo authentication simulation
      setIsAuthenticated(true);
      setCurrentUser(MOCK_CURRENT_USER);
      setCurrentRoute('/dashboard');
      addToast('success', `¡Bienvenido de nuevo, ${MOCK_CURRENT_USER.name}!`);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      addToast('error', err?.message || 'Error al iniciar sesión. Comprueba tus datos.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
      }

      const newUser: Profile = {
        id: 'user_' + Date.now(),
        user_id: 'auth_' + Date.now(),
        name: name,
        age: 25,
        bio: '¡Hola! Soy nuevo en ConectaCerca. Me gustaría conocer gente cercana para compartir momentos agradables.',
        city: 'Valencia',
        area: 'Zona Centro',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        interests: ['Tomar café', 'Leer libros', 'Caminar'],
        favorite_activities: ['Cafés de especialidad', 'Paseos por la ciudad'],
        availability: ['Fines de semana', 'Tardes'],
        max_distance_km: 10,
        is_online: true
      };

      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setCurrentRoute('/onboarding');
      addToast('success', '¡Cuenta creada con éxito! Por favor completa tu perfil.');
      setIsLoading(false);
      return true;
    } catch (err: any) {
      addToast('error', err?.message || 'Error al registrar la cuenta.');
      setIsLoading(false);
      return false;
    }
  };

  const quickDemoLogin = () => {
    setCurrentUser(MOCK_CURRENT_USER);
    setIsAuthenticated(true);
    setCurrentRoute('/dashboard');
    addToast('info', 'Has iniciado sesión con el Perfil de Prueba.');
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRoute('/');
    addToast('info', 'Has cerrado sesión correctamente.');
  };

  const updateProfile = (updated: Partial<Profile>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated, updated_at: new Date().toISOString() };
    setCurrentUser(newProfile);
    addToast('success', 'Tu perfil ha sido actualizado correctamente.');
  };

  const sendConnectionRequest = (targetUserId: string) => {
    if (!currentUser) return;

    // Check if already requested
    const existing = connections.find(
      c => (c.sender_id === currentUser.id && c.receiver_id === targetUserId) ||
           (c.receiver_id === currentUser.id && c.sender_id === targetUserId)
    );

    if (existing) {
      if (existing.status === 'accepted') {
        addToast('info', 'Ya estás conectado con este usuario.');
      } else {
        addToast('info', 'Ya existe una solicitud pendiente con este usuario.');
      }
      return;
    }

    const newConnection: Connection = {
      id: 'conn_' + Date.now(),
      sender_id: currentUser.id,
      receiver_id: targetUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setConnections(prev => [...prev, newConnection]);
    addToast('success', '¡Solicitud de conexión enviada!');
  };

  const respondConnectionRequest = (connectionId: string, status: ConnectionStatus) => {
    setConnections(prev => prev.map(c => {
      if (c.id === connectionId) {
        return { ...c, status, updated_at: new Date().toISOString() };
      }
      return c;
    }));

    if (status === 'accepted') {
      addToast('success', '¡Conexión aceptada! Ahora pueden conversar.');
      // Create automatic welcome message
      const conn = connections.find(c => c.id === connectionId);
      if (conn) {
        const otherUserId = conn.sender_id === currentUser?.id ? conn.receiver_id : conn.sender_id;
        const autoMsg: Message = {
          id: 'msg_' + Date.now(),
          connection_id: connectionId,
          sender_id: otherUserId,
          content: '¡Hola! Qué bien que hayamos conectado en ConectaCerca. ¿Te apetece planear una salida o tomar un café pronto?',
          created_at: new Date().toISOString(),
          read_at: null
        };
        setMessages(prev => [...prev, autoMsg]);
      }
    } else {
      addToast('info', 'Solicitud rechazada.');
    }
  };

  const sendMessage = (connectionId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      connection_id: connectionId,
      sender_id: currentUser.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      read_at: null
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulate auto response from mock friend after 3 seconds if demoing
    const conn = connections.find(c => c.id === connectionId);
    if (conn && conn.status === 'accepted') {
      const otherUserId = conn.sender_id === currentUser.id ? conn.receiver_id : conn.sender_id;
      const otherProfile = profiles.find(p => p.id === otherUserId);
      if (otherProfile && otherUserId !== 'user_me') {
        setTimeout(() => {
          const autoReplies = [
            `¡Me parece una excelente idea! ¿Qué día te vendría bien?`,
            `¡Totalmente de acuerdo! También me encanta compartir esos momentos.`,
            `¡Excelente! Conozco un lugar muy lindo cerca de la zona para encontrarnos.`
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: Message = {
            id: 'msg_' + (Date.now() + 1),
            connection_id: connectionId,
            sender_id: otherUserId,
            content: randomReply,
            created_at: new Date().toISOString(),
            read_at: null
          };
          setMessages(m => [...m, replyMsg]);
        }, 2000);
      }
    }
  };

  const blockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const newBlock: Block = {
      id: 'block_' + Date.now(),
      blocker_id: currentUser.id,
      blocked_id: targetUserId,
      created_at: new Date().toISOString()
    };
    setBlocks(prev => [...prev, newBlock]);
    // Also remove connection if existed
    setConnections(prev => prev.filter(c => 
      !(c.sender_id === currentUser.id && c.receiver_id === targetUserId) &&
      !(c.receiver_id === currentUser.id && c.sender_id === targetUserId)
    ));
    addToast('info', 'Usuario bloqueado correctamente. No volverá a aparecer en tu lista.');
  };

  const unblockUser = (targetUserId: string) => {
    if (!currentUser) return;
    setBlocks(prev => prev.filter(b => !(b.blocker_id === currentUser.id && b.blocked_id === targetUserId)));
    addToast('success', 'Usuario desbloqueado.');
  };

  const reportUser = (targetUserId: string, reason: string, description: string) => {
    if (!currentUser) return;
    const newReport: Report = {
      id: 'report_' + Date.now(),
      reporter_id: currentUser.id,
      reported_user_id: targetUserId,
      reason,
      description,
      created_at: new Date().toISOString()
    };
    setReports(prev => [...prev, newReport]);
    addToast('success', 'Reporte enviado. Nuestro equipo revisará la actividad.');
  };

  const deleteAccount = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.clear();
    setCurrentRoute('/');
    addToast('info', 'Tu cuenta y datos han sido eliminados.');
  };

  const viewUserProfile = (profile: Profile) => {
    setSelectedUserProfile(profile);
    setCurrentRoute('/profile');
  };

  const openChatWithUser = (targetUserId: string) => {
    if (!currentUser) return;
    // Find connection
    const conn = connections.find(c => 
      c.status === 'accepted' && 
      ((c.sender_id === currentUser.id && c.receiver_id === targetUserId) ||
       (c.receiver_id === currentUser.id && c.sender_id === targetUserId))
    );

    if (conn) {
      setActiveChatConnectionId(conn.id);
      setCurrentRoute('/messages');
    } else {
      addToast('error', 'Debes tener una conexión aceptada para enviar mensajes.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        currentRoute,
        setCurrentRoute,
        selectedUserProfile,
        setSelectedUserProfile,
        activeChatConnectionId,
        setActiveChatConnectionId,
        profiles,
        connections,
        messages,
        blocks,
        reports,
        toasts,
        isLoading,
        login,
        register,
        quickDemoLogin,
        logout,
        updateProfile,
        sendConnectionRequest,
        respondConnectionRequest,
        sendMessage,
        blockUser,
        unblockUser,
        reportUser,
        deleteAccount,
        addToast,
        removeToast,
        viewUserProfile,
        openChatWithUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
