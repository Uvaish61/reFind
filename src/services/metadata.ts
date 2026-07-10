import { Platform } from '../types';

export interface UrlMetadata {
  title: string;
  thumbnailUrl?: string;
  creator?: string;
  platform: Platform;
  originalUrl: string;
}

export function detectPlatform(url: string): Platform {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
  if (url.includes('x.com') || url.includes('twitter.com')) return 'x';
  return 'youtube';
}

function getOgTag(html: string, property: string): string | undefined {
  const match =
    html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
    html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`, 'i'));
  return match?.[1];
}

function getTitleTag(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? 'Untitled';
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  const platform = detectPlatform(url);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Refind/1.0)' },
    });
    const html = await response.text();

    return {
      title: getOgTag(html, 'title') ?? getTitleTag(html),
      thumbnailUrl: getOgTag(html, 'image'),
      creator: getOgTag(html, 'site_name') ?? getOgTag(html, 'author') ?? '',
      platform,
      originalUrl: url,
    };
  } catch {
    return {
      title: url,
      platform,
      originalUrl: url,
    };
  }
}
