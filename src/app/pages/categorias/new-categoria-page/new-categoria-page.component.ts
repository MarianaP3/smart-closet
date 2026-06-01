import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-new-categoria-page',
  imports: [RouterLink],
  templateUrl: './new-categoria-page.component.html',
  styleUrl: './new-categoria-page.component.css',
})
export class NewCategoriaPageComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  public name = signal('');
  public description = signal('');
  public errorMessage = signal('');
  public isSaving = signal(false);

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();
    this.categoryService.loadCategories().subscribe();
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
          category.name.toLowerCase() === this.name().trim().toLowerCase(),
      );

    if (duplicate) {
      this.errorMessage.set('Ya existe una categoría con ese nombre.');
      return;
    }

    this.isSaving.set(true);

    this.categoryService
      .addCategory({
        name: this.name().trim(),
        description: this.description().trim(),
      })
      .subscribe({
        next: () => this.router.navigate(['/categorias']),
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

    if (error.status === 403) {
      return 'No tienes permisos para crear categorías.';
    }

    return error.error?.msg ?? 'No se pudo crear la categoría. Intenta de nuevo.';
  }
}
