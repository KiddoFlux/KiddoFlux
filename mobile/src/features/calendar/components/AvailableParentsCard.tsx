import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { AvailableParent } from '../types';

const MAX_VISIBLE_PARENTS = 3;
const AVATAR_SIZE = 38;
const AVATAR_OVERLAP = 10;
const RING_WIDTH = 3;

type AvailableParentsCardProps = {
  parents: readonly AvailableParent[];
  weekdayName: string;
  onPress: () => void;
};

export function AvailableParentsCard({
  parents,
  weekdayName,
  onPress,
}: AvailableParentsCardProps) {
  if (parents.length === 0) {
    return (
      <View
        className="rounded-[28px] bg-white px-[18px] py-[14px]"
        style={shadows.soft}
      >
        <AppText className="text-[17px]">
          Niciun părinte disponibil {weekdayName}
        </AppText>
      </View>
    );
  }

  const visibleParents = parents.slice(0, MAX_VISIBLE_PARENTS);
  const hiddenCount = parents.length - visibleParents.length;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Părinți disponibili ${weekdayName}: ${parents.length}. Deschide lista.`}
      onPress={onPress}
      className="flex-row items-center justify-between gap-3 rounded-[28px] bg-white px-[18px] py-[14px]"
      style={shadows.soft}
    >
      <View className="flex-1 gap-2">
        <AppText numberOfLines={1} className="text-[17px]">
          Părinți disponibili {weekdayName}
        </AppText>
        <View className="flex-row">
          <AvatarStack
            items={visibleParents}
            size={AVATAR_SIZE}
            overlap={AVATAR_OVERLAP}
            ringWidth={RING_WIDTH}
          />
          {hiddenCount > 0 ? (
            <View
              className="items-center justify-center rounded-full border-white bg-ink"
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderWidth: RING_WIDTH,
                marginLeft: -AVATAR_OVERLAP,
              }}
            >
              <AppText numberOfLines={1} className="text-[13px] text-mint">
                +{hiddenCount}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      <View className="h-11 w-11 items-center justify-center rounded-full bg-steel/[0.14]">
        <ChevronRight
          size={22}
          color={colors.navy}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>
    </PressableScale>
  );
}
