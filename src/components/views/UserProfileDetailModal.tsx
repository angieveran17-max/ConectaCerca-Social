import React, { useState } from 'react';
import { Profile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { calculateCompatibility } from '../../utils/compatibility';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { SafetyBanner } from '../common/SafetyBanner';
import { ReportModal } from '../common/ReportModal';
import { 
  X, 
  MapPin, 
  UserCheck, 
  UserPlus, 
  MessageSquare, 
  ShieldAlert, 
  Ban, 
  Clock, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface UserProfileDetailProps {
  user: Profile;
  onClose: () => void;
}

export const UserProfileDetailModal: React.FC<UserProfileDetailProps> = ({ user, onClose }) => {
  const { 
    currentUser, 
    connections, 
    sendConnectionRequest, 
    openChatWithUser, 
    blockUser 
  } = useAuth();

  const [showReportModal, setShowReportModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!currentUser) return null;

  // Calculate compatibility with current user
  const compatibility = calculateCompatibility(currentUser, user);

  // Check connection status
  const connection = connections.find(
    c => (c.sender_id === currentUser.id && c.receiver_id === user.id) ||
         (c.receiver_id === currentUser.id && c.sender_id === user.id)
  );

  const isConnected = connection?.status === 'accepted';
  const isPendingSent = connection?.status === 'pending' && connection.sender_id === currentUser.id;
  const isPendingReceived = connection?.status === 'pending' && connection.receiver_id === currentUser.id;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-full transition-colors z-10 backdrop-blur-xs"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Header Content */}
          <div className="px-6 pb-6 pt-0 relative flex-1 overflow-y-auto">
            
            {/* Avatar & Compatibility Badge */}
            <div className="flex flex-wrap items-end justify-between -mt-14 mb-4 gap-4">
              <Avatar
                src={user.avatar_url}
                name={user.name}
                size="xl"
                isOnline={user.is_online}
                className="ring-4 ring-white shadow-lg"
              />

              {/* Compatibility score pill */}
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-md text-sm font-black hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{compatibility.overallScore}% de Compatibilidad</span>
                  <Info className="w-4 h-4 text-white/80" />
                </button>
                <span className="text-[11px] text-slate-500 font-medium">
                  {compatibility.sharedInterests.length} intereses en común
                </span>
              </div>
            </div>

            {/* Compatibility Breakdown Box */}
            {showBreakdown && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 mb-5 space-y-3 animate-in fade-in duration-200 text-xs sm:text-sm">
                <h4 className="font-bold text-indigo-900 flex items-center justify-between">
                  <span>¿Cómo calculamos la compatibilidad con {user.name}?</span>
                  <button onClick={() => setShowBreakdown(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Intereses compartidos (60% del peso)</span>
                      <span className="text-indigo-600">{compatibility.interestsScore}/60 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(compatibility.interestsScore / 60) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Actividades similares (20% del peso)</span>
                      <span className="text-purple-600">{compatibility.activitiesScore}/20 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(compatibility.activitiesScore / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Disponibilidad coincidente (20% del peso)</span>
                      <span className="text-emerald-600">{compatibility.availabilityScore}/20 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(compatibility.availabilityScore / 20) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Name, Age, Location */}
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-xl font-normal text-slate-500">, {user.age}</span>
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 mt-1">
                <span className="flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  {user.city} ({user.area})
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium">
                  {compatibility.approxDistanceStr}
                </span>
              </div>
            </div>

            {/* Shared Interests Highlight */}
            {compatibility.sharedInterests.length > 0 && (
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl mb-5">
                <p className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Comparten {compatibility.sharedInterests.length} intereses:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {compatibility.sharedInterests.map((interest) => (
                    <span 
                      key={interest}
                      className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Bio */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Sobre {user.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {user.bio || 'Este usuario aún no ha escrito una biografía.'}
              </p>
            </div>

            {/* Favorite Activities */}
            {user.favorite_activities && user.favorite_activities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Actividades favoritas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.favorite_activities.map((act) => (
                    <span 
                      key={act}
                      className="bg-purple-50 text-purple-800 border border-purple-200/70 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      ✨ {act}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Interests */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Todos los intereses
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => {
                  const isShared = compatibility.sharedInterests.includes(interest);
                  return (
                    <Badge
                      key={interest}
                      variant={isShared ? 'emerald' : 'secondary'}
                      size="md"
                    >
                      {interest} {isShared && '✓'}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Disponibilidad habitual</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.availability.map((avail) => (
                  <span 
                    key={avail}
                    className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium"
                  >
                    🕒 {avail}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 mb-6">
              {isConnected ? (
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:flex-1"
                  onClick={() => {
                    onClose();
                    openChatWithUser(user.id);
                  }}
                  leftIcon={<MessageSquare className="w-5 h-5" />}
                >
                  Enviar mensaje en el Chat
                </Button>
              ) : isPendingSent ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:flex-1 bg-amber-50 text-amber-800 border-amber-200 cursor-default"
                  leftIcon={<Clock className="w-5 h-5 text-amber-600" />}
                  disabled
                >
                  Solicitud de conexión enviada (Pendiente)
                </Button>
              ) : isPendingReceived ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:flex-1"
                  onClick={() => {
                    onClose();
                    // navigate to connections
                  }}
                  leftIcon={<UserCheck className="w-5 h-5" />}
                >
                  Responder solicitud pendiente
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:flex-1"
                  onClick={() => sendConnectionRequest(user.id)}
                  leftIcon={<UserPlus className="w-5 h-5" />}
                >
                  Conectar para entablar amistad
                </Button>
              )}

              {/* Security actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="p-3 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-slate-200 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                  title="Reportar usuario"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Reportar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Seguro que deseas bloquear a ${user.name}? No volverás a ver su perfil.`)) {
                      blockUser(user.id);
                      onClose();
                    }
                  }}
                  className="p-3 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                  title="Bloquear usuario"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Bloquear</span>
                </button>
              </div>
            </div>

            {/* Safety Reminder */}
            <SafetyBanner compact />

          </div>

        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetUserId={user.id}
        targetUserName={user.name}
      />
    </>
  );
};
