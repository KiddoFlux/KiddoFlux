import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { shadows } from '@/theme/shadows';

/** A pin: anchor it at the bottom centre, where the pointer ends. */
export const PICKUP_MARKER_ANCHOR = { x: 0.5, y: 1 };

const POINTER_STYLE = { marginTop: -7, transform: [{ rotate: '45deg' }] };

type PickupMarkerProps = {
  /** The driver's, since the pickup is at their home. */
  initial: string;
  tone: AvatarTone;
  time: string;
};

export function PickupMarker({ initial, tone, time }: PickupMarkerProps) {
  return (
    <View className="items-center">
      <View
        className="flex-row items-center gap-[6px] rounded-full border-[3px] border-white bg-peach py-1 pl-1 pr-3"
        style={shadows.soft}
      >
        <Avatar initial={initial} tone={tone} size={26} ringWidth={2} />
        <AppText numberOfLines={1} className="font-bold text-[13px]">
          Preluare · {time}
        </AppText>
      </View>
      <View
        className="h-3 w-3 border-b-[3px] border-r-[3px] border-white bg-peach"
        style={POINTER_STYLE}
      />
    </View>
  );
}
