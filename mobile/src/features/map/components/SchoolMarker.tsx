import { Flag } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

export function SchoolMarker() {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-navy">
      <Flag size={20} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
    </View>
  );
}
