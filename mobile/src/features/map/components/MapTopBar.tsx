import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { MapPeriod } from '../types';
import { LiveChip } from './LiveChip';
import { PeriodToggle } from './PeriodToggle';

const TOP_PADDING = 26;

type MapTopBarProps = {
  period: MapPeriod;
  /** Set while a live ride is hidden, to bring it back. */
  onResumeLive: (() => void) | null;
  onChangePeriod: (period: MapPeriod) => void;
  onSearch: () => void;
  onOpenFilters: () => void;
};

export function MapTopBar({
  period,
  onResumeLive,
  onChangePeriod,
  onSearch,
  onOpenFilters,
}: MapTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 gap-3 px-5"
      style={{ paddingTop: insets.top + TOP_PADDING }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Curse în zona ta"
          onPress={onSearch}
          className="h-14 flex-1 flex-row items-center gap-3 rounded-full bg-white px-5"
          style={shadows.soft}
        >
          <Search
            size={20}
            color={colors.ink}
            strokeWidth={ICON_STROKE_WIDTH}
          />
          <AppText numberOfLines={1} className="flex-1 text-[15px] text-navy">
            Curse în zona ta
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filtre"
          onPress={onOpenFilters}
          className="h-14 w-14 items-center justify-center rounded-full bg-navy"
          style={shadows.soft}
        >
          <SlidersHorizontal
            size={22}
            color={colors.mint}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </Pressable>
      </View>

      <View
        pointerEvents="box-none"
        className="flex-row flex-wrap items-center justify-between gap-2"
      >
        <PeriodToggle value={period} onChange={onChangePeriod} />
        {onResumeLive ? <LiveChip label="Live" onPress={onResumeLive} /> : null}
      </View>
    </View>
  );
}
