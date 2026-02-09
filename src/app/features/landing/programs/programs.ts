import { Component } from '@angular/core';

@Component({
  selector: 'app-programs',
  imports: [],
  templateUrl: './programs.html'
})
export class Programs {
cardList = [
    {
      title: 'Vendor-Neutral Courses',
      description: 'Comprehensive curricula designed to provide unbiased, practical knowledge applicable across all digital twin platforms and technologies.',
      icon: 'book',
      tags: ['Self-paced learning', 'Industry-aligned content', 'Global certification']
    },
    {
      title: 'Expert-Led Masterclasses',
      description: 'Intensive sessions led by industry pioneers, offering deep dives into specialized topics and emerging trends.',
      icon: 'camera-video',
      tags: ['Live Q&A sessions', 'Real-world case studies', 'Networking opportunities']
    },
    {
      title: 'Peer-to-Peer Forums',
      description: 'Collaborative spaces where professionals share insights, solve challenges, and build meaningful connections.',
      icon: 'chat-left',
      tags: ['Topic-based discussions', 'Expert mentorship', 'Global community']
    },
    {
      title: 'Recognition Programs',
      description: 'Certificates and credentials aligned with global standards, validating your expertise and commitment to excellence.',
      icon: 'award',
      tags: ['ISO-aligned standards', 'Digital badges', 'Career advancement']
    }
  ];
}
