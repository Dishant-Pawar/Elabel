import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ingredients, insertIngredientSchema } from '@/models/Schema';
import { createServerSupabaseClient } from '@/libs/supabase/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only fetch ingredient if it belongs to the current user
    const ingredient = await db
      .select()
      .from(ingredients)
      .where(and(eq(ingredients.id, id), eq(ingredients.userId, user.id)));

    if (ingredient.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    return NextResponse.json(ingredient[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ingredient', stack: error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertIngredientSchema.partial().parse(body);

    // Only update ingredient if it belongs to the current user
    const updatedIngredient = await db
      .update(ingredients)
      .set(validatedData)
      .where(and(eq(ingredients.id, id), eq(ingredients.userId, user.id)))
      .returning();

    if (updatedIngredient.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedIngredient[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ingredient', stack: error }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the current user from Supabase auth
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only delete ingredient if it belongs to the current user
    const deletedIngredient = await db
      .delete(ingredients)
      .where(and(eq(ingredients.id, id), eq(ingredients.userId, user.id)))
      .returning();

    if (deletedIngredient.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(deletedIngredient[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ingredient', stack: error }, { status: 500 });
  }
}
