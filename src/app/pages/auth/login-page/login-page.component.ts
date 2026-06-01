import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  newUsername: string = '';
  newPassword: string = '';
  registrationError: string = '';

  onSubmit() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('token', response.token); 
          localStorage.setItem('username', this.username);
          this.errorMessage = null; 
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.errorMessage = error.error.msg || 'Error al iniciar sesión';
        },
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }

  onRegister() {
    console.log('Registro con:', this.newUsername, this.newPassword);
  
    if (!this.newUsername || !this.newPassword) {
      this.registrationError = 'Por favor, complete todos los campos';
      return;
    }

    this.authService.register(this.newUsername, this.newPassword).subscribe(
      response => {
        console.log('Usuario registrado con éxito:', response);
        this.registrationError = "Usuario Registrado con éxito";
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al registrar el usuario:', error);
        if (error.status === 400 && error.error.msg === 'Username ya existente') {
          this.registrationError = 'El nombre de usuario ya está registrado. Intenta con otro.';
        } else {
          this.registrationError = 'Hubo un error al registrar el usuario. Intenta nuevamente.';
        }
      }
    );
  }
}
