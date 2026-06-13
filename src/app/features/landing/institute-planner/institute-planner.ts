import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-institute-planner',
  templateUrl: './institute-planner.html',
  imports: [NgStyle, Subscribe, RouterLink],
})
export class InstitutePlanner {
  programDetails = [
    {
      title: 'FORMAT',
      description: 'Self-Paced',
      icon: 'book'
    },
    {
      title: 'EFFORT',
      description: 'Approximately 6 Hours',
      icon: 'clock'
    },
    {
      title: 'TOOLS',
      description: 'Downloadable Planning Templates',
      icon: 'calendar2'
    },
    {
      title: 'BADGE',
      description: 'Completion Badge',
      icon: 'award'
    },
    {
      title: 'COMMUNITY',
      description: 'DTL Community Access',
      icon: 'people'
    }
  ];
 
  whyThisProgram = [
    "What are we twinning?",
    "How will it work?",
    "Why are we building it?",
    "What value will it create?",
    "Who needs to be involved?",
  ];
  
  developList = [
    "Digital Twin Readiness Checklist",
    "Communication Diagnostic Toolkit",
    "Scope & Value Definition",
    "Stakeholder Alignment Plan",
    "Digital Twin 3-Stages Engine",
    "Digital Twin Project Canvas"
  ];
  
  whoShouldAttend = [
    "Smart Cities & Infrastructure",
    "GIS & Geospatial",
    "AEC & Built Environment",
    "Asset Management & Utilities",
    "Consulting & Advisory",
    "Innovation & Transformation"
  ];
  
  programStructure = [
    {
      module: "01",
      title: "Cutting Through the Hype",
      description: "Assess whether an initiative truly qualifies as a Digital Twin."
    },
    {
      module: "02",
      title: "Communication Diagnostics",
      description: "Define what is being twinned, how it is represented, and why it exists."
    },
    {
      module: "03",
      title: "Scope and Value",
      description: "Define initiative scope and expected value."
    },
    {
      module: "04",
      title: "Team and Timeline",
      description: "Identify stakeholders, responsibilities, and lifecycle considerations."
    },
    {
      module: "05",
      title: "Digital Twin Architecture",
      description: "Define how inputs, processing, and outputs work together to create value."
    },
    {
      module: "06",
      title: "Digital Twin Project Canvas",
      description: "Consolidate your work into a complete Digital Twin planning framework."
    },
  ];

  certificates = [
    "DTL Completion Badge",
    "Access to the Digital Twin Leaders Community",
    "A complete Digital Twin planning package built throughout the track"
  ];
}
