import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.html',
  imports: [RouterLink],
})
export class RefundPolicy implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: 'Refund Policy',
      description: 'Learn when and how to request a refund for DTL membership.',
      url: '/refund-policy',
    });
  }
}
