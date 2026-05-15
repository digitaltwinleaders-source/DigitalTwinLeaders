import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { nameInitial } from '../../../core/utils/utils';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = signal(false);

  adminInitial() {
    const admin = this.authService.adminData();
    const raw = admin?.displayName || admin?.email || 'A';
    return nameInitial(raw);
  }

  async logout() {
    await this.authService.logout();
  }
}