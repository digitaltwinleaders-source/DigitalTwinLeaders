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
      title: 'Publish Your Articles',
      description: 'Share what worked, what failed, and what you learned. DTL reviews and edits accepted articles, publishes them, and shares them through its channels.',
      icon: 'book',
      tags: ['Editorial support', 'Published on the DTL website', 'Shared on DTL channels']
    },
    {
      title: 'Speak at DTL Events',
      description: 'Apply to speak at DTL events and webinars and share your project experience with practitioners around the world.',
      icon: 'camera-video',
      tags: ['Events and webinars', 'Real project experience', 'Global audience']
    },
    {
      title: 'Written Interviews',
      description: 'Answer a few questions by email. DTL edits your answers for your review, then publishes the interview.',
      icon: 'chat-left',
      tags: ['Answer by email', 'Edited for your review', 'Featured by DTL']
    },
    {
      title: 'Digital Twin Project Planner',
      description: 'Included with membership: a six-week track that helps you turn your idea into a clear project plan, with Practitioner Status on completion.',
      icon: 'award',
      tags: ['Included with membership', 'Six weeks', 'Practitioner Status']
    }
  ];
}
