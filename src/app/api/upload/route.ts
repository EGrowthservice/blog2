import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { supabaseAdmin, SUPABASE_BUCKET } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAuth(req);
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'Vui lòng chọn một tệp hình ảnh để tải lên.' },
        { status: 400 }
      );
    }

    // Validate MIME type
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];

    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Định dạng tệp không hợp lệ. Vui lòng chỉ tải lên ảnh JPG, PNG, WEBP, GIF, SVG hoặc AVIF.' },
        { status: 400 }
      );
    }

    // Check size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Kích thước ảnh vượt quá giới hạn 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'image.png';
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const filePath = `${folder}/${timestamp}-${randomSuffix}-${sanitizedName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Lỗi Supabase Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Retrieve public URL
    const { data: publicData } = supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: uploadData.path,
      size: file.size,
      name: originalName,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Upload processing error:', err);
    return NextResponse.json(
      { error: err.message || 'Đã xảy ra lỗi trong quá trình tải lên máy chủ.' },
      { status: 500 }
    );
  }
}
