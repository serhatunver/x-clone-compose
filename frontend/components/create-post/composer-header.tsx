import { getUserById } from '@/lib/data';
import type { Post } from '@/lib/data';

interface ComposerHeaderProps {
  post: Post;
  isVisible: boolean;
}

export function ComposerHeader({ post, isVisible }: ComposerHeaderProps) {
  const author = getUserById(post.authorId);
  if (!author || !isVisible) return null;

  return (
    <div className="text-sm text-muted-foreground ml-3 py-2">
      replying to
      <span className="text-sky-400 hover:underline ml-1">
        @{author.username}
      </span>
    </div>
  );
}
