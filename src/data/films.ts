import filmsJson from './films.json';

export interface Credit {
  role: string;
  name?: string;
  names?: string[];
}

export interface Film {
  slug: string;
  title: string;
  listTitle?: string;
  listSubtitle?: string;
  originalTitle?: string;
  displayTitle?: string;
  category?: string;
  year?: string;
  duration?: string;
  format: string;
  synopsis?: string;
  thumbnail?: string;
  stills?: string[];
  content_html?: string;
  credits: Credit[];
}

export const films: Film[] = filmsJson.map((f: any) => ({
  slug: f.slug,
  title: f.title,
  listTitle: f.listTitle || f.title.split('|')[0].trim(),
  listSubtitle: f.listSubtitle || f.format || '',
  originalTitle: f.originalTitle || '',
  displayTitle: f.title,
  category: f.category || '',
  year: f.year || '',
  duration: f.duration || '',
  format: f.format || '',
  synopsis: f.synopsis || '',
  thumbnail: f.thumbnail || '',
  stills: f.stills || [],
  content_html: f.content_html || '',
  credits: f.credits || []
}));
