import {
  Car,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Phone,
  Users,
} from 'lucide-react-native';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar, AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { CarpoolRide, RouteStop } from '../types';
import { formatDistance } from '../utils';

type RideSheetProps = {
  ride: CarpoolRide;
  dayLabel: string;
  /** "Fram", as in "spre Fram". */
  destinationName: string;
  myChildrenIds: readonly string[];
  isExpanded: boolean;
  selectedStopId: string | null;
  onToggleExpanded: () => void;
  onSelectStop: (stop: RouteStop) => void;
  onCallDriver: () => void;
  /** Set only while the panel is compact: the camera frames around that size. */
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function RideSheet({
  ride,
  dayLabel,
  destinationName,
  myChildrenIds,
  isExpanded,
  onToggleExpanded,
  selectedStopId,
  onSelectStop,
  onCallDriver,
  onLayout,
}: RideSheetProps) {
  const { driver } = ride;
  const isMorning = ride.period === 'morning';
  const childNames = ride.children
    .map((child) =>
      myChildrenIds.includes(child.id) ? `${child.name} (al tău)` : child.name,
    )
    .join(', ');

  if (!isExpanded) {
    return (
      <View
        className="mx-4 flex-row items-center gap-3 rounded-[24px] bg-white py-[10px] pl-[10px] pr-3"
        style={shadows.strong}
        onLayout={onLayout}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${driver.name} duce copiii, ${ride.departureTime} până la ${ride.arrivalTime}. Vezi detalii`}
          accessibilityState={{ expanded: false }}
          onPress={onToggleExpanded}
          className="flex-1 flex-row items-center gap-3"
        >
          <Avatar
            initial={driver.initial}
            tone={driver.tone}
            size={40}
            ringWidth={0}
          />
          <View className="flex-1">
            <AppText numberOfLines={1} className="font-bold text-[15px]">
              {driver.name}
            </AppText>
            <AppText numberOfLines={1} className="text-[12px] text-navy">
              {ride.departureTime} → {ride.arrivalTime} ·{' '}
              {isMorning ? `spre ${destinationName}` : 'spre casă'}
            </AppText>
          </View>
          <ChevronUp
            size={20}
            color={colors.navy}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </Pressable>
        <CallButton driverName={driver.name} size={40} onPress={onCallDriver} />
      </View>
    );
  }

  return (
    <View
      className="mx-4 gap-[14px] rounded-[28px] bg-white p-[18px]"
      style={shadows.strong}
      onLayout={onLayout}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ascunde detaliile"
          accessibilityState={{ expanded: true }}
          onPress={onToggleExpanded}
          className="flex-1 flex-row items-center gap-3"
        >
          <Avatar
            initial={driver.initial}
            tone={driver.tone}
            size={50}
            ringWidth={0}
          />
          <View className="flex-1">
            <AppText numberOfLines={1} className="text-[12px] text-navy">
              Duce copiii · {dayLabel} {isMorning ? 'dimineață' : 'după-amiază'}
            </AppText>
            <AppText numberOfLines={1} className="font-bold text-[18px]">
              {driver.name}
            </AppText>
            <View className="flex-row items-center gap-[6px]">
              <Car
                size={14}
                color={colors.steel}
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <AppText
                numberOfLines={1}
                className="flex-shrink text-[13px] text-navy"
              >
                {driver.car}
              </AppText>
            </View>
          </View>
          <ChevronDown
            size={20}
            color={colors.navy}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </Pressable>
        <CallButton driverName={driver.name} size={48} onPress={onCallDriver} />
      </View>

      <View className="rounded-[20px] bg-steel/10 px-2 py-1">
        {ride.stops.map((stop, index) => (
          <View key={stop.id}>
            {index > 0 ? (
              <View className="flex-row items-center gap-3 px-2">
                <View className="w-7 items-center">
                  <View className="h-5 w-[2px] bg-steel/40" />
                </View>
                <AppText className="text-[12px] text-steel">
                  {formatDistance(ride.distanceMeters)} · {ride.durationMinutes}{' '}
                  min cu mașina
                </AppText>
              </View>
            ) : null}
            <StopRow
              stop={stop}
              label={index === 0 ? 'Plecare' : 'Sosire'}
              isSelected={stop.id === selectedStopId}
              onPress={() => onSelectStop(stop)}
            />
          </View>
        ))}
      </View>

      <View
        accessible
        accessibilityLabel={`Copii în mașină: ${childNames}`}
        className="flex-row items-center gap-3"
      >
        <AvatarStack items={ride.children} size={30} overlap={8} />
        <AppText numberOfLines={2} className="flex-1 text-[13px] text-navy">
          {childNames}
        </AppText>
      </View>
    </View>
  );
}

type CallButtonProps = {
  driverName: string;
  size: number;
  onPress: () => void;
};

function CallButton({ driverName, size, onPress }: CallButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Sună-l pe șofer, ${driverName}`}
      onPress={onPress}
      className="items-center justify-center rounded-full bg-navy"
      style={{ width: size, height: size }}
    >
      <Phone
        size={size * 0.42}
        color={colors.mint}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </PressableScale>
  );
}

type StopRowProps = {
  stop: RouteStop;
  /** "Plecare" or "Sosire". */
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

function StopRow({ stop, label, isSelected, onPress }: StopRowProps) {
  const isSchool = stop.kind === 'school';
  const Icon = isSchool ? GraduationCap : Users;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} la ${stop.time}, ${stop.label}, ${stop.address}`}
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-[16px] px-2 py-2 ${
        isSelected ? 'bg-white' : ''
      }`}
    >
      <View
        className={`h-7 w-7 items-center justify-center rounded-full ${
          isSchool ? 'bg-navy' : 'bg-peach'
        }`}
      >
        <Icon
          size={14}
          color={isSchool ? colors.mint : colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>
      <View className="flex-1">
        <AppText numberOfLines={1} className="text-[14px]">
          {stop.label}
        </AppText>
        <AppText numberOfLines={1} className="text-[12px] text-navy">
          {label} · {stop.address}
        </AppText>
      </View>
      <AppText className="font-bold text-[16px]">{stop.time}</AppText>
    </Pressable>
  );
}
