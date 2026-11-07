import {
  ChevronDown,
  ChevronUp,
  LocateFixed,
  MapPin,
  Sun,
  Sunset,
} from 'lucide-react-native';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { MapPeriod, SchoolDay } from '../types';
import { DaySelector, type DayOption } from './DaySelector';
import { PeriodToggle } from './PeriodToggle';

const TOP_GAP = 10;

type MapHeaderProps = {
  city: string;
  schoolName: string;
  schoolShortName: string;
  weekLabel: string;
  /** "Luni 9", shown in the compact bar. */
  dayLabel: string;
  days: readonly DayOption[];
  day: SchoolDay;
  period: MapPeriod;
  periodTimes: Partial<Record<MapPeriod, string>>;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onChangeDay: (day: SchoolDay) => void;
  onChangePeriod: (period: MapPeriod) => void;
  onLocate: () => void;
  /** Set only while the panel is compact: the camera frames around that size. */
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function MapHeader({
  city,
  schoolName,
  schoolShortName,
  weekLabel,
  dayLabel,
  days,
  day,
  period,
  periodTimes,
  isExpanded,
  onToggleExpanded,
  onChangeDay,
  onChangePeriod,
  onLocate,
  onLayout,
}: MapHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 px-4"
      style={{ paddingTop: insets.top + TOP_GAP }}
      onLayout={onLayout}
    >
      {isExpanded ? (
        <View
          className="gap-3 rounded-[28px] bg-white p-[14px]"
          style={shadows.soft}
        >
          <View className="flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ascunde alegerea zilei"
              accessibilityState={{ expanded: true }}
              onPress={onToggleExpanded}
              className="flex-1 flex-row items-center gap-3"
            >
              <LocationBadge />
              <View className="flex-1">
                <AppText numberOfLines={1} className="font-bold text-[17px]">
                  {city}
                </AppText>
                <AppText numberOfLines={1} className="text-[12px] text-navy">
                  {schoolName} · {weekLabel}
                </AppText>
              </View>
              <ChevronUp
                size={20}
                color={colors.navy}
                strokeWidth={ICON_STROKE_WIDTH}
              />
            </Pressable>
            <LocateButton onPress={onLocate} />
          </View>

          <DaySelector days={days} value={day} onChange={onChangeDay} />
          <PeriodToggle
            value={period}
            destinationName={schoolShortName}
            times={periodTimes}
            onChange={onChangePeriod}
          />
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${dayLabel}, ${city}. Alege ziua`}
            accessibilityState={{ expanded: false }}
            onPress={onToggleExpanded}
            className="h-12 flex-1 flex-row items-center gap-2 rounded-full bg-white pl-[6px] pr-3"
            style={shadows.soft}
          >
            <LocationBadge size={36} />
            <View className="flex-1">
              <AppText numberOfLines={1} className="font-bold text-[14px]">
                {dayLabel}
              </AppText>
              <AppText numberOfLines={1} className="text-[11px] text-navy">
                {city} · {schoolName}
              </AppText>
            </View>
            <ChevronDown
              size={18}
              color={colors.navy}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </Pressable>
          <CompactPeriodToggle value={period} onChange={onChangePeriod} />
          <LocateButton onPress={onLocate} />
        </View>
      )}
    </View>
  );
}

function LocationBadge({ size = 44 }: { size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-full bg-peach/[0.28]"
      style={{ width: size, height: size }}
    >
      <MapPin
        size={size * 0.45}
        color={colors.ink}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </View>
  );
}

function LocateButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Arată locația mea"
      onPress={onPress}
      hitSlop={4}
      className="h-12 w-12 items-center justify-center rounded-full bg-navy"
      style={shadows.soft}
    >
      <LocateFixed
        size={20}
        color={colors.mint}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </Pressable>
  );
}

const COMPACT_PERIODS = [
  { value: 'morning', label: 'Dimineață', Icon: Sun },
  { value: 'afternoon', label: 'După-amiază', Icon: Sunset },
] as const;

/** Sun and moon only, so the period can be switched without opening the panel. */
function CompactPeriodToggle({
  value,
  onChange,
}: {
  value: MapPeriod;
  onChange: (period: MapPeriod) => void;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      className="h-12 flex-row items-center gap-1 rounded-full bg-white px-1"
      style={shadows.soft}
    >
      {COMPACT_PERIODS.map(({ value: period, label, Icon }) => {
        const isActive = period === value;

        return (
          <Pressable
            key={period}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(period)}
            className={`h-10 w-10 items-center justify-center rounded-full ${
              isActive ? 'bg-navy' : ''
            }`}
          >
            <Icon
              size={18}
              color={isActive ? colors.mint : colors.steel}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
