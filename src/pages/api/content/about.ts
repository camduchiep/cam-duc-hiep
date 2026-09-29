import type { APIRoute } from 'astro';
import { getAboutData, type AboutData } from '../../../lib/content';
import { verifySession } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime?.env?.DB;
  const data = await getAboutData(db);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const authSecret = locals.runtime?.env?.AUTH_SECRET;
  if (!(await verifySession(cookies.get('admin_session')?.value, authSecret))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body: AboutData = await request.json();

    if (!body || (!body.content_html && !Array.isArray(body.bioParagraphs))) {
      return new Response(JSON.stringify({ error: 'Dữ liệu không hợp lệ.' }), {
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
          VALUES ('about', 'About', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(slug) DO UPDATE SET
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP
        `).bind(jsonString).run();
      } catch (dbErr) {
        console.error('D1 save error for about:', dbErr);
        return new Response(JSON.stringify({ error: 'Không thể lưu dữ liệu About vào cơ sở dữ liệu.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 2. Save to local file in development / Node.js
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { writeFile } = await import('node:fs/promises');
        const { join } = await import('node:path');
        const filePath = join(process.cwd(), 'src/data/about.json');
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
