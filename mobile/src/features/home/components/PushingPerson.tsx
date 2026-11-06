import { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/colors';

// Same height as an ActionPill, so his hands land on the middle of its edge.
export const PUSHING_PERSON_HEIGHT = 72;

const VIEW_BOX_WIDTH = 76;
const PUSH_MS = 650;
// He is drawn at full size, then shrunk. The transform keeps his feet on the pill's
// bottom line and his hands on its right edge.
const PERSON_TRANSFORM = 'translate(0.8 17.1) scale(0.78)';
// How far he leans into the pill and eases back, in px.
const LEAN_IN = -1.5;
const EASE_BACK = 2;

/**
 * A tiny bubble person standing to the right of the pill, hands on its edge,
 * pushing it. Fills the free space beside the pill and stays pinned to it.
 */
export function PushingPerson() {
  const reducedMotion = useReducedMotion();
  const push = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(push);
      push.value = 0;
      return;
    }
    push.value = withRepeat(
      withTiming(1, { duration: PUSH_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(push);
  }, [reducedMotion, push]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(push.value, [0, 1], [LEAN_IN, EASE_BACK]) },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      // Purely decorative.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="flex-1"
      style={[{ height: PUSHING_PERSON_HEIGHT }, style]}
    >
      <Svg
        width="100%"
        height={PUSHING_PERSON_HEIGHT}
        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${PUSHING_PERSON_HEIGHT}`}
        preserveAspectRatio="xMinYMid meet"
      >
        <G transform={PERSON_TRANSFORM}>
          {/* Ground shadow. */}
          <Ellipse
            cx={46}
            cy={67}
            rx={22}
            ry={2.4}
            fill={colors.steel}
            fillOpacity={0.25}
          />

          {/* Effort marks behind him. */}
          <Path
            d="M65 27 L71 25 M66 34 L73 34 M65 41 L71 43"
            stroke={colors.steel}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />

          {/* Legs: back leg stretched out, front leg bent, like leaning into a push. */}
          <Path
            d="M43 47 L61 64 M42 48 L40 57 L33 64"
            stroke={colors.ink}
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Body, leaning forward. */}
          <Path
            d="M43 47 L31 30"
            stroke={colors.navy}
            strokeWidth={15}
            strokeLinecap="round"
            fill="none"
          />

          {/* Arms reaching the pill's edge. */}
          <Path
            d="M31 30 L4 30 M33 34 L4 38"
            stroke={colors.navy}
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx={3.6} cy={30} r={3.4} fill={colors.peach} />
          <Circle cx={3.6} cy={38} r={3.4} fill={colors.peach} />

          {/* Head, looking at the pill. */}
          <Circle cx={28} cy={16} r={9} fill={colors.peach} />
          <Circle cx={23.5} cy={15.5} r={1.5} fill={colors.ink} />
        </G>
      </Svg>
    </Animated.View>
  );
}
