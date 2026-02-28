'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ImagePreview } from '@/components/image-preview';
import type { Post } from '@/lib/data';

interface PostContentProps {
  post: Post;
  showMedia?: boolean;
  truncate?: boolean;
}

const MAX_LENGTH = 220;

export function PostContent({
  post,
  showMedia = true,
  truncate = false,
}: PostContentProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = post.content.length > MAX_LENGTH;
  const shouldTruncate = truncate && !expanded && isLong;

  const contentToShow = shouldTruncate
    ? post.content.slice(0, MAX_LENGTH) + '...'
    : post.content;

  return (
    <>
      <div>
        <p className="text-base">{contentToShow}</p>

        {truncate && !expanded && isLong && (
          <Button
            variant="link"
            onClick={(e) => {
              setExpanded(true);
              e.stopPropagation();
            }}
            className="justify-start h-auto w-full p-0 text-sky-400 hover:cursor-pointer"
          >
            Show more
          </Button>
        )}
      </div>

      {post.media && showMedia && (
        <div className="mt-3">
          <ImagePreview src={post.media} variant="post">
            <Image
              src={post.media}
              alt="Post image"
              width={800}
              height={600}
              className="w-full max-h-125 object-contain rounded-lg cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </ImagePreview>
        </div>
      )}
    </>
  );
}
