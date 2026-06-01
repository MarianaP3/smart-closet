import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categorias-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.css',
})
export class CategoriasPageComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();
  }

  public categories = this.categoryService.allCategories;

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

  updateFilterSearch(event: Event): void {
    this.filterSearch.set((event.target as HTMLInputElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
  }
}
