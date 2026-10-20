import { Component, input } from '@angular/core';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo: string;
}

/**
 * Quotes from End-of-Track Feedback, used only where the member answered
 * "YES" to the testimonial permission question. Quotes are verbatim.
 */
export const TRACK_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'A structured, practical path from a digital twin idea to a project that can be funded and delivered. Even with years of BIM/GIS experience, I found it a very valuable planning framework.',
    name: 'Theodoros Kakardakos',
    role: 'COO, Merit Consulting House PC',
    photo: 'assets/testimonials/theo.jpg',
  },
  {
    quote: 'The course was a great learning experience overall. It gave me a clear, practical understanding of how the framework can be applied in real projects, and the hands-on component made the concepts easy to absorb and put into practice.',
    name: 'Rafaela Tiengo',
    role: 'Co-founder & COO, Easymap',
    photo: 'assets/testimonials/rafaela.jpg',
  },
  {
    quote: 'It is a great and ready opportunity to move on with digital twin.',
    name: 'Abdulrahman Ali Showaiter',
    role: 'Director of Cadastral Survey Directorate, Survey & Land Registration Bureau',
    photo: 'assets/testimonials/abdulrahman.jpg',
  },
];

@Component({
  selector: 'app-testimonials',
  template: `
    <ul class="row list-unstyled mb-0">
      @for (t of items(); track t.name) {
        <li class="col-lg-4 mb-4">
          <figure class="bg-white h-100 rounded-4 border border-1 shadow-sm p-4 m-0 d-flex flex-column gap-4">
            <i class="bi bi-quote fs-1 text-secondary-200 lh-1" aria-hidden="true"></i>
            <blockquote class="fs-6 fs-md-5 text-monochrome-600 mb-0 flex-grow-1">{{ t.quote }}</blockquote>
            <figcaption class="d-flex align-items-center gap-3">
              <img [src]="t.photo" alt="" width="48" height="48" loading="lazy" class="rounded-circle object-fit-cover flex-shrink-0">
              <span class="d-flex flex-column">
                <span class="fw-bold text-primary fs-7">{{ t.name }}</span>
                <span class="text-monochrome-500 fs-7">{{ t.role }}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      }
    </ul>
  `,
})
export class Testimonials {
  items = input<Testimonial[]>(TRACK_TESTIMONIALS);
}
