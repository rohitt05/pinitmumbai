export type Category =
  | 'roads'
  | 'garbage'
  | 'streetlight'
  | 'water'
  | 'safety'
  | 'theft'
  | 'other';

export interface Report {
  id: string;
  lat: number;
  lng: number;
  category: Category;
  description: string | null;
  area_name: string | null;
  photo_url: string;
  upvotes: number;
  created_at: string;
  // Derived client-side — not stored in DB
  ward_key?: string;
}
