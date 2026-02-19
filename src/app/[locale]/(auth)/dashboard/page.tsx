'use client';

import { ArrowRight, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Ingredient, Product } from '@/models/Schema';

type ViewMode = 'products' | 'ingredients' | null;

const PlaceholderImage = () => (
  <div className="flex size-24 items-center justify-center rounded-lg bg-gray-100">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-12 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  </div>
);

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ingredientsResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/ingredients'),
        ]);
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
        
        if (ingredientsResponse.ok) {
          const ingredientsData = await ingredientsResponse.json();
          setIngredients(ingredientsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeletingId(productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        const error = await response.json();
        console.error('Failed to delete product:', error.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteIngredient = async (ingredientId: number) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) {
      return;
    }

    setDeletingId(ingredientId);
    try {
      const response = await fetch(`/api/ingredients/${ingredientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIngredients(ingredients.filter(i => i.id !== ingredientId));
      } else {
        const error = await response.json();
        console.error('Failed to delete ingredient:', error.message);
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="block cursor-pointer"
          onClick={() => {
            setViewMode('products');
            setSearchQuery('');
          }}
          onDoubleClick={() => window.location.href = '/dashboard/products/add'}
        >
          <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground transition-transform hover:scale-[1.02]">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Star className="size-5" />
                <CardTitle className="text-lg font-medium">Add Products</CardTitle>
              </div>
              <CardDescription className="text-primary-foreground/80">
                Quickly add products and generate QR
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center text-sm font-medium">
                Go <ArrowRight className="ml-1 size-4" />
              </div>
            </CardFooter>
            {/* Decorative gradient/shape */}
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-3xl" />
          </Card>
        </div>

        <div
          className="block cursor-pointer"
          onClick={() => {
            setViewMode('ingredients');
            setSearchQuery('');
          }}
          onDoubleClick={() => window.location.href = '/dashboard/ingredients/add'}
        >
          <Card className="relative overflow-hidden border-none bg-[#818cf8] text-white transition-transform hover:scale-[1.02]">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Star className="size-5" />
                <CardTitle className="text-lg font-medium">Add Ingredients</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Manage your ingredients inventory
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center text-sm font-medium">
                Go <ArrowRight className="ml-1 size-4" />
              </div>
            </CardFooter>
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-3xl" />
          </Card>
        </div>
      </div>

      {viewMode === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex gap-2">
              <Link href="/dashboard/products/add">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Add Product
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setViewMode(null)}>
                Clear View
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex w-full items-center justify-center bg-muted p-4 sm:w-48">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <PlaceholderImage />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <p className="line-clamp-2 text-muted-foreground">
                        {product.brand || 'No brand specified'}
                        {product.vintage && ` • ${product.vintage}`}
                        {product.wineType && ` • ${product.wineType}`}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-1 size-3" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/dashboard/products/${product.id}/qr`}>
                        <Button variant="ghost" size="sm">
                          QR Code
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="mr-1 size-3" />
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Plus className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="mb-4 text-muted-foreground">
              Get started by adding your first product.
            </p>
            <Link href="/dashboard/products/add">
              <Button>Add Product</Button>
            </Link>
          </div>
        )}
        </div>
      )}

      {viewMode === 'ingredients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Ingredients</h2>
            <div className="flex gap-2">
              <Link href="/dashboard/ingredients/add">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Add Ingredient
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setViewMode(null)}>
                Clear View
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredIngredients.length > 0 ? (
            <div className="grid gap-4">
              {filteredIngredients.map((ingredient) => (
                <Card key={ingredient.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="flex flex-col p-6">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{ingredient.name}</CardTitle>
                      <p className="line-clamp-2 text-muted-foreground">
                        {ingredient.category && `Category: ${ingredient.category}`}
                        {ingredient.eNumber && ` • E-Number: ${ingredient.eNumber}`}
                      </p>
                      {ingredient.allergens && ingredient.allergens.length > 0 && (
                        <p className="text-sm text-orange-600">
                          Allergens: {ingredient.allergens.join(', ')}
                        </p>
                      )}
                      {ingredient.details && (
                        <p className="text-sm text-muted-foreground">{ingredient.details}</p>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link href={`/dashboard/ingredients/${ingredient.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      <Link href={`/dashboard/ingredients/${ingredient.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-1 size-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteIngredient(ingredient.id)}
                        disabled={deletingId === ingredient.id}
                      >
                        <Trash2 className="mr-1 size-3" />
                        {deletingId === ingredient.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Plus className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No ingredients found</h3>
              <p className="mb-4 text-muted-foreground">
                Get started by adding your first ingredient.
              </p>
              <Link href="/dashboard/ingredients/add">
                <Button>Add Ingredient</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
