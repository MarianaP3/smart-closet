import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-edit-garment-page',
  imports: [RouterLink],
  templateUrl: './edit-garment-page.component.html',
  styleUrl: './edit-garment-page.component.css',
})
export class EditGarmentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private garmentService = inject(GarmentService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  public garmentId = signal('');
  public name = signal('');
  public categoryId = signal('');
  public color = signal('');
  public size = signal('');
  public image = signal('');
  public errorMessage = signal('');
  public isSaving = signal(false);
  public isLoading = signal(true);

  public categories = this.categoryService.allCategories;
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '22', '24', '26', 'Única'];

  public categoryName = computed(() => {
    const category = this.categoryService.getById(this.categoryId());
    return category?.name ?? '';
  });

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
    this.categoryService.loadCategories().subscribe();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/inventory']);
      return;
    }

    this.garmentService.getByIdFromApi(id).subscribe({
      next: (garment) => {
        this.garmentId.set(garment.id);
        this.name.set(garment.name);
        this.categoryId.set(garment.categoryId);
        this.color.set(garment.color);
        this.size.set(garment.size);
        this.image.set(garment.image);
        this.isLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/not-found']);
      },
    });
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateCategory(event: Event): void {
    this.categoryId.set((event.target as HTMLSelectElement).value);
  }

  updateColor(event: Event): void {
    this.color.set((event.target as HTMLInputElement).value);
  }

  updateSize(event: Event): void {
    this.size.set((event.target as HTMLSelectElement).value);
  }

  updateImage(event: Event): void {
    this.image.set((event.target as HTMLInputElement).value);
  }

  deleteGarment(): void {
    this.garmentService.deleteGarment(this.garmentId()).subscribe({
      next: () => this.router.navigate(['/inventory']),
      error: (error) =>
        this.errorMessage.set(this.getErrorMessage(error)),
    });
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    const category = this.categoryService.getById(this.categoryId());

    if (!category) {
      this.errorMessage.set('Selecciona una categoría válida.');
      return;
    }

    this.isSaving.set(true);

    this.garmentService
      .updateGarment(this.garmentId(), {
        name: this.name().trim(),
        type: category.name,
        categoryId: this.categoryId(),
        color: this.color().trim(),
        size: this.size(),
        image: this.image().trim(),
      })
      .subscribe({
        next: () => this.router.navigate(['/inventory']),
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudo guardar la prenda. Intenta de nuevo.';
  }
}
