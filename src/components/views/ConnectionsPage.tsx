import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { EmptyState } from '../common/EmptyState';
import { UserProfileDetailModal } from './UserProfileDetailModal';
import { calculateCompatibility } from '../../utils/compatibility';
import { Profile } from '../../types';
import { 
  Users, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  UserX, 
  Sparkles, 
  Eye 
} from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  const { 
    currentUser, 
    profiles, 
    connections, 
    respondConnectionRequest, 
    openChatWithUser, 
    setCurrentRoute 
  } = useAuth();

  const [tab, setTab] = useState<'received' | 'sent' | 'accepted'>('received');
  const [selectedUserForModal, setSelectedUserForModal] = useState<Profile | null>(null);

  if (!currentUser) return null;

  // Received requests
  const receivedConnections = connections.filter(
    c => c.receiver_id === currentUser.id && c.status === 'pending'
  );

  // Sent requests
  const sentConnections = connections.filter(
    c => c.sender_id === currentUser.id && c.status === 'pending'
  );

  // Accepted connections
  const acceptedConnections = connections.filter(
    c => (c.sender_id === currentUser.id || c.receiver_id === currentUser.id) && c.status === 'accepted'
  );

  const getOtherProfile = (senderId: string, receiverId: string) => {
    const otherId = senderId === currentUser.id ? receiverId : senderId;
    return profiles.find(p => p.id === otherId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-600" />
          <span>Mis Conexiones</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Gestiona tus solicitudes de amistad e inicia conversaciones con las personas conectadas.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
            tab === 'received'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Recibidas</span>
          {receivedConnections.length > 0 && (
            <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {receivedConnections.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('accepted')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
            tab === 'accepted'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Conexiones Aceptadas</span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {acceptedConnections.length}
          </span>
        </button>

        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
            tab === 'sent'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Enviadas</span>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {sentConnections.length}
          </span>
        </button>
      </div>

      {/* TAB 1: RECEIVED REQUESTS */}
      {tab === 'received' && (
        <div className="space-y-4">
          {receivedConnections.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-indigo-500" />}
              title="No tienes solicitudes pendientes"
              description="Navega por la sección Descubrir para conectar con personas cerca de ti que compartan tus pasiones."
              actionButton={
                <Button variant="primary" onClick={() => setCurrentRoute('/dashboard')}>
                  Explorar personas cercanas
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedConnections.map((conn) => {
                const targetProfile = getOtherProfile(conn.sender_id, conn.receiver_id);
                if (!targetProfile) return null;

                const comp = calculateCompatibility(currentUser, targetProfile);

                return (
                  <Card key={conn.id} className="p-5 flex flex-col justify-between border-slate-200">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={targetProfile.avatar_url} name={targetProfile.name} size="md" />
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm">
                              {targetProfile.name}, {targetProfile.age}
                            </h3>
                            <p className="text-xs text-slate-500">{targetProfile.city} • {comp.approxDistanceStr}</p>
                          </div>
                        </div>

                        <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {comp.overallScore}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl mb-3 line-clamp-2">
                        "{targetProfile.bio}"
                      </p>

                      {comp.sharedInterests.length > 0 && (
                        <p className="text-xs text-indigo-700 font-semibold mb-3">
                          Comparten: {comp.sharedInterests.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => respondConnectionRequest(conn.id, 'accepted')}
                        leftIcon={<UserCheck className="w-4 h-4" />}
                      >
                        Aceptar
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-rose-600"
                        onClick={() => respondConnectionRequest(conn.id, 'rejected')}
                        leftIcon={<UserX className="w-4 h-4" />}
                      >
                        Rechazar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUserForModal(targetProfile)}
                        title="Ver perfil completo"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACCEPTED CONNECTIONS */}
      {tab === 'accepted' && (
        <div className="space-y-4">
          {acceptedConnections.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-emerald-500" />}
              title="Aún no tienes conexiones aceptadas"
              description="Cuando tú o la otra persona acepten la solicitud, aparecerán aquí para iniciar conversaciones y organizar salidas."
              actionButton={
                <Button variant="primary" onClick={() => setCurrentRoute('/dashboard')}>
                  Buscar nuevos amigos
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedConnections.map((conn) => {
                const targetProfile = getOtherProfile(conn.sender_id, conn.receiver_id);
                if (!targetProfile) return null;

                const comp = calculateCompatibility(currentUser, targetProfile);

                return (
                  <Card key={conn.id} className="p-5 flex flex-col justify-between border-slate-200">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={targetProfile.avatar_url} name={targetProfile.name} size="md" isOnline={targetProfile.is_online} />
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm">
                              {targetProfile.name}, {targetProfile.age}
                            </h3>
                            <p className="text-xs text-slate-500">{targetProfile.city} • {comp.approxDistanceStr}</p>
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                          Conectados ✓
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2.5 rounded-xl">
                        "{targetProfile.bio}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Button
                        variant="gradient"
                        size="sm"
                        className="flex-1"
                        onClick={() => openChatWithUser(targetProfile.id)}
                        leftIcon={<MessageSquare className="w-4 h-4" />}
                      >
                        Enviar mensaje
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUserForModal(targetProfile)}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Perfil
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENT REQUESTS */}
      {tab === 'sent' && (
        <div className="space-y-4">
          {sentConnections.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-8 h-8 text-amber-500" />}
              title="No hay solicitudes enviadas pendientes"
              description="Las solicitudes que envíes a otras personas aparecerán aquí."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentConnections.map((conn) => {
                const targetProfile = getOtherProfile(conn.sender_id, conn.receiver_id);
                if (!targetProfile) return null;

                return (
                  <Card key={conn.id} className="p-5 flex items-center justify-between border-slate-200">
                    <div className="flex items-center gap-3">
                      <Avatar src={targetProfile.avatar_url} name={targetProfile.name} size="md" />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {targetProfile.name}, {targetProfile.age}
                        </h3>
                        <p className="text-xs text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pendiente de respuesta</span>
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUserForModal(targetProfile)}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      Ver perfil
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedUserForModal && (
        <UserProfileDetailModal
          user={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
        />
      )}

    </div>
  );
};
