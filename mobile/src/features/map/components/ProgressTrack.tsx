import { Car, Flag } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

const TRACK_HEIGHT = 32;

type ProgressTrackProps = {
  /** From 0 to 1. */
  progress: number;
  accessibilityLabel: string;
};

export function ProgressTrack({
  progress,
  accessibilityLabel,
}: ProgressTrackProps) {
  const [width, setWidth] = useState(0);
  const clamped = Math.min(Math.max(progress, 0), 1);
  // The car's center travels from the track's start to the flag's center.
  const travel = Math.max(width - TRACK_HEIGHT, 0);
  const knobLeft = travel * clamped;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      className="justify-center"
      style={{ height: TRACK_HEIGHT }}
    >
      <View className="absolute inset-x-0 h-2 rounded-full bg-mint/20" />
      <View
        className="absolute left-0 h-2 rounded-full bg-peach"
        style={{ width: knobLeft + TRACK_HEIGHT / 2 }}
      />

      <View className="absolute right-0 h-8 w-8 items-center justify-center rounded-full bg-mint">
        <Flag size={16} color={colors.navy} strokeWidth={ICON_STROKE_WIDTH} />
      </View>

      <View
        className="absolute h-8 w-8 items-center justify-center rounded-full border-[3px] border-navy bg-peach"
        style={{ left: knobLeft }}
      >
        <Car size={14} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
    </View>
  );
}
