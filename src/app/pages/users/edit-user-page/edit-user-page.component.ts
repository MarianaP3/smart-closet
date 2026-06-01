import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-user-page',
  imports: [RouterLink],
  templateUrl: './edit-user-page.component.html',
  styleUrl: './edit-user-page.component.css',
})
export class EditUserPageComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public userId = signal('');
  public name = signal('');
  public email = signal('');
  public role = signal<'Usuario' | 'Administrador'>('Usuario');
  public password = signal('');
  public errorMessage = signal('');

  public roles: Array<'Usuario' | 'Administrador'> = ['Usuario', 'Administrador'];

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/usuarios']);
      return;
    }

    const user = this.userService.getById(id);

    if (!user) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.userId.set(user.id);
    this.name.set(user.name);
    this.email.set(user.email);
    this.role.set(user.role);
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateEmail(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  updateRole(event: Event): void {
    this.role.set(
      (event.target as HTMLSelectElement).value as 'Usuario' | 'Administrador',
    );
  }

  updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Escribe el nombre del usuario.');
      return;
    }

    if (!this.email().trim()) {
      this.errorMessage.set('Escribe un correo electrónico.');
      return;
    }

    const duplicate = this.userService
      .allUsers()
      .some(
        (user) =>
          user.id !== this.userId() &&
          user.email.toLowerCase() === this.email().trim().toLowerCase(),
      );

    if (duplicate) {
      this.errorMessage.set('Ya existe otro usuario con ese correo.');
      return;
    }

    if (this.password().trim() && this.password().trim().length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.userService.updateUser(this.userId(), {
      name: this.name().trim(),
      email: this.email().trim(),
      role: this.role(),
      password: this.password().trim() || undefined,
    });

    this.router.navigate(['/usuarios']);
  }

  deleteUser(): void {
    this.errorMessage.set('');

    const deleted = this.userService.deleteUser(this.userId());

    if (!deleted) {
      this.errorMessage.set('No puedes eliminar el último usuario del sistema.');
      return;
    }

    this.router.navigate(['/usuarios']);
  }
}
