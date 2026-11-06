import { ArrowRight, CalendarDays } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

type PlanRidesCardProps = {
  onPress: () => void;
};

export function PlanRidesCard({ onPress }: PlanRidesCardProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Planifică cursele pe săptămâna viitoare"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-[28px] bg-white p-[18px]"
      style={shadows.soft}
    >
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-dashed border-steel">
        <CalendarDays
          size={24}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>
      <AppText className="flex-1 text-[22px] tracking-[-0.4px]">
        Planifică cursele pe săptămâna viitoare
      </AppText>
      <View className="h-11 w-11 items-center justify-center rounded-full bg-peach">
        <ArrowRight
          size={22}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>
    </PressableScale>
  );
}
