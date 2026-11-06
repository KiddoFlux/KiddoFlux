import { MapPin } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

// A fixed frame: it keeps the tap area above 44px and stops the marker jumping as it grows.
const FRAME_SIZE = 60;

export function RideMarker({ isSelected }: { isSelected: boolean }) {
  const size = isSelected ? 52 : 40;

  return (
    <View
      className="items-center justify-center"
      style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
    >
      <View
        className={`items-center justify-center rounded-full border-[3px] border-white ${
          isSelected ? 'bg-peach' : 'bg-white'
        }`}
        style={[shadows.soft, { width: size, height: size }]}
      >
        <MapPin
          size={isSelected ? 24 : 20}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>
    </View>
  );
}
