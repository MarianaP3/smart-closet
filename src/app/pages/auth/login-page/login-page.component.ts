import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],  templateUrl: './login-page.component.html',
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
    console.log('Login con:', this.username, this.password);
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
}
