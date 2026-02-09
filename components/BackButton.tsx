'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => router.back()}
    >
      <ArrowLeft />
    </Button>
  );
}
