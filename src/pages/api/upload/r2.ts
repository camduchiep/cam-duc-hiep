import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy file tải lên.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clean filename & determine MIME
    const ext = (file.name.split('.').pop() || '').toLowerCase() || (file.type?.includes('video') ? 'mp4' : 'png');
    const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}_${cleanBaseName}.${ext}`;

    const mimeType = file.type || (
      ext === 'mp4' ? 'video/mp4' :
      ext === 'webm' ? 'video/webm' :
      ext === 'mov' ? 'video/quicktime' :
      ext === 'gif' ? 'image/gif' :
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
      ext === 'webp' ? 'image/webp' :
      ext === 'svg' ? 'image/svg+xml' : 'image/png'
    );

    const bucket = locals.runtime?.env?.BUCKET;

    // 1. Upload to Cloudflare R2 if available
    if (bucket) {
      const arrayBuffer = await file.arrayBuffer();
      await bucket.put(filename, arrayBuffer, {
        httpMetadata: {
          contentType: mimeType
        }
      });
      const publicUrl = `https://storage.hiepcm.com/${filename}`;
      return new Response(JSON.stringify({ success: true, url: publicUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Upload to local public/images/uploads/ in Node.js dev environment
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { writeFile, mkdir } = await import('node:fs/promises');
        const { join } = await import('node:path');
        const uploadDir = join(process.cwd(), 'public/images/uploads');
        await mkdir(uploadDir, { recursive: true });
        const filePath = join(uploadDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);
        return new Response(JSON.stringify({ success: true, url: `/images/uploads/${filename}` }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fsErr) {
        console.warn('Local FS upload error:', fsErr);
      }
    }

    // 3. Fallback: Base64 Data URL
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return new Response(JSON.stringify({ success: true, url: dataUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Lỗi xử lý tải file lên R2' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
