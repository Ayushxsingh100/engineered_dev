import { Feed } from 'feed';
import { getAllPosts } from '@/lib/firebaseServer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, AUTHOR_NAME } from '@/lib/constants';

export async function generateRSSFeed(): Promise<string> {
  const posts = await getAllPosts(50);

  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    image: `${SITE_URL}/og-image.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.`,
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
      atom: `${SITE_URL}/atom.xml`,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      author: [{ name: post.author }],
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return feed.rss2();
}

export async function generateAtomFeed(): Promise<string> {
  const posts = await getAllPosts(50);

  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    copyright: `© ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.`,
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
      atom: `${SITE_URL}/atom.xml`,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      author: [{ name: post.author }],
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return feed.atom1();
}
