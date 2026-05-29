import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../components/garment-card/garment-card.component';
import { GarmentService } from '../../services/garment.service';

@Component({
  selector: 'app-inventory-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css',
})
export class InventoryPageComponent {
  private garmentService = inject(GarmentService);

  public garments = this.garmentService.allGarments;

  public filterName = signal('');
  public filterType = signal('');
  public filterColor = signal('');
  public filterSize = signal('');

  public types = computed(() =>
    [...new Set(this.garments().map((g) => g.type))].sort(),
  );
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
      if (this.filterType() && garment.type !== this.filterType()) return false;
      if (this.filterColor() && garment.color !== this.filterColor())
        return false;
      if (this.filterSize() && garment.size !== this.filterSize()) return false;
      return true;
    }),
  );

  updateFilterName(event: Event): void {
    this.filterName.set((event.target as HTMLInputElement).value);
  }

  updateFilterType(event: Event): void {
    this.filterType.set((event.target as HTMLSelectElement).value);
  }

  updateFilterColor(event: Event): void {
    this.filterColor.set((event.target as HTMLSelectElement).value);
  }

  updateFilterSize(event: Event): void {
    this.filterSize.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterName.set('');
    this.filterType.set('');
    this.filterColor.set('');
    this.filterSize.set('');
  }
}
