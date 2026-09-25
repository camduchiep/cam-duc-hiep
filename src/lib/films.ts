import defaultFilms from '../data/films.json';

export interface FilmCredit {
  role: string;
  name: string;
}

export interface FilmItem {
  slug: string;
  title: string;
  format: string;
  content_html: string;
  credits: FilmCredit[];
}

export async function getFilms(db?: any): Promise<FilmItem[]> {
  if (db) {
    try {
      const { results } = await db.prepare(
        'SELECT slug, title, format, content_html, credits_json FROM films ORDER BY rowid ASC'
      ).all();
      if (results && results.length > 0) {
        return results.map((r: any) => ({
          slug: r.slug,
          title: r.title,
          format: r.format || '',
          content_html: r.content_html || '',
          credits: r.credits_json ? (typeof r.credits_json === 'string' ? JSON.parse(r.credits_json) : r.credits_json) : []
        }));
      }
    } catch (e) {
      console.warn('Error querying films from DB:', e);
    }
  }

  return defaultFilms as FilmItem[];
}

export async function getFilmBySlug(slug: string, db?: any): Promise<FilmItem | undefined> {
  const allFilms = await getFilms(db);
  return allFilms.find((f) => f.slug === slug);
}
