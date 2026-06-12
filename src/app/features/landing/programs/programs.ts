import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-programs',
  imports: [NgStyle],
  templateUrl: './programs.html'
})
export class Programs {
cardList = [
    {
      title: 'Vendor-Neutral Frameworks',
      description: 'Comprehensive methodology designed to provide unbiased, practical knowledge applicable across all digital twin platforms and technologies.',
      icon: 'book',
      tags: ['Self-Guided Access', 'Industry-aligned content', 'Global standards']
    },
    {
      title: 'Expert-Led Talks',
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
      description: 'Credentials aligned with global standards, validating your expertise and commitment to excellence.',
      icon: 'award',
      tags: ['ISO-aligned standards', 'Digital badges', 'Career advancement']
    }
  ];
}
