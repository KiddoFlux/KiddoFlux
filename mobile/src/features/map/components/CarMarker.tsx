import { Car } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

const CAR_SIZE = 52;
const HALO_WIDTH = 10;
const HALO_SIZE = CAR_SIZE + HALO_WIDTH * 2;
const HALO_OPACITY = 0.3;
const PULSE_SCALE = 1.12;
const PULSE_MS = 1200;

export function CarMarker() {
  const scale = useRef(new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale.current, {
          toValue: PULSE_SCALE,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale.current, {
          toValue: 1,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View
      className="items-center justify-center"
      // Leaves room for the halo at its largest, so the marker doesn't clip it.
      style={{
        width: HALO_SIZE * PULSE_SCALE,
        height: HALO_SIZE * PULSE_SCALE,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: HALO_SIZE,
          height: HALO_SIZE,
          borderRadius: HALO_SIZE / 2,
          backgroundColor: colors.peach,
          opacity: HALO_OPACITY,
          transform: [{ scale: scale.current }],
        }}
      />
      <View
        className="items-center justify-center rounded-full border-[3px] border-white bg-peach"
        style={{ width: CAR_SIZE, height: CAR_SIZE }}
      >
        <Car size={24} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
    </View>
  );
}
