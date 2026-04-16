import { getCollection } from 'astro:content';

export async function checkIds() {
  const allPosts = await getCollection('blog');
  console.log('Post IDs sample:', allPosts.slice(0, 5).map(p => p.id));
}
