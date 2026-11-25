import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { CouncilService } from '../../../core/services/council.service';
import { ImageService } from '../../../core/services/image.service';
import { CouncilMember } from '../../../core/models/council-member.model';

interface MembershipFaq {
  question: string;
  answer: string;
  answerLink?: {
    label: string;
    route: string;
    suffix: string;
  };
}

@Component({
  selector: 'app-membership',
  templateUrl: './membership.html',
  styleUrls: ['./membership.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [PillBadge, RouterLink],
})
export class Membership implements OnInit {
  private seo = inject(SeoService);
  private councilService = inject(CouncilService);
  readonly imageService = inject(ImageService);

  featuredMembers = signal<CouncilMember[]>([]);
  councilLoading = signal(true);

  readonly memberBenefits = [
    { icon: 'person-badge', title: 'Your listing.', description: 'A member page on the DTL website from day one, with a link you can put in a CV, a proposal or an email signature.' },
    { icon: 'file-earmark-text', title: 'An editor.', description: 'Send an article or answer interview questions by email. DTL edits it with you, publishes accepted work under your name, and shares it on DTL\'s channels.' },
    { icon: 'mic', title: 'A stage.', description: 'Apply to speak at DTL events and webinars about projects you\'ve delivered.' },
    { icon: 'journal-richtext', title: 'The Planner.', description: 'The Digital Twin Project Planner: a six-week track, about an hour a week, with six outputs that become a planning package for a real project. Completing it earns Practitioner Status.' },
    { icon: 'linkedin', title: 'A welcome.', description: 'Once your profile is complete, DTL introduces you on its LinkedIn page.' },
  ];

  readonly seniorityLevels = [
    { name: 'Member', year: 'Year 1' },
    { name: 'Senior Member', year: 'Year 2' },
    { name: 'Lead Practitioner', year: 'Year 3' },
    { name: 'Fellow', year: 'Year 4+' },
  ];

  readonly frequentlyAskedQuestions: MembershipFaq[] = [
    { question: 'Can I publish or speak before finishing the Planner?', answer: 'Yes. Every member can submit articles, request an interview and apply to speak from day one. The Planner is included and earns Practitioner Status when you finish it.' },
    { question: 'Is DTL vendor-neutral?', answer: 'Yes. We keep the same distance from every platform and are tied to none. The method works with any product.' },
    { question: 'How long does the Planner take?', answer: 'Six chapters, about an hour a week, over about six weeks.' },
    { question: 'What do I finish with?', answer: 'Six outputs: the Digital Twin Readiness Checklist, Communication Diagnostic Toolkit, Scope & Value Definition, Stakeholder Alignment Toolkit, Digital Twin 3-Stages Engine, and the Digital Twin Project Canvas that brings them together.' },
    { question: 'How does Team Membership work?', answer: 'It covers three named people, and you can add more at $199 each. After purchase we email you to collect the names.' },
    { question: 'Can I cancel?', answer: 'Any time, through the link in your emails or by emailing community@digitaltwinleaders.com. Your membership runs to the end of the term you paid for.' },
    { question: 'What if it\'s not for me?', answer: 'Full refund within 14 days, no reason needed, as long as the conditions in our ', answerLink: { label: 'Refund Policy', route: '/refund-policy', suffix: ' are met.' } },
  ];

  ngOnInit() {
    this.councilService.getMembers().subscribe({
      next: (members) => {
        const featured = members.filter(member => member.featured === true);
        this.featuredMembers.set((featured.length > 0 ? featured : members).slice(0, 8));
        this.councilLoading.set(false);
      },
      error: () => this.councilLoading.set(false),
    });
    this.seo.update({
      title: 'Membership',
      description: 'Become a Digital Twin Leaders Council Member: publish articles, give written interviews, apply to speak at DTL events, and get the Digital Twin Project Planner included.',
      url: '/membership',
    });
  }
}
