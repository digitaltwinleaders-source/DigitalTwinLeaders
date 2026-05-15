import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>'
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
