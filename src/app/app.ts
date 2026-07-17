import { Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>'
})
export class App {
  private router = inject(Router);

  constructor() {
    afterNextRender(() => {
      AOS.init({
        duration: 800,
        once: false,
        offset: 32,
        easing: 'ease-in'
      });
      document.body.classList.add('aos-initialized');
    });

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      if (typeof window !== 'undefined') {
        setTimeout(() => AOS.refresh(), 200);
      }
    });
  }
}
