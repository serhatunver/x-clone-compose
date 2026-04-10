'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Post } from '@/lib/data';
import { useState } from 'react';

import { UserAvatar } from './user-avatar';
import { ComposerHeader } from './composer-header';
import { ComposerInput } from './composer-input';
import { ComposerActions } from './composer-actions';
import { ComposerSubmit } from './composer-submit';

import { PostCard } from '@/components/post-card';

import { cn } from '@/lib/utils';

interface CreatePostProps {
  variant?: 'post' | 'postDialog' | 'reply' | 'replyDialog' | 'quote';
  post?: Post;
  className?: string;
}

export function CreatePost({
  variant = 'post',
  post,
  className,
}: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Card
      className={cn(
        'flex flex-row gap-0 px-4 min-w-0 sm:max-h-[calc(100vh-10rem)] scrollable overflow-auto',
        className
      )}
    >
      <div>
        {variant === 'replyDialog' && (
          <div className="w-0.5 h-8 bg-accent mx-auto mb-2" />
        )}
        <UserAvatar />
      </div>

      <div className="flex flex-col w-full min-w-0">
        {variant === 'reply' && post && (
          <ComposerHeader post={post} isVisible={isFocused} />
        )}

        {variant === 'replyDialog' && post && (
          <ComposerHeader post={post} isVisible={true} />
        )}

        <ComposerInput
          value={content}
          onChange={setContent}
          onFocus={() => setIsFocused(true)}
          className={cn(
            (variant === 'replyDialog' || variant === 'postDialog') &&
              'min-h-25'
          )}
        />

        {variant === 'quote' && post && (
          <PostCard
            post={post}
            variant="quote"
            isClickable={false}
            className="my-2"
          />
        )}

        {(variant === 'post' || 'reply' || isFocused) && (
          <div className="flex justify-between sticky bottom-0 bg-background pt-2 mt-2">
            <ComposerActions />
            <ComposerSubmit
              content={content}
              label={variant.includes('post') ? 'Post' : 'Reply'}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
