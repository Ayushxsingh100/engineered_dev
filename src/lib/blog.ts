import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  content: string;
  featured: boolean;
  published: boolean;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  authorBio?: string;
  image?: string;
}

export type BlogMeta = Omit<BlogPost, 'content'>;

const BLOGS_DIR = path.join(process.cwd(), 'content/blogs');

function ensureBlogsDir(): void {
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }
}

export function getPostBySlug(slug: string): BlogPost {
  ensureBlogsDir();
  const filePath = path.join(BLOGS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags ?? [],
    readingTime: readingTime(content).text,
    content,
    featured: data.featured ?? false,
    published: data.published ?? false,
    author: data.author ?? 'Anonymous',
    image: data.image,
  };
}

export function getAllPosts(): BlogMeta[] {
  ensureBlogsDir();

  const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith('.mdx'));

  const posts: BlogMeta[] = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _content, ...meta } = getPostBySlug(slug);
      return meta;
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getFeaturedPosts(): BlogMeta[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): BlogMeta[] {
  const all = getAllPosts().filter((p) => p.slug !== currentSlug);

  const scored = all.map((post) => {
    const overlap = post.tags.filter((t) => tags.includes(t)).length;
    return { post, score: overlap };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function searchPosts(query: string): BlogMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return getAllPosts().filter((post) => {
    const inTitle = post.title.toLowerCase().includes(q);
    const inDescription = post.description.toLowerCase().includes(q);
    const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
    return inTitle || inDescription || inTags;
  });
}
