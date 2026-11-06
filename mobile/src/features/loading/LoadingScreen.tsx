import { Image, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingBar from './components/LoadingBar';
import SpinningWheel, { getWheelHeight } from './components/SpinningWheel';

export const APP_NAME = 'KiddoFlux';

// Transparent wordmark (KIDDOFLUX + DRUM BUN), cropped to 1001×232 px.
const logo = require('../../../assets/logo.png');
const LOGO_ASPECT_RATIO = 1001 / 232;
const LOGO_MAX_WIDTH = 320;
const LOGO_SIDE_PADDING = 20; // matches px-5 on the logo container
// Fine-tunes the logo's vertical position, in px. More negative = lower.
const LOGO_NUDGE_DOWN = -6;

// Wheel illustration, drawn at this fraction of its full size.
const WHEEL_SCALE = 0.6;

// Space between the "Se încarcă…" text and the bottom of the screen (plus the safe-area
// inset). The logo, wheel and bar all hang from this point, so raising it moves them up.
const BOTTOM_OFFSET = 100;

export type LoadingScreenProps = {
  /** 0–1. When set, the bar follows it instead of filling over time. */
  progress?: number;
  /** Time-based fill duration when `progress` isn't passed. */
  durationMs?: number;
  /** Called once when the bar is full. */
  onFinished?: () => void;
};

/**
 * The logo is pinned in the top half of the screen, bottom edge one logo height below the spot just above the vertical
 * center. The wheel and loading bar hang as one group from the bottom of the screen
 * (BOTTOM_OFFSET), independent of the logo.
 */
export default function LoadingScreen({
  progress,
  durationMs = 2400,
  onFinished,
}: LoadingScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // The logo sits exactly one logo height below its old "just above center" spot.
  const logoWidth = Math.min(
    LOGO_MAX_WIDTH,
    screenWidth - LOGO_SIDE_PADDING * 2,
  );
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  return (
    <View
      className="flex-1 items-center bg-navy"
      style={{ paddingBottom: insets.bottom + BOTTOM_OFFSET }}
    >
      {/* Logo: top half of the screen, bottom edge one logo height below the spot just above the vertical center. */}
      <View
        pointerEvents="none"
        className="absolute inset-x-0 top-0 h-1/2 items-center justify-end px-5"
      >
        <Image
          source={logo}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel={`${APP_NAME} – Drum bun`}
          style={{
            width: '100%',
            maxWidth: LOGO_MAX_WIDTH,
            aspectRatio: LOGO_ASPECT_RATIO,
            marginBottom:
              getWheelHeight(WHEEL_SCALE) / 2 + LOGO_NUDGE_DOWN - logoHeight,
          }}
        />
      </View>

      {/* Takes the leftover space so the wheel + bar group stays at the bottom. */}
      <View className="flex-1" />

      <SpinningWheel scale={WHEEL_SCALE} />

      <View className="items-center self-stretch pt-5">
        <LoadingBar
          progress={progress}
          durationMs={durationMs}
          onFinished={onFinished}
        />
      </View>
    </View>
  );
}
