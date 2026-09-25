import defaultFilms from '../data/films.json';

export interface FilmCredit {
  role: string;
  name: string;
}

export interface FilmItem {
  slug: string;
  title: string;
  format: string;
  thumbnail?: string;
  category?: string;
  year?: string;
  content_html: string;
  credits: FilmCredit[];
}

export async function getFilms(db?: any): Promise<FilmItem[]> {
  if (db) {
    try {
      // Ensure thumbnail column exists if table was created previously without it
      try {
        await db.prepare('ALTER TABLE films ADD COLUMN thumbnail TEXT').run();
      } catch {}

      const { results } = await db.prepare(
        'SELECT slug, title, format, thumbnail, content_html, credits_json FROM films ORDER BY rowid ASC'
      ).all();
      if (results && results.length > 0) {
        return results.map((r: any) => ({
          slug: r.slug,
          title: r.title,
          format: r.format || '',
          thumbnail: r.thumbnail || '',
          category: r.category || '',
          year: r.year || '',
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
