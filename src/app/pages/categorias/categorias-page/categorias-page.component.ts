import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-categorias-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.css',
})
export class CategoriasPageComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private garmentService = inject(GarmentService);

  public categories = this.categoryService.allCategories;
  public isLoading = signal(true);
  public errorMessage = signal('');

  public filterSearch = signal('');

  public filteredCategories = computed(() =>
    this.categories()
      .filter((category) => {
        const search = this.filterSearch().trim().toLowerCase();
        if (!search) return true;

        const matchesName = category.name.toLowerCase().includes(search);
        const matchesDescription = category.description
          .toLowerCase()
          .includes(search);

        return matchesName || matchesDescription;
      })
      .map((category) => ({
        ...category,
        garments: this.categoryService.getGarmentsForCategory(category),
      })),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.loadCategories().subscribe({
      next: () => {
        this.garmentService.loadGarments().subscribe({
          next: () => this.isLoading.set(false),
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(this.getErrorMessage(error));
          },
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  updateFilterSearch(event: Event): void {
    this.filterSearch.set((event.target as HTMLInputElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudieron cargar las categorías.';
  }
}
