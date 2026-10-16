import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title: string;
  /** Use this exact title instead of "<title> | Digital Twin Leaders". */
  fullTitle?: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private doc = inject(DOCUMENT);

  private readonly siteName = 'Digital Twin Leaders';
  private readonly baseUrl = 'https://www.digitaltwinleaders.com';
  private readonly defaultImage = 'https://www.digitaltwinleaders.com/assets/og-image.jpg';

  update(data: SeoData) {
    const fullTitle = data.fullTitle || (data.title ? `${data.title} | ${this.siteName}` : this.siteName);
    const image = data.image || this.defaultImage;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: data.description });

    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    } else {
      this.meta.removeTag('name="keywords"');
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:image', content: image });
    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${data.url}` });
      this.updateCanonical(`${this.baseUrl}${data.url}`);
    }

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // JSON-LD structured data
    if (data.jsonLd) {
      this.updateJsonLd(data.jsonLd);
    }
  }

  private updateCanonical(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateJsonLd(data: Record<string, unknown>) {
    let script: HTMLScriptElement | null = this.doc.querySelector('script[type="application/ld+json"]#seo-jsonld');
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', 'seo-jsonld');
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
