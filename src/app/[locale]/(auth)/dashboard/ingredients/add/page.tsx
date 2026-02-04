'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allWineIngredients } from '@/utils/ProductConstants';

export default function AddIngredientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    eNumber: '',
    allergens: [] as string[],
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        console.error('Failed to create ingredient:', error.message);
      }
    } catch (error) {
      console.error('Error creating ingredient:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'General',
    'Gases and packaging gases',
    'Acidity regulators',
    'Stabilising agents',
    'Preservatives and antioxidants',
    'Processing aids',
  ];

  const allergens = ['Egg', 'Milk', 'Sulphites', 'Lysozyme'];

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Ingredient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ingredient Name *</Label>
              <Select
                value={formData.name}
                onValueChange={value => handleSelectChange('name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {allWineIngredients.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={value => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eNumber">E-Number</Label>
              <Input
                id="eNumber"
                name="eNumber"
                value={formData.eNumber}
                onChange={handleChange}
                placeholder="e.g., E220"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens</Label>
              <div className="flex flex-wrap gap-6">
                {allergens.map(allergen => (
                  <label key={allergen} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.allergens.includes(allergen)}
                      onChange={() => handleAllergenToggle(allergen)}
                      className="size-4"
                    />
                    <span>{allergen}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Enter any additional information about the ingredient"
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ingredient'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
