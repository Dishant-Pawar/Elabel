import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { insertProductSchema, products } from '@/models/Schema';
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

    // Only fetch product if it belongs to the current user
    const product = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.userId, user.id)));

    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product', stack: error }, { status: 500 });
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
    const validatedData = insertProductSchema.partial().parse(body);

    // Only update product if it belongs to the current user
    const updatedProduct = await db
      .update(products)
      .set(validatedData)
      .where(and(eq(products.id, id), eq(products.userId, user.id)))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product', stack: error }, { status: 400 });
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

    // Only delete product if it belongs to the current user
    const deletedProduct = await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.userId, user.id)))
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(deletedProduct[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product', stack: error }, { status: 500 });
  }
}
