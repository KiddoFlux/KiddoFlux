import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import { minutesBetween } from '../utils';
import { LiveChip } from './LiveChip';

const TOP_PADDING = 26;
const FRESH_UPDATE_MS = 60_000;

function getUpdateLabel(lastUpdatedAt: number, nowMs: number): string {
  if (nowMs - lastUpdatedAt <= FRESH_UPDATE_MS) return 'Live · actualizat acum';
  return `Actualizat acum ${minutesBetween(lastUpdatedAt, nowMs)} min`;
}

type LiveTopBarProps = {
  lastUpdatedAt: number;
  nowMs: number;
  onBack: () => void;
};

export function LiveTopBar({ lastUpdatedAt, nowMs, onBack }: LiveTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 flex-row items-center justify-between gap-3 px-5"
      style={{ paddingTop: insets.top + TOP_PADDING }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Înapoi la curse"
        onPress={onBack}
        className="h-12 w-12 items-center justify-center rounded-full bg-white"
        style={shadows.soft}
      >
        <ChevronLeft
          size={24}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </Pressable>
      <LiveChip label={getUpdateLabel(lastUpdatedAt, nowMs)} />
    </View>
  );
}
