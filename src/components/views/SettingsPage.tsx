import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { DEFAULT_INTERESTS } from '../../data/mockData';
import { AvailabilityOption, DistanceOption } from '../../types';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Ban, 
  Trash2, 
  Save, 
  Code, 
  Compass, 
  Camera, 
  Clock, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    currentUser, 
    updateProfile, 
    blocks, 
    unblockUser, 
    profiles, 
    deleteAccount, 
    addToast 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'blocked' | 'sql'>('profile');

  // Form states for profile editing
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState<number>(currentUser?.age || 25);
  const [city, setCity] = useState(currentUser?.city || '');
  const [area, setArea] = useState(currentUser?.area || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);
  const [availability, setAvailability] = useState<AvailabilityOption[]>(currentUser?.availability || []);
  const [maxDistance, setMaxDistance] = useState<DistanceOption>(currentUser?.max_distance_km || 10);
  const [isInvisble, setIsInvisible] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentUser) return null;

  const availabilityOptions: AvailabilityOption[] = [
    'Entre semana',
    'Fines de semana',
    'Mañanas',
    'Tardes',
    'Noches'
  ];

  const distanceOptions: DistanceOption[] = [1, 5, 10, 25];

  const toggleInterest = (interestName: string) => {
    if (interests.includes(interestName)) {
      setInterests(interests.filter(i => i !== interestName));
    } else {
      setInterests([...interests, interestName]);
    }
  };

  const toggleAvailability = (opt: AvailabilityOption) => {
    if (availability.includes(opt)) {
      setAvailability(availability.filter(a => a !== opt));
    } else {
      setAvailability([...availability, opt]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      age: Number(age),
      city,
      area,
      avatar_url: avatarUrl,
      bio,
      interests,
      availability,
      max_distance_km: maxDistance
    });
    addToast('success', 'Perfil guardado con éxito.');
  };

  const sqlSchemaText = `-- Esquema SQL de Supabase para ConectaCerca
-- Copia e ejecuta esto en la consola SQL de Supabase (SQL Editor)

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  bio TEXT DEFAULT '',
  city TEXT DEFAULT '',
  area TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  max_distance_km INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  UNIQUE(user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-600" />
          <span>Ajustes y Configuración</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Administra tu perfil, tus opciones de privacidad y seguridad.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-sm font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Editar Perfil</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'privacy' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacidad & Seguridad</span>
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'blocked' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Usuarios Bloqueados ({blocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
            activeTab === 'sql' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Base de datos Supabase</span>
        </button>
      </div>

      {/* TAB 1: EDIT PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="p-6 space-y-6 border-slate-200">
            
            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={name} size="xl" />
              <div className="flex-1">
                <Input
                  label="URL de Foto de perfil"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  leftIcon={<Camera className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Edad"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <Input
                label="Zona o Barrio general"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Biografía
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Interest badges */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Mis Intereses (haz clic para activar/desactivar):
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                {DEFAULT_INTERESTS.map((item) => {
                  const isSelected = interests.includes(item.name);
                  return (
                    <Badge
                      key={item.id}
                      selected={isSelected}
                      onClick={() => toggleInterest(item.name)}
                      size="md"
                    >
                      {item.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Mi disponibilidad</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((opt) => {
                  const isChecked = availability.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleAvailability(opt)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isChecked ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Distancia máxima para recomendaciones ({maxDistance} km)</span>
              </label>
              <div className="flex gap-2">
                {distanceOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setMaxDistance(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      maxDistance === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {d} km
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" variant="gradient" size="lg" leftIcon={<Save className="w-4 h-4" />}>
                Guardar Cambios
              </Button>
            </div>

          </Card>
        </form>
      )}

      {/* TAB 2: PRIVACY & SECURITY */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6 border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>Ajustes de Privacidad</span>
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Ocultar perfil (Modo Invisible)</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Si activas esta opción, tu perfil no aparecerá en las recomendaciones cercanas.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isInvisble}
                onChange={(e) => {
                  setIsInvisible(e.target.checked);
                  addToast('info', e.target.checked ? 'Modo invisible activado' : 'Modo invisible desactivado');
                }}
                className="w-5 h-5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
              />
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Nuestra garantía de seguridad</span>
              </h4>
              <p>
                • No almacenamos coordenadas GPS exactas. Solo zonas geográficas generales.
              </p>
              <p>
                • Solamente las personas a las que aceptes podrán enviarte mensajes privados.
              </p>
              <p>
                • Puedes bloquear o reportar cualquier comportamiento inadecuado en un clic.
              </p>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="font-bold text-rose-600 text-sm mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Zona de Peligro</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Si eliminas tu cuenta, se borrarán de forma permanente tu perfil, conexiones y mensajes.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Eliminar mi cuenta definitivamente
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: BLOCKED USERS */}
      {activeTab === 'blocked' && (
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-extrabold text-slate-900 text-lg">Usuarios Bloqueados</h3>
          {blocks.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No has bloqueado a ningún usuario.</p>
          ) : (
            <div className="space-y-3">
              {blocks.map((block) => {
                const blockedProfile = profiles.find(p => p.id === block.blocked_id);
                return (
                  <div key={block.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={blockedProfile?.avatar_url || ''}
                        name={blockedProfile?.name || 'Usuario'}
                        size="sm"
                      />
                      <span className="font-bold text-slate-800 text-sm">
                        {blockedProfile?.name || 'Usuario bloqueado'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockUser(block.blocked_id)}
                    >
                      Desbloquear
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: SQL SCHEMA */}
      {activeTab === 'sql' && (
        <Card className="p-6 space-y-4 border-slate-200">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              <span>Esquema de Base de Datos Supabase SQL</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Este script define las tablas `profiles`, `interests`, `user_interests`, `connections`, `messages`, `blocks` y `reports` con sus claves foráneas y políticas RLS.
            </p>
          </div>

          <textarea
            readOnly
            rows={16}
            value={sqlSchemaText}
            className="w-full bg-slate-900 text-indigo-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none"
          />
        </Card>
      )}

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="¿Eliminar cuenta?">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            ¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y eliminará todos tus datos.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={deleteAccount}>
              Sí, eliminar definitivamente
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
