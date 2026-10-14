import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { MapPin, Edit3, Clock, Compass, ShieldCheck } from 'lucide-react';

export const MyProfileView: React.FC = () => {
  const { currentUser, setCurrentRoute } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Cover & Avatar Header */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 relative" />
        <div className="p-6 pt-0 relative">
          <div className="flex flex-wrap items-end justify-between -mt-14 mb-4 gap-4">
            <Avatar
              src={currentUser.avatar_url}
              name={currentUser.name}
              size="xl"
              isOnline={currentUser.is_online}
              className="ring-4 ring-white shadow-lg"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRoute('/settings')}
              leftIcon={<Edit3 className="w-4 h-4 text-indigo-600" />}
            >
              Editar Perfil
            </Button>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            {currentUser.name}, {currentUser.age}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1">
            <span className="flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              <MapPin className="w-4 h-4 text-indigo-600" />
              {currentUser.city} ({currentUser.area})
            </span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Radio: hasta {currentUser.max_distance_km} km</span>
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Mi Biografía
            </h3>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
              {currentUser.bio}
            </p>
          </div>

          {/* Favorites */}
          {currentUser.favorite_activities && currentUser.favorite_activities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Actividades Favoritas
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.favorite_activities.map((act) => (
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

          {/* Interests */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Mis Intereses Seleccionados ({currentUser.interests.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest) => (
                <Badge key={interest} variant="primary" size="md">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Disponibilidad habitual</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.availability.map((avail) => (
                <span
                  key={avail}
                  className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-semibold"
                >
                  🕒 {avail}
                </span>
              ))}
            </div>
          </div>

        </div>
      </Card>

      {/* Safety Summary Box */}
      <Card className="p-5 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">ConectaCerca - Comunidad Segura</h4>
            <p className="text-xs text-slate-600">
              Tu ubicación exacta nunca es pública. Solo se muestra tu ciudad y barrio general.
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
};
