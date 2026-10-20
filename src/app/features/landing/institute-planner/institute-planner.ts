import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { Testimonials } from '../../../shared/components/testimonials/testimonials';

@Component({
  selector: 'app-institute-planner',
  templateUrl: './institute-planner.html',
  imports: [NgStyle, Subscribe, RouterLink, Testimonials],
})
export class InstitutePlanner implements OnInit {
  private seo = inject(SeoService);

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
      title: 'STATUS',
      description: 'DTPP Practitioner Status',
      icon: 'award'
    },
    {
      title: 'MEMBERSHIP',
      description: 'Included in Council Membership',
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
    "Team & Timeline Package (incl. Stakeholder Alignment Toolkit)",
    "Digital Twin 3-Stages Engine",
    "Digital Twin Project Canvas"
  ];
  
  whoShouldAttend = [
    "Smart Cities & Infrastructure",
    "AEC & Built Environment",
    "GIS & Geospatial",
    "Utilities & Energy",
    "Transportation",
    "Manufacturing",
    "Consulting & Advisory"
  ];
  
  programStructure = [
    {
      module: "CHAPTER 01",
      title: "Cutting Through the Hype",
      description: "Assess whether an initiative truly qualifies as a Digital Twin."
    },
    {
      module: "CHAPTER 02",
      title: "Communication Diagnostics",
      description: "Define what is being twinned, how it is represented, and why it exists."
    },
    {
      module: "CHAPTER 03",
      title: "Scope and Value",
      description: "Define initiative scope and expected value."
    },
    {
      module: "CHAPTER 04",
      title: "Team and Timeline",
      description: "Identify stakeholders, responsibilities, and lifecycle considerations."
    },
    {
      module: "CHAPTER 05",
      title: "Digital Twin Architecture",
      description: "Define how inputs, processing, and outputs work together to create value."
    },
    {
      module: "CHAPTER 06",
      title: "Digital Twin Project Canvas",
      description: "Consolidate your work into a complete Digital Twin planning framework."
    },
  ];

  certificates = [
    "DTPP Practitioner Status",
    "A LinkedIn congratulations post from Digital Twin Leaders",
    "A complete Digital Twin planning package built throughout the track"
  ];

  faqs = [
    {
      question: "Is the Digital Twin Project Planner a certification?",
      answer: "No. Completing the track earns you DTPP Practitioner Status, which recognises that you have worked through the full planning method. It is not an accredited certification."
    },
    {
      question: "How long does the track take?",
      answer: "About 6 hours in total, at your own pace. There are six chapters, and each one ends with a planning tool you keep."
    },
    {
      question: "Which software does it use?",
      answer: "None. The track is vendor-neutral: the method works with whatever platforms your project uses."
    },
    {
      question: "How do I join?",
      answer: "The track is included in Council Membership. Join the waiting list and we will let you know as soon as membership opens, including the founding rate for the first members."
    }
  ];

  ngOnInit() {
    this.seo.update({
      title: 'Project Planner',
      fullTitle: 'Digital Twin Project Planner: Plan a Digital Twin in 6 Steps | DTL',
      description: 'A self-paced track of six chapters that takes you from "is this really a digital twin?" to a complete project canvas. Inspired by ISO/IEC 30173.',
      url: '/project-planner',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: 'Digital Twin Project Planner (DTPP)',
            description: 'A vendor-neutral, self-paced track of six chapters for planning digital twin initiatives, from readiness checks to a complete Digital Twin Project Canvas.',
            url: 'https://www.digitaltwinleaders.com/project-planner',
            timeRequired: 'PT6H',
            inLanguage: 'en',
            provider: {
              '@type': 'Organization',
              name: 'Digital Twin Leaders',
              url: 'https://www.digitaltwinleaders.com',
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: this.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ],
      },
    });
  }
}
