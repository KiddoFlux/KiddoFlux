import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import AppText from '../../../components/AppText';
import { colors } from '../../../theme/colors';

const TRACK_WIDTH = 150;
const TRACK_HEIGHT = 6;
const REDUCED_MOTION_FILL = 0.62;
const PROGRESS_TWEEN_MS = 250;

type LoadingBarProps = {
  /** 0–1. When set, the bar follows it; otherwise it fills over `durationMs`. */
  progress?: number;
  durationMs?: number;
  /** Called once, when the bar is full. */
  onFinished?: () => void;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function LoadingBar({
  progress,
  durationMs = 2400,
  onFinished,
}: LoadingBarProps) {
  const reducedMotion = useReducedMotion();
  const fill = useSharedValue(0);

  const firedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const fire = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onFinishedRef.current?.();
  }, []);

  const target = progress === undefined ? 1 : clamp01(progress);

  useEffect(() => {
    if (reducedMotion) {
      // Static bar, but the screen must still be able to finish.
      cancelAnimation(fill);
      fill.value = REDUCED_MOTION_FILL;
      if (target < 1) return;
      const id = setTimeout(fire, progress === undefined ? durationMs : 0);
      return () => clearTimeout(id);
    }

    fill.value = withTiming(
      target,
      {
        duration: progress === undefined ? durationMs : PROGRESS_TWEEN_MS,
        easing:
          progress === undefined ? Easing.linear : Easing.out(Easing.quad),
      },
      (finished) => {
        if (finished && target >= 1) scheduleOnRN(fire);
      },
    );
    return () => cancelAnimation(fill);
  }, [reducedMotion, target, progress, durationMs, fill, fire]);

  const fillStyle = useAnimatedStyle(() => ({
    width: fill.value * TRACK_WIDTH,
  }));

  return (
    <View className="items-center gap-3.5">
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Se încarcă aplicația"
        accessibilityValue={
          progress === undefined
            ? undefined
            : { min: 0, max: 100, now: Math.round(target * 100) }
        }
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: 'rgba(239, 251, 245, 0.2)',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              backgroundColor: colors.peach,
            },
            fillStyle,
          ]}
        />
      </View>
      <AppText
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="text-[13px] text-mint/80"
      >
        Se încarcă…
      </AppText>
    </View>
  );
}
