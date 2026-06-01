import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users-page',
  imports: [RouterLink],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();
  }

  public users = this.userService.allUsers;

  public filterSearch = signal('');
  public filterRole = signal('');

  public roles = ['Usuario', 'Administrador'];

  public filteredUsers = computed(() =>
    this.users().filter((user) => {
      const search = this.filterSearch().trim().toLowerCase();
      if (search) {
        const matchesName = user.name.toLowerCase().includes(search);
        const matchesEmail = user.email.toLowerCase().includes(search);
        if (!matchesName && !matchesEmail) return false;
      }

      if (this.filterRole() && user.role !== this.filterRole()) return false;

      return true;
    }),
  );

  updateFilterSearch(event: Event): void {
    this.filterSearch.set((event.target as HTMLInputElement).value);
  }

  updateFilterRole(event: Event): void {
    this.filterRole.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
    this.filterRole.set('');
  }
}
