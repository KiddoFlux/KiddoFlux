import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { shadows } from '@/theme/shadows';

type EmptyRidesCardProps = {
  onPlanRides: () => void;
};

export function EmptyRidesCard({ onPlanRides }: EmptyRidesCardProps) {
  return (
    <View
      className="mx-5 items-start gap-3 rounded-[28px] bg-white p-5"
      style={shadows.strong}
    >
      <AppText className="text-[17px]">Nicio cursă în zona ta</AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Planifică cursele"
        onPress={onPlanRides}
        className="h-11 items-center justify-center rounded-full bg-navy px-5"
      >
        <AppText numberOfLines={1} className="text-[15px] text-mint">
          Planifică cursele
        </AppText>
      </PressableScale>
    </View>
  );
}
