import { getPostById, getUserById } from '@/lib/data';
import { notFound } from 'next/navigation';

import { PostCard } from '@/components/post-card/post-card';
import { CreatePost } from '@/components/create-post';
import { PageHeader } from '@/components/page-header';

interface Props {
  params: Promise<{ username: string; postId: string }>;
}

export default async function PostPage({ params }: Props) {
  const { username, postId } = await params;

  const post = getPostById(postId);
  if (!post) {
    console.error(`Post with ID ${postId} not found.`);
    return notFound();
  }

  const author = getUserById(post.authorId);
  if (!author || author.username !== username) {
    console.error(
      `Author with ID ${post.authorId} not found or username mismatch. Expected: ${username}, Found: ${author?.username}`
    );
    return notFound();
  }

  return (
    <>
      <PageHeader title="Post" />
      <PostCard post={post} isClickable={false} />
      <CreatePost post={post} variant="reply" className="border-b" />
      {post.comments.map((comment) => (
        <PostCard key={comment._id} post={comment} />
      ))}
    </>
  );
}
