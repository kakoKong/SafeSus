export interface City {
  id: number;
  name: string;
  country: string;
  slug: string;
  supported: boolean;
}

export type ZoneLevel = 'recommended' | 'neutral' | 'avoid';

export interface Zone {
  id: number;
  city_id: number;
  label: string;
  level: ZoneLevel;
  reason_short: string;
  reason_long: string | null;
  geom: GeoJSON.Polygon;
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

