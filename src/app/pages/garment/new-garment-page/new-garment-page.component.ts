import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-new-garment-page',
  imports: [RouterLink],
  templateUrl: './new-garment-page.component.html',
  styleUrl: './new-garment-page.component.css',
})
export class NewGarmentPageComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private garmentService = inject(GarmentService);
  private router = inject(Router);

  public name = signal('');
  public categoryId = signal('');
  public color = signal('');
  public size = signal('M');
  public image = signal('');
  public errorMessage = signal('');
  public isSaving = signal(false);

  public categories = this.categoryService.allCategories;
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '22', '24', '26', 'Única'];

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();

    const firstCategory = this.categories()[0];
    if (firstCategory) {
      this.categoryId.set(firstCategory.id);
    }
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

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Escribe un nombre para la prenda.');
      return;
    }

    if (!this.color().trim()) {
      this.errorMessage.set('Escribe un color.');
      return;
    }

    if (!this.image().trim()) {
      this.errorMessage.set('Agrega la URL de la imagen.');
      return;
    }

    const category = this.categoryService.getById(this.categoryId());

    if (!category) {
      this.errorMessage.set('Selecciona una categoría válida.');
      return;
    }

    this.isSaving.set(true);

    this.garmentService
      .addGarment({
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

    if (error.status === 404) {
      return 'Ruta no encontrada en el servidor. Reinicia el backend (npm start en nodejs).';
    }

    return error.error?.msg ?? 'No se pudo agregar la prenda. Intenta de nuevo.';
  }
}
