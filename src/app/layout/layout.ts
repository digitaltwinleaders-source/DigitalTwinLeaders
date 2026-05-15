import { Component, OnInit } from '@angular/core';
import { ToastsContainer } from '../shared/components/toast/toast';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, Header, Footer, ToastsContainer],
    template: `
    <header class="sticky-top">
        <app-header/>
    </header>

    <main class="main">
        <router-outlet/>
        <app-toasts/>
    </main>

    <footer>
        <app-footer/>
    </footer>
  `
})
export class Layout implements OnInit {
    ngOnInit(): void {

    }

}
