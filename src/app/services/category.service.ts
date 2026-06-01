import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categorias';
  private garmentService = inject(GarmentService);
  private categories = signal<Category[]>([]);

  readonly allCategories = this.categories.asReadonly();

  constructor(private http: HttpClient) {}

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((categories) => this.categories.set(categories)),
    );
  }

  getById(id: string): Category | undefined {
    return this.categories().find((category) => category.id === id);
  }

  getByIdFromApi(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      tap((category) => {
        const exists = this.categories().some((item) => item.id === category.id);

        if (exists) {
          this.categories.update((items) =>
            items.map((item) => (item.id === category.id ? category : item)),
          );
        } else {
          this.categories.update((items) => [...items, category]);
        }
      }),
    );
  }

  getGarmentsForCategory(category: Category): Garment[] {
    return this.garmentService
      .allGarments()
      .filter((garment) => garment.categoryId === category.id);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap((created) =>
        this.categories.update((categories) => [...categories, created]),
      ),
    );
  }

  updateCategory(
    id: string,
    changes: Omit<Category, 'id'>,
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, changes).pipe(
      tap((updated) => {
        this.categories.update((categories) =>
          categories.map((category) =>
            category.id === id ? updated : category,
          ),
        );
        this.garmentService.syncTypeFromCategory(id, updated.name);
      }),
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.categories.update((categories) =>
          categories.filter((category) => category.id !== id),
        ),
      ),
    );
  }

  clearCategories(): void {
    this.categories.set([]);
  }
}
