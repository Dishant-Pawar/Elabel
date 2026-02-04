import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ingredients, insertIngredientSchema } from '@/models/Schema';
import { createServerSupabaseClient } from '@/libs/supabase/server';

export async function GET() {
  try {
    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only fetch ingredients for the current user
    const userIngredients = await db
      .select()
      .from(ingredients)
      .where(eq(ingredients.userId, user.id));
    
    return NextResponse.json(userIngredients);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
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
    const validatedData = insertIngredientSchema.parse(body);

    // Add the user ID to the ingredient data
    const newIngredient = await db
      .insert(ingredients)
      .values({ ...validatedData, userId: user.id })
      .returning();
    
    return NextResponse.json(newIngredient[0], { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 400 });
  }
}
