import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { GarmentService } from '../../../services/garment.service';
import { WardrobeService } from '../../../services/wardrobe.service';

@Component({
  selector: 'app-new-armario-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './new-armario-page.component.html',
  styleUrl: './new-armario-page.component.css',
})
export class NewArmarioPageComponent implements OnInit {
  private authService = inject(AuthService);
  private garmentService = inject(GarmentService);
  private wardrobeService = inject(WardrobeService);
  private router = inject(Router);

  public name = signal('');
  public location = signal('');
  public description = signal('');
  public selectedGarmentIds = signal<string[]>([]);
  public errorMessage = signal('');
  public isSaving = signal(false);

  public garments = this.garmentService.allGarments;

  public locations = [
    'Recámara',
    'Entrada',
    'Guardado',
    'Oficina',
    'Viaje',
    'Otro',
  ];

  public selectedGarments = computed(() =>
    this.garments().filter((garment) =>
      this.selectedGarmentIds().includes(garment.id),
    ),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
    this.garmentService.loadGarments().subscribe();
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateLocation(event: Event): void {
    this.location.set((event.target as HTMLSelectElement).value);
  }

  updateDescription(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  isSelected(garmentId: string): boolean {
    return this.selectedGarmentIds().includes(garmentId);
  }

  toggleGarment(garmentId: string): void {
    this.selectedGarmentIds.update((ids) =>
      ids.includes(garmentId)
        ? ids.filter((id) => id !== garmentId)
        : [...ids, garmentId],
    );
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Escribe un nombre para tu armario.');
      return;
    }

    if (!this.location()) {
      this.errorMessage.set('Selecciona una ubicación.');
      return;
    }

    if (this.selectedGarmentIds().length === 0) {
      this.errorMessage.set('Selecciona al menos una prenda para el armario.');
      return;
    }

    this.isSaving.set(true);

    this.wardrobeService
      .addWardrobe({
        name: this.name().trim(),
        location: this.location(),
        description: this.description().trim(),
        garmentIds: this.selectedGarmentIds(),
      })
      .subscribe({
        next: () => this.router.navigate(['/armarios']),
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

    return error.error?.msg ?? 'No se pudo crear el armario. Intenta de nuevo.';
  }
}
