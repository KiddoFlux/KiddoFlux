import { View } from 'react-native';

import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { shadows } from '@/theme/shadows';

// A fixed frame keeps the tap area above 44px.
const FRAME_SIZE = 44;

type HomeMarkerProps = {
  initial: string;
  tone: AvatarTone;
};

/** A family that walks its children to the driver's home. */
export function HomeMarker({ initial, tone }: HomeMarkerProps) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
    >
      <View className="rounded-full" style={shadows.soft}>
        <Avatar initial={initial} tone={tone} size={32} ringWidth={2} />
      </View>
    </View>
  );
}
