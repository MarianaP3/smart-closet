import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-inventory-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './garment-page.component.html',
  styleUrl: './garment-page.component.css',
})
export class InventoryPageComponent implements OnInit {
  private garmentService = inject(GarmentService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  public garments = this.garmentService.allGarments;
  public categories = this.categoryService.allCategories;
  public isLoading = signal(true);
  public errorMessage = signal('');

  public filterName = signal('');
  public filterCategoryId = signal('');
  public filterColor = signal('');
  public filterSize = signal('');

  public colors = computed(() =>
    [...new Set(this.garments().map((g) => g.color))].sort(),
  );
  public sizes = computed(() =>
    [...new Set(this.garments().map((g) => g.size))].sort(),
  );

  public filteredGarments = computed(() =>
    this.garments().filter((garment) => {
      const name = this.filterName().trim().toLowerCase();
      if (name && !garment.name.toLowerCase().includes(name)) return false;
      if (
        this.filterCategoryId() &&
        garment.categoryId !== this.filterCategoryId()
      )
        return false;
      if (this.filterColor() && garment.color !== this.filterColor())
        return false;
      if (this.filterSize() && garment.size !== this.filterSize()) return false;
      return true;
    }),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
    this.categoryService.loadCategories().subscribe();
    this.loadGarments();
  }

  loadGarments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.garmentService.loadGarments().subscribe({
      next: () => this.isLoading.set(false),
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  updateFilterName(event: Event): void {
    this.filterName.set((event.target as HTMLInputElement).value);
  }

  updateFilterCategory(event: Event): void {
    this.filterCategoryId.set((event.target as HTMLSelectElement).value);
  }

  updateFilterColor(event: Event): void {
    this.filterColor.set((event.target as HTMLSelectElement).value);
  }

  updateFilterSize(event: Event): void {
    this.filterSize.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterName.set('');
    this.filterCategoryId.set('');
    this.filterColor.set('');
    this.filterSize.set('');
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudo cargar tu inventario.';
  }
}
