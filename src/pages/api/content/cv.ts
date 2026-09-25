import type { APIRoute } from 'astro';
import { getCVData, type CVData } from '../../../lib/content';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime?.env?.DB;
  const data = await getCVData(db);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: CVData = await request.json();

    if (!body || (!body.content_html && (!Array.isArray(body.grants) || !Array.isArray(body.workshops)))) {
      return new Response(JSON.stringify({ error: 'Dữ liệu CV không hợp lệ.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const jsonString = JSON.stringify(body, null, 2);
    const db = locals.runtime?.env?.DB;

    // 1. Save to Cloudflare D1 if available
    if (db) {
      try {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS pages (
            slug TEXT PRIMARY KEY,
            title TEXT,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `).run();

        await db.prepare(`
          INSERT INTO pages (slug, title, data, updated_at)
          VALUES ('cv', 'CV', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(slug) DO UPDATE SET
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP
        `).bind(jsonString).run();
      } catch (dbErr) {
        console.error('D1 save error for cv:', dbErr);
      }
    }

    // 2. Save to local file in development / Node.js
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { writeFile } = await import('node:fs/promises');
        const { join } = await import('node:path');
        const filePath = join(process.cwd(), 'src/data/cv.json');
        await writeFile(filePath, jsonString, 'utf-8');
      } catch (fsErr) {
        console.warn('FS save skipped or failed:', fsErr);
      }
    }

    return new Response(JSON.stringify({ success: true, data: body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi xử lý máy chủ' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
