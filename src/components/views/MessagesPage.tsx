import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { SafetyBanner } from '../common/SafetyBanner';
import { EmptyState } from '../common/EmptyState';
import { 
  Send, 
  MessageSquare, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  ArrowLeft,
  Coffee,
  BookOpen,
  Footprints
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { 
    currentUser, 
    profiles, 
    connections, 
    messages, 
    sendMessage, 
    activeChatConnectionId, 
    setActiveChatConnectionId,
    setCurrentRoute 
  } = useAuth();

  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // Accepted connections only! (Only allow messages between connected users)
  const acceptedConnections = connections.filter(
    c => (c.sender_id === currentUser.id || c.receiver_id === currentUser.id) && c.status === 'accepted'
  );

  // Set default active connection if none selected
  useEffect(() => {
    if (!activeChatConnectionId && acceptedConnections.length > 0) {
      setActiveChatConnectionId(acceptedConnections[0].id);
    }
  }, [activeChatConnectionId, acceptedConnections, setActiveChatConnectionId]);

  // Current active connection & recipient profile
  const activeConnection = acceptedConnections.find(c => c.id === activeChatConnectionId);
  
  const recipientUserId = activeConnection 
    ? (activeConnection.sender_id === currentUser.id ? activeConnection.receiver_id : activeConnection.sender_id)
    : null;

  const recipientProfile = recipientUserId ? profiles.find(p => p.id === recipientUserId) : null;

  // Filter messages for current connection
  const activeMessages = activeConnection 
    ? messages.filter(m => m.connection_id === activeConnection.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConnection || !inputContent.trim()) return;

    sendMessage(activeConnection.id, inputContent);
    setInputContent('');
  };

  const sendSuggestedIcebreaker = (text: string) => {
    if (!activeConnection) return;
    sendMessage(activeConnection.id, text);
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (acceptedConnections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={<MessageSquare className="w-10 h-10 text-indigo-600" />}
          title="Aún no tienes conversaciones activas"
          description="Para iniciar un chat, primero conecta con personas en la sección Descubrir. Una vez aceptada la conexión, podrán hablar libremente."
          actionButton={
            <Button variant="primary" onClick={() => setCurrentRoute('/dashboard')}>
              Ir a Descubrir
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col md:flex-row h-[80vh] min-h-[550px]">
        
        {/* LEFT SIDEBAR: Conversation List */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
          activeChatConnectionId ? 'hidden md:flex' : 'flex'
        }`}>
          
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Mensajes</span>
            </h2>
            <p className="text-xs text-slate-500">
              {acceptedConnections.length} conexiones activas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {acceptedConnections.map((conn) => {
              const otherId = conn.sender_id === currentUser.id ? conn.receiver_id : conn.sender_id;
              const otherProf = profiles.find(p => p.id === otherId);
              if (!otherProf) return null;

              // Last message in this conversation
              const connMsgs = messages
                .filter(m => m.connection_id === conn.id)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              const lastMsg = connMsgs[0];

              const isActive = conn.id === activeChatConnectionId;

              return (
                <div
                  key={conn.id}
                  onClick={() => setActiveChatConnectionId(conn.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <Avatar
                    src={otherProf.avatar_url}
                    name={otherProf.name}
                    size="md"
                    isOnline={otherProf.is_online}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">
                        {otherProf.name}
                      </h4>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {formatTime(lastMsg.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {lastMsg ? lastMsg.content : 'Conexión establecida. ¡Saluda!'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT CHAT MAIN AREA */}
        {recipientProfile && activeConnection ? (
          <div className={`flex-1 flex flex-col bg-white ${
            !activeChatConnectionId ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Chat Top Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                
                {/* Back button for mobile */}
                <button
                  onClick={() => setActiveChatConnectionId(null)}
                  className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Avatar
                  src={recipientProfile.avatar_url}
                  name={recipientProfile.name}
                  size="md"
                  isOnline={recipientProfile.is_online}
                />

                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                    {recipientProfile.name}, {recipientProfile.age}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      {recipientProfile.city} ({recipientProfile.area})
                    </span>
                    {recipientProfile.is_online ? (
                      <span className="text-emerald-600 font-bold">• En línea</span>
                    ) : (
                      <span className="text-slate-400">• Desconectado</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Safety Notice Badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] px-3 py-1 rounded-full font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Lugares públicos para citarse</span>
              </div>
            </div>

            {/* Safety Banner top reminder */}
            <div className="px-4 pt-3">
              <SafetyBanner compact />
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
              
              {activeMessages.length === 0 ? (
                <div className="text-center py-8 max-w-sm mx-auto">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">¡Comiencen a conversar!</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Comparten intereses como {recipientProfile.interests.slice(0, 3).join(', ')}.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg, idx) => {
                  const isMe = msg.sender_id === currentUser.id;
                  
                  // Show date header if first or date changed
                  const showDateHeader = idx === 0 || 
                    formatDateLabel(msg.created_at) !== formatDateLabel(activeMessages[idx - 1].created_at);

                  return (
                    <React.Fragment key={msg.id}>
                      {showDateHeader && (
                        <div className="flex items-center justify-center my-2">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-0.5 rounded-full uppercase tracking-wider">
                            {formatDateLabel(msg.created_at)}
                          </span>
                        </div>
                      )}

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm shadow-2xs leading-relaxed ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-xs' 
                            : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-bl-xs'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Icebreakers */}
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="font-bold text-slate-400 shrink-0">Rompehielos:</span>
              
              <button
                type="button"
                onClick={() => sendSuggestedIcebreaker('¡Hola! ¿Te apetece tomar un café esta semana para conocernos? ☕')}
                className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 px-3 py-1 rounded-full font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>Tomar un café ☕</span>
              </button>

              <button
                type="button"
                onClick={() => sendSuggestedIcebreaker('¡Hola! ¿Has leído algún buen libro últimamente que me recomiendes? 📚')}
                className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 px-3 py-1 rounded-full font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recomendar libro 📚</span>
              </button>

              <button
                type="button"
                onClick={() => sendSuggestedIcebreaker('¡Hola! ¿Te gustaría salir a dar una caminata tranquila por el parque? 🚶‍♂️')}
                className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 px-3 py-1 rounded-full font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                <span>Caminata por el parque 🚶‍♀️</span>
              </button>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Escribe un mensaje amigable a ${recipientProfile.name}...`}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="flex-1 bg-slate-100/80 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white border border-transparent transition-all"
              />

              <Button
                type="submit"
                variant="gradient"
                size="md"
                className="rounded-2xl shrink-0 py-3"
                disabled={!inputContent.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            Selecciona una conversación a la izquierda para chatear.
          </div>
        )}

      </div>

    </div>
  );
};
