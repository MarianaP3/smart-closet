import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { GarmentService } from '../../../services/garment.service';
import { WardrobeService } from '../../../services/wardrobe.service';

@Component({
  selector: 'app-armarios-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './armarios-page.component.html',
  styleUrl: './armarios-page.component.css',
})
export class ArmariosPageComponent implements OnInit {
  private authService = inject(AuthService);
  private garmentService = inject(GarmentService);
  private wardrobeService = inject(WardrobeService);

  public wardrobes = this.wardrobeService.allWardrobes;
  public isLoading = signal(true);
  public errorMessage = signal('');

  public filterSearch = signal('');
  public filterLocation = signal('');

  public locations = computed(() =>
    [...new Set(this.wardrobes().map((wardrobe) => wardrobe.location))].sort(),
  );

  public filteredWardrobes = computed(() =>
    this.wardrobes()
      .filter((wardrobe) => {
        const search = this.filterSearch().trim().toLowerCase();
        if (search) {
          const matchesName = wardrobe.name.toLowerCase().includes(search);
          const matchesDescription = wardrobe.description
            .toLowerCase()
            .includes(search);
          if (!matchesName && !matchesDescription) return false;
        }
        if (
          this.filterLocation() &&
          wardrobe.location !== this.filterLocation()
        )
          return false;
        return true;
      })
      .map((wardrobe) => ({
        ...wardrobe,
        garments: this.wardrobeService.getGarmentsForWardrobe(wardrobe),
      })),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.garmentService.loadGarments().subscribe({
      next: () => {
        this.wardrobeService.loadWardrobes().subscribe({
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

  updateFilterLocation(event: Event): void {
    this.filterLocation.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
    this.filterLocation.set('');
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudieron cargar tus armarios.';
  }
}
