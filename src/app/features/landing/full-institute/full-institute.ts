import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-full-institute',
  templateUrl: './full-institute.html',
  imports: [NgStyle, NgClass, RouterLink],
})
export class FullInstitute implements OnInit {
  private seo = inject(SeoService);

  differentials = ["Vendor-neutral — no platform, no vendor agenda", "Inspired by ISO/IEC 30173", "Hands-on — you build real deliverables, not just consume content", "Developed by practitioners, for practitioners", "Part of a growing global professional community"];
  developed = ["Digital Twin Readiness Checklist", "Communication Diagnostic Toolkit", "Scope & Value Definition", "Stakeholder Alignment Toolkit", "Digital Twin 3-Stages Engine", "Digital Twin Project Canvas"];
  programs = ["Six weeks, at your own pace", "Downloadable planning tools and templates", "DTPP Practitioner Status", "Included with Council Membership"];

  ngOnInit() {
    this.seo.update({
      title: 'Knowledge Hub',
      description: 'Digital Twin Leaders Knowledge Hub - Learn about Digital Twin concepts, best practices, and methodologies. Access resources, tools, and templates to support your Digital Twin initiatives.',
      url: '/knowledge-hub',
    });
  }
}
