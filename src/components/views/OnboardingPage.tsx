import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DEFAULT_INTERESTS } from '../../data/mockData';
import { AvailabilityOption, DistanceOption } from '../../types';
import { 
  User, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Clock, 
  Compass, 
  Camera
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
];

export const OnboardingPage: React.FC = () => {
  const { currentUser, updateProfile, setCurrentRoute, addToast } = useAuth();

  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState<number>(currentUser?.age || 25);
  const [city, setCity] = useState(currentUser?.city || 'Valencia');
  const [area, setArea] = useState(currentUser?.area || 'Zona Centro');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || PRESET_AVATARS[0]);
  const [bio, setBio] = useState(currentUser?.bio || '');
  
  // Selected interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || ['Tomar café', 'Leer libros', 'Caminar']
  );

  // Favorite activities text
  const [favoriteActivitiesStr, setFavoriteActivitiesStr] = useState<string>(
    currentUser?.favorite_activities ? currentUser.favorite_activities.join(', ') : 'Cafés de especialidad, Paseos por parques'
  );

  // Availability
  const [availability, setAvailability] = useState<AvailabilityOption[]>(
    currentUser?.availability || ['Fines de semana', 'Tardes']
  );

  // Max distance
  const [maxDistance, setMaxDistance] = useState<DistanceOption>(
    currentUser?.max_distance_km || 10
  );

  const availabilityOptions: AvailabilityOption[] = [
    'Entre semana',
    'Fines de semana',
    'Mañanas',
    'Tardes',
    'Noches'
  ];

  const distanceOptions: DistanceOption[] = [1, 5, 10, 25];

  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      if (selectedInterests.length <= 1) {
        addToast('info', 'Selecciona al menos un interés.');
        return;
      }
      setSelectedInterests(selectedInterests.filter(i => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  const toggleAvailability = (opt: AvailabilityOption) => {
    if (availability.includes(opt)) {
      setAvailability(availability.filter(a => a !== opt));
    } else {
      setAvailability([...availability, opt]);
    }
  };

  const handleFinish = () => {
    const activitiesList = favoriteActivitiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateProfile({
      name,
      age: Number(age),
      city,
      area,
      avatar_url: avatarUrl,
      bio,
      interests: selectedInterests,
      favorite_activities: activitiesList.length > 0 ? activitiesList : ['Conversar tomando un café', 'Actividades de fin de semana'],
      availability,
      max_distance_km: maxDistance
    });

    addToast('success', '¡Perfil configurado con éxito! Bienvenido a ConectaCerca.');
    setCurrentRoute('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        
        {/* Step Indicator Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Paso {step} de 3</span>
            <span>
              {step === 1 && 'Datos personales & Foto'}
              {step === 2 && 'Intereses & Actividades'}
              {step === 3 && 'Disponibilidad & Distancia'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg border-indigo-100 p-6 sm:p-8">
          
          {/* STEP 1: Datos Personales & Foto */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>¡Cuéntanos sobre ti!</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Tu nombre, edad y zona ayudarán a recomendarte personas cercanas.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Elige tu foto de perfil
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-700">Selecciona un avatar de muestra o ingresa una URL:</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                            avatarUrl === url ? 'border-indigo-600 scale-110 shadow-sm' : 'border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Input
                  placeholder="O pega el enlace de tu foto (https://...)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  leftIcon={<Camera className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Edad"
                  type="number"
                  min={18}
                  max={99}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Input
                  label="Barrio o Zona general"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ej. Zona Centro / Barrio Norte"
                  helperText="Nunca revelamos tu ubicación exacta."
                  leftIcon={<Compass className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Descripción personal (Biografía)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escribe brevemente qué te gusta hacer y qué tipo de personas te gustaría conocer..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Siguiente paso
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Intereses & Actividades */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Selecciona tus Intereses
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Elige las actividades e inquietudes que más disfrutas. Puedes seleccionar varias.
                </p>
              </div>

              {/* Preset interest badges */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2.5">
                  Intereses principales (haz clic para activar):
                </label>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                  {DEFAULT_INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item.name);
                    return (
                      <Badge
                        key={item.id}
                        selected={isSelected}
                        onClick={() => toggleInterest(item.name)}
                        size="md"
                        variant={isSelected ? 'primary' : 'outline'}
                      >
                        {item.name}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Seleccionados: <strong className="text-indigo-600 font-bold">{selectedInterests.length} intereses</strong>
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tus actividades favoritas específicas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={favoriteActivitiesStr}
                  onChange={(e) => setFavoriteActivitiesStr(e.target.value)}
                  placeholder="Ej. Salidas a tomar café, Ir al cine independiente, Rutas de senderismo fáciles"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Siguiente paso
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Disponibilidad & Distancia */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Disponibilidad & Preferencias de Cercanía
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Indica cuándo sueles tener tiempo libre y qué tan lejos te gustaría buscar nuevos amigos.
                </p>
              </div>

              {/* Availability checklist */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>¿Cuándo sueles estar disponible?</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availabilityOptions.map((opt) => {
                    const isChecked = availability.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleAvailability(opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-800 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Distance Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Distancia máxima para recomendarte personas cercanas</span>
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {distanceOptions.map((dist) => {
                    const isSelected = maxDistance === dist;
                    return (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setMaxDistance(dist)}
                        className={`py-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {dist} km
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Anterior
                </Button>

                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleFinish}
                  rightIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
                >
                  Guardar y Descubrir
                </Button>
              </div>
            </div>
          )}

        </Card>

      </div>
    </div>
  );
};
