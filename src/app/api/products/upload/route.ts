import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Service role key configured:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `product-${timestamp}-${randomString}.${extension}`;

    console.log('Generated filename:', fileName);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Attempting upload to Supabase...');

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      
      // Provide helpful error message
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          { 
            message: 'Storage bucket not found. Please create a "products" bucket in Supabase Storage.',
            details: uploadError.message,
          },
          { status: 500 },
        );
      }
      
      return NextResponse.json(
        { message: `Upload failed: ${uploadError.message}` },
        { status: 500 },
      );
    }

    console.log('Upload successful, getting public URL...');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error?.message || 'Upload failed', details: error?.toString() },
      { status: 500 },
    );
  }
}