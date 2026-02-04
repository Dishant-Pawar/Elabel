'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Ingredient } from '@/models/Schema';

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) {
    return null;
  }
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'warning' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      variant === 'warning' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
    }`}
  >
    {children}
  </span>
);

export default function IngredientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await fetch(`/api/ingredients/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setIngredient(data);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching ingredient:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchIngredient();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/ingredients/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        console.error('Failed to delete ingredient:', error.message);
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Ingredient not found</h2>
          <p className="mt-2 text-gray-600">The ingredient you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ingredient Details</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/ingredients/${ingredient.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{ingredient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Category" value={ingredient.category} />
          <InfoRow label="E-Number" value={ingredient.eNumber} />
          
          {ingredient.allergens && ingredient.allergens.length > 0 && (
            <div className="border-b py-2">
              <span className="text-gray-600">Allergens</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ingredient.allergens.map((allergen, index) => (
                  <Badge key={index} variant="warning">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {ingredient.details && (
            <div className="border-b py-2">
              <span className="text-gray-600">Details</span>
              <p className="mt-2 text-gray-800">{ingredient.details}</p>
            </div>
          )}

          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Created At</span>
            <span className="font-medium">
              {ingredient.createdAt ? new Date(ingredient.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">
              {ingredient.updatedAt ? new Date(ingredient.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirm Deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete "{ingredient.name}"? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
