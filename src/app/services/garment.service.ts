import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Garment } from '../interfaces/garment.interface';

@Injectable({
  providedIn: 'root',
})
export class GarmentService {
  private apiUrl = 'http://localhost:8080/api/garment';
  private garments = signal<Garment[]>([]);

  readonly allGarments = this.garments.asReadonly();

  constructor(private http: HttpClient) {}

  loadGarments(): Observable<Garment[]> {
    return this.http.get<Garment[]>(this.apiUrl).pipe(
      tap((garments) => this.garments.set(garments)),
    );
  }

  getById(id: string): Garment | undefined {
    return this.garments().find((garment) => garment.id === id);
  }

  getByIdFromApi(id: string): Observable<Garment> {
    return this.http.get<Garment>(`${this.apiUrl}/${id}`).pipe(
      tap((garment) => {
        const exists = this.garments().some((item) => item.id === garment.id);

        if (exists) {
          this.garments.update((items) =>
            items.map((item) => (item.id === garment.id ? garment : item)),
          );
        } else {
          this.garments.update((items) => [...items, garment]);
        }
      }),
    );
  }

  addGarment(garment: Omit<Garment, 'id'>): Observable<Garment> {
    return this.http.post<Garment>(this.apiUrl, garment).pipe(
      tap((created) =>
        this.garments.update((garments) => [...garments, created]),
      ),
    );
  }

  updateGarment(
    id: string,
    changes: Omit<Garment, 'id'>,
  ): Observable<Garment> {
    return this.http.put<Garment>(`${this.apiUrl}/${id}`, changes).pipe(
      tap((updated) =>
        this.garments.update((garments) =>
          garments.map((garment) => (garment.id === id ? updated : garment)),
        ),
      ),
    );
  }

  syncTypeFromCategory(categoryId: string, typeName: string): void {
    this.garments.update((garments) =>
      garments.map((garment) =>
        garment.categoryId === categoryId
          ? { ...garment, type: typeName }
          : garment,
      ),
    );
  }

  deleteGarment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.garments.update((garments) =>
          garments.filter((garment) => garment.id !== id),
        ),
      ),
    );
  }

  clearGarments(): void {
    this.garments.set([]);
  }
}
