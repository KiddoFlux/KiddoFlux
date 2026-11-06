import type { AvatarTone } from '@/components/ui/Avatar';

/** Morning rides go home to school; afternoon rides go school to home. */
export type RideDirection = 'toSchool' | 'toHome';

export type Child = {
  id: string;
  name: string;
  initial: string;
  tone: AvatarTone;
};
