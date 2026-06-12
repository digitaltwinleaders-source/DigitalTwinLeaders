import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgbCollapseModule, RouterLink, NgClass, RouterLinkActive],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  public isMenuCollapsed = true;
  public activeFragment: string | null = null;
  
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  
  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
      this.isMenuCollapsed = true;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMenuCollapsed = true;
      }
    });
  }
}
