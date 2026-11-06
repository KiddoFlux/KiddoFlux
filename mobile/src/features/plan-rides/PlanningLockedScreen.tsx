import { ArrowLeft, ArrowRight, Lock } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

const SCREEN_TOP_PADDING = 26;

type PlanningLockedScreenProps = {
  onBack: () => void;
  onOpenCalendar: () => void;
};

export function PlanningLockedScreen({
  onBack,
  onOpenCalendar,
}: PlanningLockedScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 gap-[18px] bg-mint px-5"
      style={{ paddingTop: insets.top + SCREEN_TOP_PADDING }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Înapoi"
        onPress={onBack}
        className="h-12 w-12 items-center justify-center rounded-full bg-white"
        style={shadows.soft}
      >
        <ArrowLeft
          size={22}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </Pressable>

      <View
        className="items-start gap-3 rounded-[28px] bg-white p-5"
        style={shadows.soft}
      >
        <View className="h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-dashed border-steel">
          <Lock size={24} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
        </View>
        <AppText className="text-[22px] tracking-[-0.4px]">
          Programul pentru săptămâna viitoare e gata
        </AppText>
        <AppText className="text-[15px] text-navy">
          Planificarea s-a închis duminică seara. Poți planifica săptămâna
          următoare de luni.
        </AppText>
      </View>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Vezi programul"
        onPress={onOpenCalendar}
        className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-navy"
      >
        <AppText className="text-[16px] text-mint">Vezi programul</AppText>
        <ArrowRight
          size={20}
          color={colors.mint}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </PressableScale>
    </View>
  );
}
