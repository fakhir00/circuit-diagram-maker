import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  if (import.meta.env.DEV) return posts;
  return posts.filter((post) => post.data.draft !== true);
}