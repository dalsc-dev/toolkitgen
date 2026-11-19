export interface SchemaOptions {
  type: 'website' | 'tool' | 'hub' | 'article';
  title: string;
  description: string;
  url: string;
  category?: string;
  datePublished?: string;
  dateModified?: string;
  howTo?: Array<{ name: string; text: string }>;
  faq?: Array<{ q: string; a: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function generateJsonLd(options: SchemaOptions) {
  const baseUrl = 'https://toolkitgen.com';
  const orgSchema = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Toolkit Gen',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/assets/favicon/favicon-96x96.png`,
    },
    sameAs: [],
  };

  const graph: any[] = [orgSchema];

  if (options.type === 'website') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Toolkit Gen',
      description: options.description,
      publisher: { '@id': `${baseUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${options.url}#breadcrumbs`,
      itemListElement: options.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${baseUrl}${b.url}`,
      })),
    });
  }

  if (options.type === 'tool') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${options.url}#webapp`,
      name: options.title,
      url: options.url,
      description: options.description,
      applicationCategory: options.category || 'UtilitiesApplication',
      operatingSystem: 'All (Web Browser, Windows, macOS, Linux, iOS, Android)',
      browserRequirements: 'Requires JavaScript. Compatible with Chrome, Safari, Firefox, Edge.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: '100% Client-Side Processing, Instant Execution, Zero Data Logging, Offline Capable',
    });

    if (options.howTo && options.howTo.length > 0) {
      graph.push({
        '@type': 'HowTo',
        '@id': `${options.url}#howto`,
        name: `How to Use ${options.title}`,
        description: `Step-by-step guide to using ${options.title} privately in your web browser.`,
        step: options.howTo.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }

    if (options.faq && options.faq.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${options.url}#faq`,
        mainEntity: options.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      });
    }

    graph.push({
      '@type': 'TechArticle',
      '@id': `${options.url}#article`,
      headline: options.title,
      description: options.description,
      url: options.url,
      datePublished: options.datePublished || '2025-01-15T00:00:00Z',
      dateModified: options.dateModified || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'Toolkit Gen Editorial Team',
        url: baseUrl,
      },
      publisher: { '@id': `${baseUrl}/#organization` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
