'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/animate-ui/components/radix/dialog';

import { cn } from '@/lib/utils';
import { useState } from 'react';

import { PostFooter } from '@/components/post-card/post-footer';
import { CloseButton } from '@/components/close-button';

interface Props {
  src: string;
  variant?: 'post' | 'avatar' | 'cover';
  children?: React.ReactNode;
}

export function ImagePreview({ src, variant = 'post', children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          'flex flex-col items-center justify-center h-screen p-0 bg-transparent max-w-none! border-none'
        )}
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => {
          setOpen(false);
          e.stopPropagation();
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            {variant === 'post'
              ? 'Post Image'
              : variant === 'avatar'
                ? 'Profile Photo'
                : 'Cover Photo'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'post'
              ? 'View the post image in full size.'
              : variant === 'avatar'
                ? 'View the profile photo in full size.'
                : 'View the cover photo in full size.'}
          </DialogDescription>
        </DialogHeader>

        <CloseButton className="absolute top-3 left-3" />

        <Image
          src={src}
          alt="Preview"
          width={800}
          height={600}
          className={cn(
            'mx-auto',
            variant === 'avatar'
              ? 'w-full h-auto m-4 max-w-sm object-contain rounded-full'
              : variant === 'cover'
                ? 'w-full h-auto aspect-3/1 object-cover'
                : 'h-auto max-h-[90vh] object-contain'
          )}
          onClick={(e) => e.stopPropagation()}
        />
      </DialogContent>
    </Dialog>
  );
}
