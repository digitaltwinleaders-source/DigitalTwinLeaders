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
  developed = ["Digital Twin Readiness Checklist", "Communication Diagnostic Toolkit", "Scope & Value Definition", "Team & Timeline Package", "Digital Twin 3-Stages Engine", "Digital Twin Project Canvas"];
  programs = ["Self-paced: about 6 hours, six chapters", "Downloadable planning tools and templates", "DTPP Practitioner Status on completion", "Included in Council Membership"];

  ngOnInit() {
    this.seo.update({
      title: 'Knowledge Hub',
      fullTitle: 'Digital Twin Frameworks and Planning Tools | DTL Knowledge Hub',
      description: 'Vendor-neutral frameworks, checklists and templates for planning and delivering digital twin initiatives, from Digital Twin Leaders (DTL).',
      url: '/knowledge-hub',
    });
  }
}
