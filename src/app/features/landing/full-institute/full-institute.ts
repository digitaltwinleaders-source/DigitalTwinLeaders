import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-full-institute',
  templateUrl: './full-institute.html',
  imports: [NgStyle, NgClass, RouterLink],
})
export class FullInstitute {
  differentials = ["Vendor-neutral — no platform, no vendor agenda", "Inspired by ISO/IEC 30173", "Hands-on — you build real deliverables, not just consume content", "Developed by practitioners, for practitioners", "Part of a growing global professional community"];
  developed = ["Digital Twin Readiness Assessment", "Communication Diagnostic", "Scope & Value Definition", "Stakeholder & Lifecycle Analysis", "Digital Twin Architecture Definition", "Digital Twin Project Canvas"];
  programs = ["Self-Paced — work on your schedule", "Downloadable planning tools and templates", "Completion Badge", "Access to the Digital Twin Leaders Community"];
}
