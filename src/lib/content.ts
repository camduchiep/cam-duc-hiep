import defaultAbout from '../data/about.json';
import defaultCV from '../data/cv.json';

export interface AboutData {
  content_html?: string;
  bioParagraphs?: string[];
  location?: string;
  email?: string;
  phone?: string;
}

export interface CVItem {
  title: string;
  details: string;
}

export interface CVEducation {
  degree: string;
  institution: string;
}

export interface CVData {
  content_html?: string;
  grants?: CVItem[];
  workshops?: CVItem[];
  education?: CVEducation[];
  screenings?: string[];
}

export async function getAboutData(db?: any): Promise<AboutData> {
  if (db) {
    try {
      const row = await db.prepare("SELECT data FROM pages WHERE slug = 'about'").first();
      if (row?.data) {
        return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      }
    } catch (e) {
      console.warn('Error querying about page from DB:', e);
    }
  }
  return defaultAbout as AboutData;
}

export async function getCVData(db?: any): Promise<CVData> {
  if (db) {
    try {
      const row = await db.prepare("SELECT data FROM pages WHERE slug = 'cv'").first();
      if (row?.data) {
        return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      }
    } catch (e) {
      console.warn('Error querying cv page from DB:', e);
    }
  }
  return defaultCV as CVData;
}
