import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateCompatibility } from '../../utils/compatibility';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { SafetyBanner } from '../common/SafetyBanner';
import { EmptyState } from '../common/EmptyState';
import { DEFAULT_INTERESTS } from '../../data/mockData';
import { UserProfileDetailModal } from './UserProfileDetailModal';
import { Profile } from '../../types';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  UserPlus, 
  Clock, 
  SlidersHorizontal, 
  LayoutGrid, 
  Compass, 
  Check, 
  X,
  MessageSquare,
  Eye
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    profiles, 
    connections, 
    blocks, 
    sendConnectionRequest, 
    openChatWithUser,
    setCurrentRoute 
  } = useAuth();

  // Selected profile for modal detail view
  const [selectedUserForModal, setSelectedUserForModal] = useState<Profile | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterestFilter, setSelectedInterestCategoryFilter] = useState<string | null>(null);
  const [selectedMaxDistanceFilter, setSelectedMaxDistanceFilter] = useState<number | null>(null);
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'radar'>('cards');

  if (!currentUser) return null;

  // Filter blocked users and current user out
  const blockedIds = blocks.map(b => b.blocked_id);
  
  const eligibleProfiles = useMemo(() => {
    return profiles.filter(p => p.id !== currentUser.id && !blockedIds.includes(p.id));
  }, [profiles, currentUser.id, blockedIds]);

  // Calculate compatibility for each and filter
  const rankedProfiles = useMemo(() => {
    return eligibleProfiles.map(p => {
      const comp = calculateCompatibility(currentUser, p);
      return { profile: p, comp };
    }).filter(({ profile }) => {
      // Search text filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = profile.name.toLowerCase().includes(q);
        const matchCity = profile.city.toLowerCase().includes(q);
        const matchBio = profile.bio.toLowerCase().includes(q);
        const matchInterest = profile.interests.some(i => i.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchBio && !matchInterest) return false;
      }

      // Interest filter
      if (selectedInterestFilter) {
        if (!profile.interests.some(i => i.toLowerCase() === selectedInterestFilter.toLowerCase())) {
          return false;
        }
      }

      // Distance filter
      if (selectedMaxDistanceFilter) {
        if (profile.max_distance_km > selectedMaxDistanceFilter) {
          return false;
        }
      }

      // Availability filter
      if (selectedAvailabilityFilter) {
        if (!profile.availability.includes(selectedAvailabilityFilter as any)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.comp.overallScore - a.comp.overallScore); // Sort highest compatibility first!
  }, [
    eligibleProfiles, 
    currentUser, 
    searchQuery, 
    selectedInterestFilter, 
    selectedMaxDistanceFilter, 
    selectedAvailabilityFilter
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedInterestCategoryFilter(null);
    setSelectedMaxDistanceFilter(null);
    setSelectedAvailabilityFilter(null);
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedInterestFilter || selectedMaxDistanceFilter || selectedAvailabilityFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={currentUser.avatar_url}
              name={currentUser.name}
              size="lg"
              isOnline={currentUser.is_online}
              className="ring-4 ring-white/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  ¡Hola, {currentUser.name.split(' ')[0]}!
                </h1>
                <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/40">
                  {currentUser.city}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
                Hemos encontrado <strong className="text-white">{rankedProfiles.length} personas</strong> en tu área con afinidad a tus aficiones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setCurrentRoute('/profile')}
            >
              Editar mis intereses
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Reminder Banner */}
      <SafetyBanner />

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por interés, nombre o zona (ej. café, libros, Ruzafa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white text-indigo-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tarjetas</span>
              </button>

              <button
                onClick={() => setViewMode('radar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'radar' 
                    ? 'bg-white text-indigo-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Radar de Zona</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Interest Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interés:</span>
          </span>

          <button
            onClick={() => setSelectedInterestCategoryFilter(null)}
            className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
              !selectedInterestFilter 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>

          {DEFAULT_INTERESTS.slice(0, 8).map((interest) => {
            const isSelected = selectedInterestFilter === interest.name;
            return (
              <button
                key={interest.id}
                onClick={() => setSelectedInterestCategoryFilter(isSelected ? null : interest.name)}
                className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {interest.name}
              </button>
            );
          })}
        </div>

        {/* Distance & Availability filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Distancia máx:</span>
              <select
                value={selectedMaxDistanceFilter || ''}
                onChange={(e) => setSelectedMaxDistanceFilter(e.target.value ? Number(e.target.value) : null)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Cualquier distancia</option>
                <option value="1">Hasta 1 km</option>
                <option value="5">Hasta 5 km</option>
                <option value="10">Hasta 10 km</option>
                <option value="25">Hasta 25 km</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Disponibilidad:</span>
              <select
                value={selectedAvailabilityFilter || ''}
                onChange={(e) => setSelectedAvailabilityFilter(e.target.value || null)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Cualquier momento</option>
                <option value="Entre semana">Entre semana</option>
                <option value="Fines de semana">Fines de semana</option>
                <option value="Mañanas">Mañanas</option>
                <option value="Tardes">Tardes</option>
                <option value="Noches">Noches</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Personas compatibles cerca de ti</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Ordenadas por afinidad
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculamos la coincidencia basándonos en tus aficiones (60%), actividades (20%) y horario (20%).
          </p>
        </div>
      </div>

      {/* VIEW MODE 1: CARDS GRID */}
      {viewMode === 'cards' && (
        <>
          {rankedProfiles.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8 text-indigo-500" />}
              title="No encontramos personas con los filtros actuales"
              description="Prueba a ampliar la distancia de búsqueda o seleccionar otros intereses para encontrar más vecinos."
              actionButton={
                <Button variant="outline" onClick={clearFilters}>
                  Mostrar todas las personas cercanas
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rankedProfiles.map(({ profile, comp }) => {
                
                // Connection status
                const connection = connections.find(
                  c => (c.sender_id === currentUser.id && c.receiver_id === profile.id) ||
                       (c.receiver_id === currentUser.id && c.sender_id === profile.id)
                );

                const isConnected = connection?.status === 'accepted';
                const isPendingSent = connection?.status === 'pending' && connection.sender_id === currentUser.id;
                const isPendingReceived = connection?.status === 'pending' && connection.receiver_id === currentUser.id;

                return (
                  <Card
                    key={profile.id}
                    hoverable
                    className="flex flex-col justify-between border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 relative overflow-hidden"
                  >
                    
                    {/* Top Compatibility Badge Ribbon */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{comp.overallScore}%</span>
                      </span>
                    </div>

                    <div>
                      {/* Avatar & User summary */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <Avatar
                          src={profile.avatar_url}
                          name={profile.name}
                          size="lg"
                          isOnline={profile.is_online}
                        />

                        <div className="pr-16">
                          <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            {profile.name}, {profile.age}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{profile.city}</span>
                          </div>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {comp.approxDistanceStr}
                          </span>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50/70 p-2.5 rounded-xl italic">
                        "{profile.bio}"
                      </p>

                      {/* Shared Interests Highlights Text */}
                      {comp.sharedInterests.length > 0 ? (
                        <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-3 text-xs">
                          <p className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Comparten {comp.sharedInterests.length} intereses:</span>
                          </p>
                          <p className="text-indigo-700 font-medium truncate">
                            {comp.sharedInterests.join(', ')}
                          </p>
                        </div>
                      ) : (
                        <div className="mb-3 text-xs text-slate-500 font-medium">
                          Intereses: {profile.interests.slice(0, 3).join(', ')}
                        </div>
                      )}

                      {/* Availability Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {profile.availability.slice(0, 2).map((a) => (
                          <span key={a} className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-slate-600 hover:text-indigo-600 border border-slate-200"
                        onClick={() => setSelectedUserForModal(profile)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Ver perfil
                      </Button>

                      {isConnected ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => openChatWithUser(profile.id)}
                          leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                        >
                          Chat
                        </Button>
                      ) : isPendingSent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-amber-50 text-amber-800 border-amber-200"
                          disabled
                        >
                          Enviada
                        </Button>
                      ) : isPendingReceived ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedUserForModal(profile)}
                        >
                          Responder
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => sendConnectionRequest(profile.id)}
                          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                        >
                          Conectar
                        </Button>
                      )}

                    </div>

                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: RADAR DE ZONA VISUALIZER */}
      {viewMode === 'radar' && (
        <Card className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2 text-white">
                <Compass className="w-5 h-5 text-emerald-400 animate-spin" />
                <span>Radar de Cercanía en {currentUser.city}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Visualización gráfica de vecinos compatibles por círculos de proximidad aproximada.
              </p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold">
              Sin GPS exacto
            </span>
          </div>

          {/* Interactive Radar Visual */}
          <div className="relative w-full max-w-lg mx-auto aspect-square rounded-full border border-indigo-500/30 flex items-center justify-center p-8 bg-indigo-950/40 my-4 shadow-2xl">
            
            {/* Concentric Circles */}
            <div className="absolute inset-4 rounded-full border border-indigo-500/20" />
            <div className="absolute inset-16 rounded-full border border-indigo-500/30" />
            <div className="absolute inset-28 rounded-full border border-emerald-500/30" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-indigo-500/20" />
              <div className="h-full w-[1px] bg-indigo-500/20" />
            </div>

            {/* Center: You */}
            <div className="z-20 flex flex-col items-center">
              <Avatar src={currentUser.avatar_url} name={currentUser.name} size="md" className="ring-4 ring-indigo-400" />
              <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full mt-1">Tú</span>
            </div>

            {/* Placed user dots on radar based on compatibility & distance */}
            {rankedProfiles.slice(0, 6).map(({ profile, comp }, index) => {
              // Calculate angular placement
              const angle = (index * (360 / Math.min(6, rankedProfiles.length))) * (Math.PI / 180);
              const radiusPercent = 30 + (index * 10); // distance ring

              const x = Math.cos(angle) * radiusPercent;
              const y = Math.sin(angle) * radiusPercent;

              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedUserForModal(profile)}
                  className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-110"
                  style={{
                    left: `calc(50% + ${x}%)`,
                    top: `calc(50% + ${y}%)`
                  }}
                >
                  <div className="relative">
                    <Avatar src={profile.avatar_url} name={profile.name} size="sm" className="ring-2 ring-emerald-400 shadow-md" />
                    <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full">
                      {comp.overallScore}%
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs font-bold p-2 rounded-xl whitespace-nowrap shadow-xl z-40 border border-slate-700">
                    <p>{profile.name}, {profile.age}</p>
                    <p className="text-[10px] text-emerald-400">{comp.approxDistanceStr}</p>
                  </div>
                </div>
              );
            })}

          </div>

          <div className="text-center text-xs text-slate-400 mt-2">
            Haz clic en cualquier perfil del radar para ver su detalle completo y conectar.
          </div>
        </Card>
      )}

      {/* User Detail Modal */}
      {selectedUserForModal && (
        <UserProfileDetailModal
          user={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
        />
      )}

    </div>
  );
};
