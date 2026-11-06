import { Sunrise, Sunset, type LucideIcon } from 'lucide-react-native';

import type { RideDirection } from './types';

type RideSlot = {
  direction: RideDirection;
  label: string;
  routeLabel: string;
  Icon: LucideIcon;
};

/** Every school day has these two possible rides, so a week has 10. */
export const RIDE_SLOTS: readonly RideSlot[] = [
  {
    direction: 'toSchool',
    label: 'Dimineața',
    routeLabel: 'Acasă → Școala',
    Icon: Sunrise,
  },
  {
    direction: 'fromSchool',
    label: 'După-amiaza',
    routeLabel: 'Școala → Acasă',
    Icon: Sunset,
  },
];
