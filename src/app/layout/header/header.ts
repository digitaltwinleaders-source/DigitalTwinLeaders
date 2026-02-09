import { Component, inject, OnInit } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgbCollapseModule, RouterLink, NgClass],
  templateUrl: './header.html'
})
export class Header implements OnInit {
  public isMenuCollapsed = true;
  public activeFragment: string | null = null;
  
  private activatedRoute = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
      this.isMenuCollapsed = true;
    });
  }
}
