import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';

type EmptyDayCardProps = {
  onPlanRides: () => void;
};

export function EmptyDayCard({ onPlanRides }: EmptyDayCardProps) {
  return (
    <View className="items-start gap-3 rounded-[28px] border-[1.5px] border-dashed border-steel p-5">
      <AppText className="text-[17px]">Nicio cursă în această zi</AppText>
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
