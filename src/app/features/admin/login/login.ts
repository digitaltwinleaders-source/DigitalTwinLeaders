import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor() {
    // Already logged in → skip login page
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/council']);
    }
  }

  async onSubmit() {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('admin privileges')) {
        this.error.set(msg);
      } else if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        this.error.set('Invalid email or password.');
      } else {
        this.error.set('Something went wrong. Please try again.');
      }
    } finally {
      this.loading.set(false);
    }
  }
}