import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { PillBadge } from '../../../shared/components/pill-badge/pill-badge';
import { Subscribe } from '../../../shared/components/subscribe/subscribe';

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
  imports: [PillBadge, RouterLink, Subscribe],
})
export class Membership implements OnInit {
  private seo = inject(SeoService);

  readonly memberJourney = [
    {
      label: 'FROM DAY ONE',
      title: 'Your profile goes live',
      items: [
        {
          icon: 'person-badge',
          title: 'Council Member listing',
          description: 'Your member page on the DTL website, with a link you can share.',
        },
        {
          icon: 'file-text',
          title: 'Articles and written interviews',
          description: 'Submit an article or request an interview. We edit with you and publish accepted work on the DTL website.',
        },
        {
          icon: 'mic',
          title: 'Apply to speak',
          description: 'Share your project experience at DTL events and webinars.',
        },
        {
          icon: 'journal-richtext',
          title: 'Digital Twin Project Planner',
          description: 'Full access to the six-week track in the DTL Knowledge Hub.',
        },
      ],
    },
    {
      label: 'ONCE YOUR PROFILE IS READY',
      title: 'We introduce you to the community',
      items: [
        {
          icon: 'linkedin',
          title: 'Welcome post on LinkedIn',
          description: 'DTL introduces you to its network on LinkedIn.',
        },
        {
          icon: 'share',
          title: 'Your work, shared',
          description: "Your published articles and interviews promoted on DTL's LinkedIn page.",
        },
        {
          icon: 'star',
          title: 'Recognition as you grow',
          description: 'Practitioner Status and a new badge with every membership year.',
        },
      ],
    },
  ];

  readonly plannerChapters = [
    { title: 'Cutting Through the Hype' },
    { title: 'Communication Diagnostics' },
    { title: 'Scope and Value' },
    { title: 'Team and Timeline' },
    { title: 'Digital Twin Architecture' },
    { title: 'Digital Twin Project Canvas' },
  ];

  readonly practitionerBenefits = [
    'Practitioner badge on your member page',
    'Certificate',
    "Congratulations post on DTL's LinkedIn page",
  ];

  readonly seniorityLevels = [
    { name: 'Member', year: 'Year 1' },
    { name: 'Senior Member', year: 'Year 2' },
    { name: 'Lead Practitioner', year: 'Year 3' },
    { name: 'Fellow', year: 'Year 4+' },
  ];

  readonly frequentlyAskedQuestions: MembershipFaq[] = [
    {
      question: 'Who is Council Membership for?',
      answer: 'Professionals working on digital twins, and those moving into the field from BIM, GIS, engineering, and related roles, at any career stage.',
    },
    {
      question: 'How does publishing work?',
      answer: 'Send an article or an idea, or answer interview questions by email. DTL reviews and edits your work with you, publishes accepted pieces on the DTL website, and shares them through its channels.',
    },
    {
      question: 'Do I need to finish the Digital Twin Project Planner to publish or speak?',
      answer: 'No. Every member can submit articles, request an interview, and apply to speak. The Project Planner is included in your membership and earns you Practitioner Status when you complete it.',
    },
    {
      question: "What if it's not for me?",
      answer: 'You can get a full refund within 14 days, without giving a reason, as long as the conditions in our ',
      answerLink: {
        label: 'Refund Policy',
        route: '/refund-policy',
        suffix: ' are met.',
      },
    },
    {
      question: 'How does Team Membership work?',
      answer: "Team Membership covers 3 named people, and you can add more. After purchase, we'll email you to collect your team members' details. Contact us to add members later.",
    },
    {
      question: 'Does membership renew automatically?',
      answer: 'Yes, every year at the same rate. We email you before each renewal. You can cancel at any time through the manage-subscription link in your emails or by emailing community@digitaltwinleaders.com, and your membership stays active until the end of your current term.',
    },
    {
      question: 'Will my price change at renewal?',
      answer: 'No. Your rate stays the same while your membership continues without a break.',
    },
    {
      question: 'How do I contact DTL?',
      answer: 'Email community@digitaltwinleaders.com.',
    },
  ];

  ngOnInit() {
    this.seo.update({
      title: 'Membership',
      description: 'Become a Digital Twin Leaders Council Member: publish articles, give written interviews, apply to speak at DTL events, and get the Digital Twin Project Planner included.',
      url: '/membership',
    });
  }
}
