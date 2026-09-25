import type { APIRoute } from 'astro';
import type { FilmItem } from '../../../lib/films';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: FilmItem = await request.json();

    if (!body || !body.slug || !body.title) {
      return new Response(JSON.stringify({ error: 'Vui lòng cung cấp đầy đủ Tiêu đề và Slug.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = locals.runtime?.env?.DB;

    // 1. Save to Cloudflare D1 if available
    if (db) {
      try {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS films (\n            slug TEXT PRIMARY KEY,\n            title TEXT NOT NULL,\n            list_title TEXT,\n            list_subtitle TEXT,\n            format TEXT,\n            thumbnail TEXT,\n            content_html TEXT,\n            credits_json TEXT,\n            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n          );
        `).run();

        // Safely add columns if they were created without them previously
        try {
          await db.prepare('ALTER TABLE films ADD COLUMN thumbnail TEXT').run();
        } catch {}
        try {
          await db.prepare('ALTER TABLE films ADD COLUMN list_title TEXT').run();
        } catch {}
        try {
          await db.prepare('ALTER TABLE films ADD COLUMN list_subtitle TEXT').run();
        } catch {}

        await db.prepare(`
          INSERT INTO films (slug, title, list_title, list_subtitle, format, thumbnail, content_html, credits_json, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(slug) DO UPDATE SET
            title = excluded.title,
            list_title = excluded.list_title,
            list_subtitle = excluded.list_subtitle,
            format = excluded.format,
            thumbnail = excluded.thumbnail,
            content_html = excluded.content_html,
            credits_json = excluded.credits_json,
            updated_at = CURRENT_TIMESTAMP
        `).bind(
          body.slug,
          body.title,
          body.listTitle || '',
          body.listSubtitle || '',
          body.format || '',
          body.thumbnail || '',
          body.content_html || '',
          JSON.stringify(body.credits || [])
        ).run();
      } catch (dbErr) {
        console.error('D1 save error for films:', dbErr);
      }
    }

    // 2. Save to local src/data/films.json in Node.js dev environment
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { readFile, writeFile } = await import('node:fs/promises');
        const { join } = await import('node:path');
        const filePath = join(process.cwd(), 'src/data/films.json');
        
        let existingFilms: FilmItem[] = [];
        try {
          const content = await readFile(filePath, 'utf-8');
          existingFilms = JSON.parse(content);
        } catch {}

        const index = existingFilms.findIndex(f => f.slug === body.slug);
        if (index >= 0) {
          existingFilms[index] = {
            ...existingFilms[index],
            ...body
          };
        } else {
          existingFilms.push(body);
        }

        await writeFile(filePath, JSON.stringify(existingFilms, null, 2), 'utf-8');
      } catch (fsErr) {
        console.warn('FS save error for films.json:', fsErr);
      }
    }

    return new Response(JSON.stringify({ success: true, film: body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi lưu thông tin phim' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
