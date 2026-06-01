import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-edit-categoria-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './edit-categoria-page.component.html',
  styleUrl: './edit-categoria-page.component.css',
})
export class EditCategoriaPageComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private garmentService = inject(GarmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public categoryId = signal('');
  public name = signal('');
  public description = signal('');
  public errorMessage = signal('');
  public isSaving = signal(false);
  public isLoading = signal(true);

  public categoryGarments = computed(() => {
    const category = this.categoryService.getById(this.categoryId());
    if (!category) return [];
    return this.categoryService.getGarmentsForCategory(category);
  });

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/categorias']);
      return;
    }

    this.garmentService.loadGarments().subscribe({
      next: () => {
        this.categoryService.getByIdFromApi(id).subscribe({
          next: (category) => {
            this.categoryId.set(category.id);
            this.name.set(category.name);
            this.description.set(category.description);
            this.isLoading.set(false);
          },
          error: () => {
            this.router.navigate(['/not-found']);
          },
        });
      },
      error: () => {
        this.router.navigate(['/not-found']);
      },
    });
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

    this.isSaving.set(true);

    this.categoryService
      .updateCategory(this.categoryId(), {
        name: this.name().trim(),
        description: this.description().trim(),
      })
      .subscribe({
        next: () => {
          this.garmentService.loadGarments().subscribe();
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  deleteCategory(): void {
    this.errorMessage.set('');

    this.categoryService.deleteCategory(this.categoryId()).subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: (error) =>
        this.errorMessage.set(this.getErrorMessage(error)),
    });
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para modificar categorías.';
    }

    return error.error?.msg ?? 'No se pudo guardar la categoría. Intenta de nuevo.';
  }
}
