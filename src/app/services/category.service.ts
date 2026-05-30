import { Injectable, inject, signal } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Tops',
    description: 'Blusas, camisetas y tops',
  },
  {
    id: '2',
    name: 'Bottoms',
    description: 'Pantalones, faldas y shorts',
  },
  {
    id: '3',
    name: 'Shoes',
    description: 'Calzado de todo tipo',
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Bolsos, joyería y complementos',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private garmentService = inject(GarmentService);
  private categories = signal<Category[]>(INITIAL_CATEGORIES);

  readonly allCategories = this.categories.asReadonly();

  getById(id: string): Category | undefined {
    return this.categories().find((category) => category.id === id);
  }

  getGarmentsForCategory(category: Category): Garment[] {
    return this.garmentService
      .allGarments()
      .filter((garment) => garment.categoryId === category.id);
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const nextId = String(
      Math.max(0, ...this.categories().map((item) => Number(item.id))) + 1,
    );

    this.categories.update((categories) => [
      ...categories,
      { id: nextId, ...category },
    ]);
  }

  updateCategory(id: string, changes: Omit<Category, 'id'>): void {
    const previous = this.getById(id);

    this.categories.update((categories) =>
      categories.map((category) =>
        category.id === id ? { id, ...changes } : category,
      ),
    );

    if (previous && previous.name !== changes.name.trim()) {
      this.garmentService.syncTypeFromCategory(id, changes.name.trim());
    }
  }

  deleteCategory(id: string): boolean {
    if (this.getGarmentsForCategory({ id, name: '', description: '' }).length > 0) {
      return false;
    }

    this.categories.update((categories) =>
      categories.filter((category) => category.id !== id),
    );

    return true;
  }
}
