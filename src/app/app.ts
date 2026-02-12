import { Component, OnInit } from '@angular/core';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { RouterOutlet } from '@angular/router';
import { ToastsContainer } from './shared/components/toast/toast';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
      offset: 32,
      easing: 'ease-in'
    });
  }

}
