import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Wardrobe } from '../interfaces/wardrobe.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

@Injectable({
  providedIn: 'root',
})
export class WardrobeService {
  private apiUrl = 'http://localhost:8080/api/armarios';
  private garmentService = inject(GarmentService);
  private wardrobes = signal<Wardrobe[]>([]);

  readonly allWardrobes = this.wardrobes.asReadonly();

  constructor(private http: HttpClient) {}

  loadWardrobes(): Observable<Wardrobe[]> {
    return this.http.get<Wardrobe[]>(this.apiUrl).pipe(
      tap((wardrobes) => this.wardrobes.set(wardrobes)),
    );
  }

  getById(id: string): Wardrobe | undefined {
    return this.wardrobes().find((wardrobe) => wardrobe.id === id);
  }

  getByIdFromApi(id: string): Observable<Wardrobe> {
    return this.http.get<Wardrobe>(`${this.apiUrl}/${id}`).pipe(
      tap((wardrobe) => {
        const exists = this.wardrobes().some((item) => item.id === wardrobe.id);

        if (exists) {
          this.wardrobes.update((items) =>
            items.map((item) => (item.id === wardrobe.id ? wardrobe : item)),
          );
        } else {
          this.wardrobes.update((items) => [...items, wardrobe]);
        }
      }),
    );
  }

  getGarmentsForWardrobe(wardrobe: Wardrobe): Garment[] {
    return wardrobe.garmentIds
      .map((id) => this.garmentService.getById(id))
      .filter((garment): garment is Garment => garment !== undefined);
  }

  addWardrobe(wardrobe: Omit<Wardrobe, 'id'>): Observable<Wardrobe> {
    return this.http.post<Wardrobe>(this.apiUrl, wardrobe).pipe(
      tap((created) =>
        this.wardrobes.update((wardrobes) => [...wardrobes, created]),
      ),
    );
  }

  updateWardrobe(
    id: string,
    changes: Omit<Wardrobe, 'id'>,
  ): Observable<Wardrobe> {
    return this.http.put<Wardrobe>(`${this.apiUrl}/${id}`, changes).pipe(
      tap((updated) =>
        this.wardrobes.update((wardrobes) =>
          wardrobes.map((wardrobe) =>
            wardrobe.id === id ? updated : wardrobe,
          ),
        ),
      ),
    );
  }

  deleteWardrobe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.wardrobes.update((wardrobes) =>
          wardrobes.filter((wardrobe) => wardrobe.id !== id),
        ),
      ),
    );
  }

  clearWardrobes(): void {
    this.wardrobes.set([]);
  }
}
