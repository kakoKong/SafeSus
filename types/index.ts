export interface City {
  id: number;
  name: string;
  country: string;
  slug: string;
  supported: boolean;
}

export type ZoneLevel = 'recommended' | 'neutral' | 'caution' | 'avoid';

export interface Zone {
  id: number;
  city_id: number;
  label: string;
  level: ZoneLevel;
  reason_short: string;
  reason_long: string | null;
  geom: GeoJSON.Polygon;
  verified_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PinType = 'scam' | 'harassment' | 'overcharge' | 'other';
export type PinStatus = 'approved' | 'pending' | 'rejected';
export type PinSource = 'curated' | 'user';

export interface Pin {
  id: number;
  city_id: number;
  type: PinType;
  title: string;
  summary: string;
  details: string | null;
  location: GeoJSON.Point;
  status: PinStatus;
  source: PinSource;
  created_at: string;
}

export type RuleKind = 'do' | 'dont';

export interface Rule {
  id: number;
  city_id: number;
  kind: RuleKind;
  title: string;
  reason: string;
}

export interface SavedCity {
  user_id: string;
  city_id: number;
  created_at: string;
}

export type TipCategory = 'stay' | 'scam' | 'do_dont';
export type TipStatus = 'pending' | 'approved' | 'rejected';

export interface TipSubmission {
  id: number;
  user_id: string | null;
  city_id: number | null;
  category: TipCategory;
  title: string;
  summary: string;
  details: string | null;
  location: GeoJSON.Point | null;
  status: TipStatus;
  created_at: string;
}

export interface CityDetail extends City {
  zones: Zone[];
  pins: Pin[];
  rules: Rule[];
}

export interface NearbyWarning extends Pin {
  distance: number; // in meters
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// User roles and profiles
export type UserRole = 'traveler' | 'local' | 'guardian' | 'admin';

export interface UserProfile {
  user_id: string;
  role: UserRole;
  score: number;
  created_at: string;
  updated_at: string;
}

// Submissions
export interface ZoneSubmission {
  id: number;
  user_id: string | null;
  city_id: number;
  label: string;
  level: ZoneLevel;
  reason_short: string;
  reason_long: string | null;
  geom: GeoJSON.Polygon;
  status: TipStatus;
  created_at: string;
}

export interface PinSubmission {
  id: number;
  user_id: string | null;
  city_id: number;
  type: PinType;
  title: string;
  summary: string;
  details: string | null;
  location: GeoJSON.Point;
  status: TipStatus;
  created_at: string;
}

// Verifications
export type VerificationTargetType = 'tip' | 'zone' | 'pin';
export type VerificationStatus = 'approved' | 'rejected';

export interface Verification {
  id: number;
  guardian_id: string | null;
  target_type: VerificationTargetType;
  target_id: number;
  status: VerificationStatus;
  notes: string | null;
  created_at: string;
}

// Reports
export type ReportTargetType = 'zone' | 'pin' | 'tip' | 'rule';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface Report {
  id: number;
  reporter_id: string | null;
  target_type: ReportTargetType;
  target_id: number;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
}

// Badges
export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserBadge {
  user_id: string;
  badge_id: number;
  earned_at: string;
  badge?: Badge;
}

