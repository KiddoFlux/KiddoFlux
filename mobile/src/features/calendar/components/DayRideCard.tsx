import { TriangleAlert } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { CalendarRide } from '../types';

// Tap area grows from 36px to 44px without changing the visual height.
const ALERT_BUTTON_HIT_SLOP = 4;

function getSubtitle(ride: CalendarRide): string {
  if (ride.driverName === null) {
    return `Conduci tu · ${ride.seatsTaken} din ${ride.seatsTotal} locuri`;
  }

  const childNames = ride.children.map((child) => child.name).join(', ');
  return `Conduce ${ride.driverName} · ${childNames}`;
}

type DayRideCardProps = {
  ride: CalendarRide;
  /** Set only when the current user can still send an alert for this ride. */
  onCannotDrive?: () => void;
  /** Set only when the current user can still take over this ride. */
  onTakeOver?: () => void;
  onPress: () => void;
};

export function DayRideCard({
  ride,
  onCannotDrive,
  onTakeOver,
  onPress,
}: DayRideCardProps) {
  const isMyRide = ride.driverName === null;
  const title = ride.direction === 'toSchool' ? 'Spre școală' : 'Spre casă';
  const childNames = ride.children.map((child) => child.name).join(', ');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${title}, plecare la ${ride.departureTime}, sosire la ${ride.arrivalTime}. ${
        ride.driverName === null ? 'Conduci tu' : `Conduce ${ride.driverName}`
      }. Copii: ${childNames}.${
        ride.needsReplacement ? ' Se caută înlocuitor.' : ''
      } Deschide detaliile.`}
      onPress={onPress}
      className="flex-row gap-3 rounded-[28px] bg-white p-3"
      style={shadows.soft}
    >
      <View
        className={`h-[84px] w-[76px] items-center justify-center rounded-[20px] ${
          isMyRide ? 'bg-navy' : 'bg-steel/[0.14]'
        }`}
      >
        <AppText
          numberOfLines={1}
          className={`text-[20px] ${isMyRide ? 'text-mint' : 'text-ink'}`}
        >
          {ride.departureTime}
        </AppText>
        <AppText
          numberOfLines={1}
          className={`text-[12px] ${isMyRide ? 'text-sage' : 'text-navy'}`}
        >
          → {ride.arrivalTime}
        </AppText>
      </View>

      <View className="flex-1 gap-[6px]">
        <AppText numberOfLines={1} className="text-[17px]">
          {title}
        </AppText>

        <AppText numberOfLines={1} className="text-[12px] text-navy">
          {getSubtitle(ride)}
        </AppText>

        <AvatarStack
          items={ride.children}
          size={30}
          overlap={8}
          ringWidth={2}
        />

        {ride.needsReplacement ? (
          <View className="h-[26px] flex-row items-center gap-1 self-start rounded-full bg-peach/35 px-[10px]">
            <TriangleAlert
              size={12}
              color={colors.ink}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            <AppText numberOfLines={1} className="text-[12px]">
              Se caută înlocuitor
            </AppText>
          </View>
        ) : null}

        {onTakeOver ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Preiau cursa, ${title}, ora ${ride.departureTime}`}
            hitSlop={ALERT_BUTTON_HIT_SLOP}
            onPress={onTakeOver}
            className="h-9 items-center justify-center self-start rounded-full bg-navy px-4"
          >
            <AppText numberOfLines={1} className="text-[13px] text-mint">
              Preiau cursa
            </AppText>
          </Pressable>
        ) : null}

        {onCannotDrive && !ride.needsReplacement ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Nu pot conduce, ${title}, ora ${ride.departureTime}`}
            hitSlop={ALERT_BUTTON_HIT_SLOP}
            onPress={onCannotDrive}
            className="h-9 flex-row items-center gap-[6px] self-start rounded-full border-[1.5px] border-dashed border-steel px-3"
          >
            <TriangleAlert
              size={14}
              color={colors.ink}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            <AppText numberOfLines={1} className="text-[13px]">
              Nu pot conduce
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </PressableScale>
  );
}
