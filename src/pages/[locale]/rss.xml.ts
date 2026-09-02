import type { APIRoute } from 'astro';
import { getArticleCollection } from '../../lib/content';
import { getCollection } from 'astro:content';
import { site } from '../../lib/site';
import type { Locale } from '../../i18n/config';

export const prerender = true;

export function getStaticPaths() {
  const locales: Locale[] = ['ar', 'en', 'fr'];
  return locales.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as Locale;

  const articles = (await getCollection(getArticleCollection(locale)))
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${site.url}/${locale}/articles/${article.id}</link>
      <guid isPermaLink="true">${site.url}/${locale}/articles/${article.id}</guid>
      <description><![CDATA[${article.data.excerpt}]]></description>
      <pubDate>${article.data.publishedAt.toUTCString()}</pubDate>
      <category>${article.data.category}</category>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.fullName[locale]} — Articles</title>
    <link>${site.url}/${locale}/articles</link>
    <description>${site.fullName[locale]} blog articles</description>
    <language>${locale}</language>
    <atom:link href="${site.url}/${locale}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
