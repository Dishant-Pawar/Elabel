import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { insertProductSchema, products } from '@/models/Schema';
import { createServerSupabaseClient } from '@/libs/supabase/server';

export async function GET() {
  try {
    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only fetch products for the current user
    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.userId, user.id));
    
    return NextResponse.json(userProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products', stack: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertProductSchema.parse(body);

    // Add the user ID to the product data
    const newProduct = await db
      .insert(products)
      .values({ ...validatedData, userId: user.id })
      .returning();
    
    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product', stack: error }, { status: 400 });
  }
}
