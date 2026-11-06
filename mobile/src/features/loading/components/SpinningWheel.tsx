import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../../../theme/colors';

const BOX_WIDTH = 240;
const BOX_HEIGHT = 190;

// Only this vertical slice of the box holds drawing (wheel top → wheel bottom),
// so the rendered component is trimmed to it and sits snug against its neighbours.
const CROP_TOP = 52;
const CROP_BOTTOM = 148;

const TYRE_RADIUS = 45;
const WHEEL_SIZE = TYRE_RADIUS * 2;
const WHEEL_CENTER = { x: BOX_WIDTH / 2, y: 101 };

const SPIN_MS = 1200;
const PUFF_MS = 1600;
const PUFF_STAGGER_MS = 400;

// Circumference of the grip ring (r=40) split into 20 evenly spaced tread blocks.
const GRIP_RADIUS = 40;
const GRIP_PERIOD = (2 * Math.PI * GRIP_RADIUS) / 20;
const GRIP_DASH = `6.5 ${(GRIP_PERIOD - 6.5).toFixed(3)}`;

const SPOKE_ANGLES = [0, 72, 144, 216, 288] as const;
const SPOKE_DISTANCE = 17;

type Puff = { cx: number; cy: number; r: number };

const PUFFS: readonly Puff[] = [
  { cx: 70, cy: 138, r: 8 },
  { cx: 64, cy: 142, r: 6 },
  { cx: 74, cy: 143, r: 7 },
  { cx: 68, cy: 136, r: 5 },
];

function DustPuff({
  puff,
  index,
  animate,
}: {
  puff: Puff;
  index: number;
  animate: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      index * PUFF_STAGGER_MS,
      withRepeat(
        withTiming(1, { duration: PUFF_MS, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(progress);
  }, [animate, index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: animate ? interpolate(progress.value, [0, 1], [0.9, 0]) : 0,
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, -56]) },
      { translateY: interpolate(progress.value, [0, 1], [0, -18]) },
      { scale: interpolate(progress.value, [0, 1], [0.5, 1.6]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: puff.cx - puff.r,
          top: puff.cy - puff.r,
          width: puff.r * 2,
          height: puff.r * 2,
          borderRadius: puff.r,
          backgroundColor: colors.sage,
        },
        style,
      ]}
    />
  );
}

/** Rendered height of the (trimmed) illustration at a given scale. */
export const getWheelHeight = (scale: number) =>
  (CROP_BOTTOM - CROP_TOP) * scale;

type SpinningWheelProps = {
  /** Uniform scale of the whole illustration (wheel, dust and ground line). */
  scale?: number;
};

export default function SpinningWheel({ scale = 1 }: SpinningWheelProps) {
  const reducedMotion = useReducedMotion();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(rotation);
      rotation.value = 0;
      return;
    }
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: SPIN_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [reducedMotion, rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Roată de mașină care se rotește"
      style={{
        width: BOX_WIDTH * scale,
        height: (CROP_BOTTOM - CROP_TOP) * scale,
      }}
    >
      {/* Decorative layers are hidden from screen readers; the wheel carries the label.
          The whole illustration is drawn at full size and scaled down from its top-left. */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          left: 0,
          top: -CROP_TOP * scale,
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
          transform: [{ scale }],
          transformOrigin: 'top left',
        }}
      >
        {PUFFS.map((puff, i) => (
          <DustPuff key={i} puff={puff} index={i} animate={!reducedMotion} />
        ))}

        {/* Own square box, so rotating it pivots exactly around the wheel center. */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: WHEEL_CENTER.x - TYRE_RADIUS,
              top: WHEEL_CENTER.y - TYRE_RADIUS,
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
            },
            spinStyle,
          ]}
        >
          <Svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`${-TYRE_RADIUS} ${-TYRE_RADIUS} ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          >
            <Circle r={TYRE_RADIUS} fill={colors.tyre} />
            <Circle
              r={GRIP_RADIUS}
              fill="none"
              stroke={colors.tread}
              strokeWidth={8}
              strokeDasharray={GRIP_DASH}
            />
            <Circle r={32} fill={colors.ink} />
            <Circle r={27} fill={colors.sage} />
            {SPOKE_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <Circle
                  key={deg}
                  cx={SPOKE_DISTANCE * Math.sin(rad)}
                  cy={-SPOKE_DISTANCE * Math.cos(rad)}
                  r={6}
                  fill={colors.navy}
                />
              );
            })}
            <Circle r={7} fill={colors.peach} />
            <Circle r={2} fill={colors.ink} />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}
