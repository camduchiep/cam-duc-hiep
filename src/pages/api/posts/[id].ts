import type { APIRoute } from 'astro';
import { verifySession } from '../../../lib/auth';

export const prerender = false;

// Update post
export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  const sessionCookie = cookies.get('admin_session')?.value;
  const isAuth = await verifySession(sessionCookie);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: 'Không có quyền truy cập.' }), { status: 401 });
  }

  const { id } = params;
  const formData = await request.formData();
  const title = formData.get('title')?.toString().trim();
  const excerpt = formData.get('excerpt')?.toString().trim() || '';
  const content = formData.get('content')?.toString() || '';
  const coverImage = formData.get('cover_image')?.toString().trim() || '';
  const status = formData.get('status')?.toString() === 'draft' ? 'draft' : 'published';

  if (!title) {
    return new Response(JSON.stringify({ error: 'Tiêu đề không được để trống.' }), { status: 400 });
  }

  const db = locals.runtime?.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Chưa kết nối Cloudflare D1.' }), { status: 500 });
  }

  try {
    await db.prepare(
      `UPDATE posts 
       SET title = ?, excerpt = ?, content = ?, cover_image = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(title, excerpt, content, coverImage, status, id).run();

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi cập nhật bài viết.' }), { status: 500 });
  }
};

// Delete post
export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const sessionCookie = cookies.get('admin_session')?.value;
  const isAuth = await verifySession(sessionCookie);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: 'Không có quyền truy cập.' }), { status: 401 });
  }

  const { id } = params;
  const db = locals.runtime?.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Chưa kết nối Cloudflare D1.' }), { status: 500 });
  }

  try {
    await db.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi xóa bài viết.' }), { status: 500 });
  }
};
