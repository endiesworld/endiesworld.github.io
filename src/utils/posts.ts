import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.category === category);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function getUniqueCategories(posts: BlogPost[]): string[] {
  const categories = new Set(posts.map((post) => post.data.category));
  return Array.from(categories);
}

export function getUniqueTags(posts: BlogPost[]): string[] {
  const tags = new Set(posts.flatMap((post) => post.data.tags));
  return Array.from(tags).sort();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'software-engineering': 'Software Engineering',
    'devops': 'DevOps',
    'ai': 'AI & ML',
    'projects': 'Projects',
  };
  return labels[category] || category;
}
