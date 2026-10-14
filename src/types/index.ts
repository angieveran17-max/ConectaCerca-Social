export type AvailabilityOption = 
  | 'Entre semana'
  | 'Fines de semana'
  | 'Mañanas'
  | 'Tardes'
  | 'Noches';

export type DistanceOption = 1 | 5 | 10 | 25;

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio: string;
  city: string;
  area: string;
  avatar_url: string;
  interests: string[];
  favorite_activities: string[];
  availability: AvailabilityOption[];
  max_distance_km: DistanceOption;
  latitude_approx?: number;
  longitude_approx?: number;
  created_at?: string;
  updated_at?: string;
  is_online?: boolean;
}

export interface InterestCategory {
  id: string;
  name: string;
  category: string;
  icon: string;
  description?: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface Connection {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string;
  created_at: string;
}

export interface CompatibilityResult {
  overallScore: number;
  interestsScore: number;
  activitiesScore: number;
  availabilityScore: number;
  sharedInterests: string[];
  sharedActivities: string[];
  sharedAvailability: AvailabilityOption[];
  approxDistanceStr: string;
}

export type RoutePath =
  | '/'
  | '/login'
  | '/register'
  | '/onboarding'
  | '/dashboard'
  | '/discover'
  | '/profile'
  | '/connections'
  | '/messages'
  | '/settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
