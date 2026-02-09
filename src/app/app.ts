import { Component, signal } from '@angular/core';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { RouterOutlet } from '@angular/router';
import { ToastsContainer } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('digital-twin-leaders');
}
