import { CalendarDays, X } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

type WeekOverviewButtonProps = {
  isOpen: boolean;
  onPress: () => void;
};

export function WeekOverviewButton({
  isOpen,
  onPress,
}: WeekOverviewButtonProps) {
  const Icon = isOpen ? X : CalendarDays;
  const verb = isOpen ? 'Ascunde' : 'Vezi';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${verb} cursele săptămânii`}
      accessibilityState={{ expanded: isOpen }}
      onPress={onPress}
      className="h-[60px] flex-row items-center gap-3 rounded-full bg-white pl-[9px] pr-5"
      style={shadows.soft}
    >
      <View className="h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-dashed border-steel">
        <Icon size={20} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        className="flex-1 text-[18px] tracking-[-0.3px] text-steel"
      >
        {verb} <AppText className="text-ink">cursele săptămânii</AppText>
      </AppText>
    </PressableScale>
  );
}
