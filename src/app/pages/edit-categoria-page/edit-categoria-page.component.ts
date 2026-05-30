import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../components/garment-card/garment-card.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-edit-categoria-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './edit-categoria-page.component.html',
  styleUrl: './edit-categoria-page.component.css',
})
export class EditCategoriaPageComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public categoryId = signal('');
  public name = signal('');
  public description = signal('');
  public errorMessage = signal('');

  public categoryGarments = computed(() => {
    const category = this.categoryService.getById(this.categoryId());
    if (!category) return [];
    return this.categoryService.getGarmentsForCategory(category);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/categorias']);
      return;
    }

    const category = this.categoryService.getById(id);

    if (!category) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.categoryId.set(category.id);
    this.name.set(category.name);
    this.description.set(category.description);
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateDescription(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Escribe un nombre para la categoría.');
      return;
    }

    const duplicate = this.categoryService
      .allCategories()
      .some(
        (category) =>
          category.id !== this.categoryId() &&
          category.name.toLowerCase() === this.name().trim().toLowerCase(),
      );

    if (duplicate) {
      this.errorMessage.set('Ya existe otra categoría con ese nombre.');
      return;
    }

    this.categoryService.updateCategory(this.categoryId(), {
      name: this.name().trim(),
      description: this.description().trim(),
    });

    this.router.navigate(['/categorias']);
  }

  deleteCategory(): void {
    this.errorMessage.set('');

    const deleted = this.categoryService.deleteCategory(this.categoryId());

    if (!deleted) {
      this.errorMessage.set(
        'No puedes eliminar una categoría que tiene prendas asignadas.',
      );
      return;
    }

    this.router.navigate(['/categorias']);
  }
}
