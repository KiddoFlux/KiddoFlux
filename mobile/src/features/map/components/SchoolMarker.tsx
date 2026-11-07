import { GraduationCap } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

/** A pin: anchor it at the bottom centre, where the pointer ends. */
export const SCHOOL_MARKER_ANCHOR = { x: 0.5, y: 1 };

const POINTER_STYLE = { marginTop: -7, transform: [{ rotate: '45deg' }] };

export function SchoolMarker({ label }: { label: string }) {
  return (
    <View className="items-center">
      <View
        className="flex-row items-center gap-[6px] rounded-full border-[3px] border-white bg-navy py-[6px] pl-[8px] pr-3"
        style={shadows.soft}
      >
        <GraduationCap
          size={18}
          color={colors.mint}
          strokeWidth={ICON_STROKE_WIDTH}
        />
        <AppText numberOfLines={1} className="font-bold text-[13px] text-mint">
          {label}
        </AppText>
      </View>
      {/* The pointer: a small rotated square tucked under the label. */}
      <View
        className="h-3 w-3 border-b-[3px] border-r-[3px] border-white bg-navy"
        style={POINTER_STYLE}
      />
    </View>
  );
}
