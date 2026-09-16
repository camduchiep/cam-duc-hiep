import type { APIRoute } from 'astro';
import { slugify } from '../../../lib/slug';
import { verifySession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  // Check auth
  const sessionCookie = cookies.get('admin_session')?.value;
  const isAuth = await verifySession(sessionCookie);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: 'Bạn không có quyền thực hiện thao tác này.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const formData = await request.formData();
  const title = formData.get('title')?.toString().trim();
  const excerpt = formData.get('excerpt')?.toString().trim() || '';
  const content = formData.get('content')?.toString() || '';
  const coverImage = formData.get('cover_image')?.toString().trim() || '';
  const status = formData.get('status')?.toString() === 'draft' ? 'draft' : 'published';

  if (!title) {
    return new Response(JSON.stringify({ error: 'Tiêu đề không được để trống.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const db = locals.runtime?.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Không tìm thấy kết nối Cloudflare D1 Database (DB binding).' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await db.prepare(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(title, slug, excerpt, content, coverImage, status).run();

    return new Response(JSON.stringify({ success: true, slug, id: result.meta?.last_row_id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi lưu bài viết vào D1.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
