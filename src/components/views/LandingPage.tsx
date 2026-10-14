import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  BookOpen, 
  Coffee, 
  Film, 
  Music, 
  Dumbbell, 
  Trees, 
  Palette, 
  Gamepad2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  HeartHandshake,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, quickDemoLogin } = useAuth();
  const [selectedInterestCategory, setSelectedInterestCategory] = useState<string | null>('Café');

  const interestHighlights = [
    { name: 'Libros', icon: <BookOpen className="w-4 h-4" />, count: '320+ lectores', desc: 'Clubes de lectura, intercambio de libros y charlas literarias' },
    { name: 'Café', icon: <Coffee className="w-4 h-4" />, count: '450+ en la zona', desc: 'Quedadas en cafeterías de especialidad para charlar sin prisas' },
    { name: 'Cine', icon: <Film className="w-4 h-4" />, count: '210+ cinéfilos', desc: 'Ir juntos al cine, cinefórums y maratones de series' },
    { name: 'Música', icon: <Music className="w-4 h-4" />, count: '380+ melómanos', desc: 'Conciertos en directo, jam sessions y compartir playlists' },
    { name: 'Deportes', icon: <Dumbbell className="w-4 h-4" />, count: '290+ deportistas', desc: 'Running en grupo, yoga en el parque, gimnasio o pádel' },
    { name: 'Senderismo', icon: <Trees className="w-4 h-4" />, count: '180+ excursionistas', desc: 'Escapadas a la naturaleza, rutas de montaña y paseos al atardecer' },
    { name: 'Arte', icon: <Palette className="w-4 h-4" />, count: '150+ creativos', desc: 'Visitas a museos, galerías, talleres de pintura y cerámica' },
    { name: 'Videojuegos', icon: <Gamepad2 className="w-4 h-4" />, count: '240+ gamers', desc: 'Tardes de juegos cooperativos, juegos de mesa y eSports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-purple-50/30 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Soft Background Blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-emerald-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
            <span>La red para crear amistades genuinas y compartir aficiones</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Encuentra personas cerca de ti que{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              comparten tus intereses
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            ConectaCerca te ayuda a encontrar compañía para tomar un café, salir a caminar, ir al cine, entrenar o debatir sobre libros. <strong className="text-slate-800 font-semibold">Sin presiones ni enfoque en citas románticas</strong>; solo gente real de tu zona con ganas de hacer comunidad.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto mb-10">
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto text-base py-3.5 px-8"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setCurrentRoute('/register')}
            >
              Crear mi perfil
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base py-3.5 px-6"
              onClick={() => setCurrentRoute('/login')}
            >
              Iniciar sesión
            </Button>
          </div>

          {/* Quick Demo Access banner */}
          <div className="inline-flex items-center gap-3 p-2.5 px-4 bg-white/90 border border-indigo-100 rounded-2xl shadow-sm text-xs sm:text-sm text-slate-700">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>¿Quieres probar la aplicación de inmediato sin registrarte?</span>
            <button
              onClick={quickDemoLogin}
              className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
            >
              Explorar versión Demo
            </button>
          </div>

        </div>
      </section>

      {/* FEATURED INTERESTS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            ¿Qué te gustaría hacer hoy?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Explora las categorías populares y descubre cuántas personas en tu misma ciudad comparten tus pasiones.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {interestHighlights.map((item) => (
            <Badge
              key={item.name}
              icon={item.icon}
              selected={selectedInterestCategory === item.name}
              onClick={() => setSelectedInterestCategory(item.name)}
              size="md"
              variant="primary"
            >
              {item.name}
            </Badge>
          ))}
        </div>

        {/* Active Selected Highlight Box */}
        {selectedInterestCategory && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-md max-w-2xl mx-auto text-center animate-in fade-in duration-300">
            {interestHighlights.map((item) => {
              if (item.name !== selectedInterestCategory) return null;
              return (
                <div key={item.name} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Gente con afición a {item.name}
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
                    {item.count}
                  </span>
                  <p className="text-sm text-slate-600 max-w-md">{item.desc}</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    rightIcon={<Compass className="w-4 h-4" />}
                    onClick={() => setCurrentRoute('/register')}
                  >
                    Buscar compañeros de {item.name.toLowerCase()}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/60">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Sencillo y directo
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2 mb-3">
            ¿Cómo funciona ConectaCerca?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Tres simples pasos para ampliar tu red de amigos y encontrar acompañantes de actividades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Crea tu perfil e intereses</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Indica tu zona general, tus disponibilidad y selecciona los temas que te apasionan (libros, café, senderismo, etc.).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-lg flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Descubre vecinos compatibles</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nuestro algoritmo calcula un % de afinidad basado en intereses compartidos, disponibilidad y cercanía aproximada.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Conecta y planifica</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Envía una solicitud de conexión. Cuando ambos acepten, abran un chat seguro para acordar una salida o actividad.
            </p>
          </div>

        </div>
      </section>

      {/* TRUST & PRIVACY GUARANTEE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5" />
                <span>Privacidad y Seguridad ante todo</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Tu ubicación exacta nunca es revelada
              </h3>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Mostramos únicamente ubicaciones aproximadas (ej. "A menos de 1 km" o "Zona Centro"). Además, contamos con opciones para reportar, bloquear perfiles y moderar la comunidad.
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="shrink-0 whitespace-nowrap"
              onClick={() => setCurrentRoute('/register')}
            >
              Unirme a la comunidad
            </Button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-6">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
            <span>ConectaCerca © 2026 — Plataforma de Amistad y Actividades Compartidas</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => setCurrentRoute('/login')} className="hover:underline">Iniciar sesión</button>
            <span>•</span>
            <button onClick={() => setCurrentRoute('/register')} className="hover:underline">Registro</button>
            <span>•</span>
            <button onClick={quickDemoLogin} className="hover:underline text-indigo-600 font-semibold">Modo Demo</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
