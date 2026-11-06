import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { MapRide } from '../types';
import { formatApproximateDistance, getDirectionCopy } from '../utils';
import { InfoTile } from './InfoTile';

type RideCardProps = {
  ride: MapRide;
  width: number;
  position: number;
  total: number;
  onCallDriver: () => void;
  onOpenLive: () => void;
  onNext: () => void;
};

export function RideCard({
  ride,
  width,
  position,
  total,
  onCallDriver,
  onOpenLive,
  onNext,
}: RideCardProps) {
  const { driver } = ride;
  const copy = getDirectionCopy(ride.direction);
  const driverName = driver.isCurrentUser ? 'Conduci tu' : driver.name;

  return (
    <View
      className="gap-[14px] rounded-[28px] bg-white p-[18px]"
      style={[shadows.strong, { width }]}
    >
      <View className="flex-row items-center gap-3">
        <Avatar initial={driver.initial} size={44} ringWidth={0} />
        <View className="flex-1">
          <AppText numberOfLines={1} className="text-[18px]">
            {driverName}
          </AppText>
          <AppText numberOfLines={1} className="text-[12px] text-navy">
            {formatApproximateDistance(ride.distanceFromMeMeters)} de tine
          </AppText>
        </View>
        <View className="rounded-full bg-steel/[0.14] px-3 py-1">
          <AppText numberOfLines={1} className="text-[12px] text-navy">
            {position} din {total}
          </AppText>
        </View>
      </View>

      <View className="flex-row gap-2">
        <InfoTile label="Plecare" value={ride.departureTime} tone="steel" />
        <InfoTile
          label={copy.destinationLabel}
          value={ride.arrivalTime}
          tone="peach"
        />
        <InfoTile
          label="Locuri"
          value={`${ride.seatsTaken}/${ride.seatsTotal}`}
          tone="steel"
        />
      </View>

      <View className="flex-row items-center gap-2">
        {driver.isCurrentUser ? null : (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Sună șoferul, ${driver.name}`}
            onPress={onCallDriver}
            className="h-[52px] flex-1 items-center justify-center rounded-full bg-navy px-2"
          >
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              className="text-[15px] text-mint"
            >
              Sună șoferul
            </AppText>
          </PressableScale>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Status live, ${driverName}`}
          onPress={onOpenLive}
          className={`h-[52px] flex-row items-center justify-center gap-[6px] rounded-full bg-ink/[0.08] px-3 ${
            driver.isCurrentUser ? 'flex-1' : ''
          }`}
        >
          <View className="h-2 w-2 rounded-full bg-peach" />
          <AppText numberOfLines={1} className="text-[14px]">
            Live
          </AppText>
        </Pressable>
        {total > 1 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cursa următoare"
            onPress={onNext}
            className="h-[52px] w-[52px] items-center justify-center rounded-full bg-peach"
          >
            <ChevronRight
              size={24}
              color={colors.ink}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
