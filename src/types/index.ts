export type Platform = 'instagram' | 'youtube' | 'facebook' | 'x' | 'linkedin';

export interface SavedItem {
  id: string;
  url: string;
  title: string; // custom title (user-set)
  originalTitle: string; // auto-extracted
  platform: Platform;
  creator: string;
  thumbnailUri?: string;
  collection?: string;
  tags: string[];
  notes?: string;
  isFavorite: boolean;
  savedAt: string; // ISO date string
  viewedAt?: string;
}

export interface ArchivedItem extends SavedItem {
  archivedAt: string; // ISO date
  autoDeleteAt: string; // ISO date — 30 days after archival
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  isPinned: boolean;
  itemCount: number;
  createdAt: string;
}

export interface SearchFilters {
  platform: Platform | null;
  collection: string | null;
  tags: string[];
  favoritesOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'title';
}
