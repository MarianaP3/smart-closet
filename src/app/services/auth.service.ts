import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient, private router: Router) {}
  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  logout() {
    localStorage.removeItem('token');  
    localStorage.removeItem('username');  
    localStorage.removeItem('cart');  
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role || null;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'Administrador';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectIfNotAdmin(): void {
    if (!this.isAdmin()) {
      this.router.navigate(['/not-found']);
    }
  }

  isUser(): boolean {
    return this.getRoleFromToken() === 'Usuario';
  }

  redirectIfNotUser(): void {
    if (!this.isUser()) {
      this.router.navigate(['/not-found']);
    }
  }
}
