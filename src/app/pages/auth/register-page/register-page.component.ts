import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationError: string = '';

  onRegister() {
    console.log('Registro con:', this.name, this.email, this.password, this.confirmPassword);
  
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.registrationError = 'Por favor, complete todos los campos';
      return;
    }

    this.authService.register(this.email, this.password
    ).subscribe(
      response => {
        console.log('Usuario registrado con éxito:', response);
        this.registrationError = "Usuario Registrado con éxito";
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al registrar el usuario:', error);
        if (error.status === 400 && error.error.msg === 'Email ya existente') {
          this.registrationError = 'El correo electrónico ya está registrado. Intenta con otro.';
        } else {
          this.registrationError = 'Hubo un error al registrar el correo electrónico. Intenta nuevamente.';
        }
      }
    );
  }
}
