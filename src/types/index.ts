export type Platform = 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'tiktok' | 'link';

export interface SavedItem {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  platform: Platform;
  collectionName: string;
  savedAt: string; // ISO date string
  thumbnail?: string;
}
