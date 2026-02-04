'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type IngredientFormData = {
  name: string;
  category: string;
  eNumber: string;
  allergens: string[];
  details: string;
};

export default function EditIngredientPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allergensInput, setAllergensInput] = useState('');
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    category: '',
    eNumber: '',
    allergens: [],
    details: '',
  });

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await fetch(`/api/ingredients/${params.id}`);
        if (response.ok) {
          const ingredient = await response.json();
          setFormData({
            name: ingredient.name || '',
            category: ingredient.category || '',
            eNumber: ingredient.eNumber || '',
            allergens: ingredient.allergens || [],
            details: ingredient.details || '',
          });
          setAllergensInput((ingredient.allergens || []).join(', '));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllergensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAllergensInput(value);
    const allergensArray = value.split(',').map(a => a.trim()).filter(a => a !== '');
    setFormData(prev => ({
      ...prev,
      allergens: allergensArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/ingredients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/dashboard/ingredients/${params.id}`);
      } else {
        const error = await response.json();
        console.error('Failed to update ingredient:', error);
        alert('Failed to update ingredient. Please try again.');
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push(`/dashboard/ingredients/${params.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Ingredient Details
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Ingredient</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter ingredient name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Preservative, Colorant, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eNumber">E-Number</Label>
              <Input
                id="eNumber"
                name="eNumber"
                value={formData.eNumber}
                onChange={handleChange}
                placeholder="e.g., E100, E200, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens (comma-separated)</Label>
              <Input
                id="allergens"
                name="allergens"
                value={allergensInput}
                onChange={handleAllergensChange}
                placeholder="e.g., Gluten, Milk, Eggs"
              />
              <p className="text-sm text-gray-500">
                Separate multiple allergens with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional details about the ingredient"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/ingredients/${params.id}`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
