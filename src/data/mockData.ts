import { Profile, Connection, Message, InterestCategory } from '../types';

export const DEFAULT_INTERESTS: InterestCategory[] = [
  { id: '1', name: 'Leer libros', category: 'Cultura & Lectura', icon: 'BookOpen', description: 'Clubes de lectura, intercambio de libros y charlas literarias' },
  { id: '2', name: 'Tomar café', category: 'Social & Gastronomía', icon: 'Coffee', description: 'Descubrir cafeterías especiales y buenas conversaciones' },
  { id: '3', name: 'Ver películas', category: 'Entretenimiento', icon: 'Film', description: 'Cine, debates de películas y maratones de series' },
  { id: '4', name: 'Escuchar música', category: 'Arte & Música', icon: 'Music', description: 'Conciertos, vinilos y compartir playlist recomendadas' },
  { id: '5', name: 'Cocinar', category: 'Social & Gastronomía', icon: 'Utensils', description: 'Intercambio de recetas, cenas compartidas y talleres culinarios' },
  { id: '6', name: 'Hacer deporte', category: 'Salud & Bienestar', icon: 'Dumbbell', description: 'Entrenar juntos, running, gimnasio o yoga' },
  { id: '7', name: 'Caminar', category: 'Aire libre', icon: 'Footprints', description: 'Paseos urbanos, caminatas al atardecer y parques' },
  { id: '8', name: 'Viajar', category: 'Aventura', icon: 'Compass', description: 'Escapadas de fin de semana y turismo cultural' },
  { id: '9', name: 'Fotografía', category: 'Arte & Música', icon: 'Camera', description: 'Salidas fotográficas por la ciudad y edición' },
  { id: '10', name: 'Videojuegos', category: 'Entretenimiento', icon: 'Gamepad2', description: 'Juegos cooperativos, gaming casual y torneos amistosos' },
  { id: '11', name: 'Arte', category: 'Cultura & Lectura', icon: 'Palette', description: 'Visitar museos, galerías de arte y talleres creativos' },
  { id: '12', name: 'Aprender idiomas', category: 'Educación', icon: 'Languages', description: 'Intercambios lingüísticos de café y conversación' },
  { id: '13', name: 'Senderismo', category: 'Aire libre', icon: 'Trees', description: 'Rutas por la montaña, naturaleza y aire fresco' },
  { id: '14', name: 'Juegos de mesa', category: 'Entretenimiento', icon: 'Dices', description: 'Tardes de Eurogames, Catan o juegos de estrategia' }
];

export const MOCK_CURRENT_USER: Profile = {
  id: 'user_me',
  user_id: 'auth_me',
  name: 'Camila Ríos',
  age: 27,
  bio: 'Apasionada por las caminatas tranquilas al atardecer, la lectura de novela contemporánea y una buena taza de café artesanal. Busco ampliar mi círculo de amistades sinceras para compartir charlas y salidas culturales.',
  city: 'Valencia',
  area: 'Zona Centro / Ruzafa',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  interests: ['Tomar café', 'Leer libros', 'Ver películas', 'Escuchar música', 'Caminar'],
  favorite_activities: ['Salidas a cafeterías con encanto', 'Lectura al aire libre en el parque', 'Cine clásico de autor'],
  availability: ['Entre semana', 'Fines de semana', 'Tardes'],
  max_distance_km: 10,
  latitude_approx: 39.4699,
  longitude_approx: -0.3763,
  is_online: true
};

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'user_1',
    user_id: 'auth_1',
    name: 'Mateo Fernández',
    age: 29,
    bio: 'Me encanta explorar cafeterías escondidas y debatir sobre buenos libros y cine indie. También me gusta salir a caminar por el parque los fines de semana. ¡Siempre abierto a nuevas amistades respetuosas!',
    city: 'Valencia',
    area: 'Zona Ruzafa (a menos de 1 km)',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    interests: ['Tomar café', 'Leer libros', 'Ver películas', 'Caminar', 'Fotografía'],
    favorite_activities: ['Cafés de especialidad', 'Clubes de lectura informal', 'Senderismo moderado'],
    availability: ['Fines de semana', 'Tardes', 'Noches'],
    max_distance_km: 10,
    latitude_approx: 39.468,
    longitude_approx: -0.375,
    is_online: true
  },
  {
    id: 'user_2',
    user_id: 'auth_2',
    name: 'Sofia Benítez',
    age: 26,
    bio: 'Diseñadora gráfica y melómana. Disfruto ir a conciertos acústicos, hacer yoga en el parque y preparar cenas saludables con amigos. Me encantaría encontrar personas para tomar un café e intercambiar ideas.',
    city: 'Valencia',
    area: 'Barrio del Carmen (a 2 km)',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    interests: ['Tomar café', 'Escuchar música', 'Arte', 'Cocinar', 'Caminar'],
    favorite_activities: ['Conciertos en vivo', 'Visitas a museos', 'Cocinar recetas internacionales'],
    availability: ['Entre semana', 'Tardes', 'Noches'],
    max_distance_km: 5,
    latitude_approx: 39.475,
    longitude_approx: -0.378,
    is_online: true
  },
  {
    id: 'user_3',
    user_id: 'auth_3',
    name: 'Alejandro Morales',
    age: 31,
    bio: 'Entusiasta del senderismo, los juegos de mesa estratégicos y el running matutino. Busco un compañero/a de ruta para escapadas a la naturaleza o tardes de Catan y buen café.',
    city: 'Valencia',
    area: 'Zona Benimaclet (a 3 km)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    interests: ['Senderismo', 'Juegos de mesa', 'Hacer deporte', 'Tomar café', 'Viajar'],
    favorite_activities: ['Rutas de montaña', 'Tardes de juegos de mesa', 'Running por el río'],
    availability: ['Fines de semana', 'Mañanas'],
    max_distance_km: 25,
    latitude_approx: 39.482,
    longitude_approx: -0.362,
    is_online: false
  },
  {
    id: 'user_4',
    user_id: 'auth_4',
    name: 'Elena Gómez',
    age: 28,
    bio: 'Profesora de idiomas apasionada por la lectura, la fotografía de arquitectura y la repostería. Me gusta practicar idiomas tomando un té o paseando sin prisas.',
    city: 'Valencia',
    area: 'Zona Cánovas (a 1.5 km)',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    interests: ['Leer libros', 'Aprender idiomas', 'Fotografía', 'Tomar café', 'Cocinar'],
    favorite_activities: ['Intercambio de idiomas', 'Fotografía urbana', 'Hornear pan y galletas'],
    availability: ['Entre semana', 'Tardes'],
    max_distance_km: 5,
    latitude_approx: 39.465,
    longitude_approx: -0.368,
    is_online: true
  },
  {
    id: 'user_5',
    user_id: 'auth_5',
    name: 'Carlos Navarro',
    age: 32,
    bio: 'Programador y fanático de la ciencia ficción, las maratones de películas clásicas y la música jazz. Me gustaría conocer gente amigable para ir al cine y charlar después sobre las películas.',
    city: 'Valencia',
    area: 'Zona Mestalla (a 2.5 km)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    interests: ['Ver películas', 'Videojuegos', 'Escuchar música', 'Leer libros', 'Tomar café'],
    favorite_activities: ['Ir al cine en VOS', 'Escuchar discos de jazz', 'Videojuegos cooperativos'],
    availability: ['Fines de semana', 'Noches'],
    max_distance_km: 10,
    latitude_approx: 39.474,
    longitude_approx: -0.358,
    is_online: false
  },
  {
    id: 'user_6',
    user_id: 'auth_6',
    name: 'Lucía Prieto',
    age: 25,
    bio: 'Bailarina y amante de los animales. Salgo muy seguido a caminar con mi perro por los parques. Busco amigos con quienes compartir caminatas, picnic o charlas de arte.',
    city: 'Valencia',
    area: 'Zona Jardines del Real (a 1 km)',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    interests: ['Caminar', 'Arte', 'Escuchar música', 'Tomar café', 'Viajar'],
    favorite_activities: ['Paseos al aire libre', 'Picnics de fin de semana', 'Exposiciones de arte contemporáneo'],
    availability: ['Entre semana', 'Fines de semana', 'Mañanas', 'Tardes'],
    max_distance_km: 5,
    latitude_approx: 39.479,
    longitude_approx: -0.369,
    is_online: true
  },
  {
    id: 'user_7',
    user_id: 'auth_7',
    name: 'David Valero',
    age: 30,
    bio: 'Chef aficionado y fotógrafo de viajes. Me encanta descubrir platos típicos, mercados locales e ir en bicicleta por la playa. ¡Hablemos de buena comida!',
    city: 'Valencia',
    area: 'Zona Poblats Marítims (a 4 km)',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    interests: ['Cocinar', 'Fotografía', 'Viajar', 'Caminar', 'Escuchar música'],
    favorite_activities: ['Cocinar recetas exóticas', 'Rutas en bicicleta', 'Fotografía de playa'],
    availability: ['Fines de semana', 'Tardes'],
    max_distance_km: 10,
    latitude_approx: 39.462,
    longitude_approx: -0.332,
    is_online: false
  }
];

export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: 'conn_1',
    sender_id: 'user_1',
    receiver_id: 'user_me',
    status: 'accepted',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'conn_2',
    sender_id: 'user_2',
    receiver_id: 'user_me',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'conn_3',
    sender_id: 'user_me',
    receiver_id: 'user_4',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    connection_id: 'conn_1',
    sender_id: 'user_1',
    content: '¡Hola Camila! Qué alegría conectar. Vi que también te apasiona el café de especialidad y la lectura.',
    created_at: new Date(Date.now() - 86400000 * 1 - 3600000 * 4).toISOString(),
    read_at: new Date(Date.now() - 86400000 * 1 - 3600000 * 3).toISOString()
  },
  {
    id: 'msg_2',
    connection_id: 'conn_1',
    sender_id: 'user_me',
    content: '¡Hola Mateo! Sí, totalmente. ¿Conoces algún café agradable cerca de la zona centro?',
    created_at: new Date(Date.now() - 86400000 * 1 - 3600000 * 2).toISOString(),
    read_at: new Date(Date.now() - 86400000 * 1 - 3600000 * 1).toISOString()
  },
  {
    id: 'msg_3',
    connection_id: 'conn_1',
    sender_id: 'user_1',
    content: '¡Conozco uno fantástico con terraza cerca del Mercado Central! ¿Te apetece ir esta semana a tomar un café y charlar sobre libros?',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    read_at: null
  }
];
