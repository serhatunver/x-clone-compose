import { AnimatedToggleButton } from '@/components/animated-toggle-button';
import { useState } from 'react';
import { Heart } from '@/components/animate-ui/icons/heart';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import type { Post } from '@/lib/data';

interface LikeButtonProps {
  post: Post;
}
export function LikeButton({ post }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleToggle = (pressed: boolean) => {
    setLiked(pressed);
    setLikeCount((prev) => (pressed ? prev + 1 : prev - 1));
  };

  return (
    <AnimatedToggleButton
      tooltip="Like"
      pressed={liked}
      onPressedChange={handleToggle}
      className="px-3 rounded-full gap-2
        hover:bg-pink-500/50 dark:hover:bg-pink-500/50
        data-[state=on]:text-pink-600"
      particleClassName="bg-pink-500/50 size-1 rounded-full"
    >
      {({ animate, pressed }) => (
        <div className="flex items-center gap-2">
          <AnimateIcon animate={animate} animation="path" persistOnAnimateEnd>
            <Heart
              className={`transition-colors duration-200 ${
                pressed ? 'fill-pink-600 stroke-pink-600' : 'stroke-current'
              }`}
            />
          </AnimateIcon>

          <span
            className={`transition-colors duration-200 ${
              pressed ? 'text-pink-600' : ''
            }`}
          >
            {likeCount}
          </span>
        </div>
      )}
    </AnimatedToggleButton>
  );
}
