import defaultFilms from '../data/films.json';

export interface FilmCredit {
  role: string;
  name: string;
}

export interface FilmItem {
  slug: string;
  title: string;
  listTitle?: string;
  listSubtitle?: string;
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
      // Ensure columns exist if table was created previously without them
      try {
        await db.prepare('ALTER TABLE films ADD COLUMN thumbnail TEXT').run();
      } catch {}
      try {
        await db.prepare('ALTER TABLE films ADD COLUMN list_title TEXT').run();
      } catch {}
      try {
        await db.prepare('ALTER TABLE films ADD COLUMN list_subtitle TEXT').run();
      } catch {}

      const { results } = await db.prepare(
        'SELECT slug, title, list_title, list_subtitle, format, thumbnail, content_html, credits_json FROM films ORDER BY rowid ASC'
      ).all();
      if (results && results.length > 0) {
        return results.map((r: any) => ({
          slug: r.slug,
          title: r.title,
          listTitle: r.list_title || r.listTitle || r.title.split('|')[0].trim(),
          listSubtitle: r.list_subtitle || r.listSubtitle || r.format || '',
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

  return (defaultFilms as any[]).map((f: any) => ({
    ...f,
    listTitle: f.listTitle || f.title.split('|')[0].trim(),
    listSubtitle: f.listSubtitle || f.format || ''
  })) as FilmItem[];
}

export async function getFilmBySlug(slug: string, db?: any): Promise<FilmItem | undefined> {
  const allFilms = await getFilms(db);
  return allFilms.find((f) => f.slug === slug);
}
