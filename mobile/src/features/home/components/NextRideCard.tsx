import { ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { NextRide } from '../types';

type NextRideCardProps = {
  ride: NextRide;
  onPress: () => void;
};

function CardDecoration() {
  return (
    <View className="absolute right-0 top-0" pointerEvents="none">
      <Svg width={170} height={120} viewBox="0 0 170 120">
        <Circle
          cx={140}
          cy={22}
          r={52}
          fill={colors.steel}
          fillOpacity={0.35}
        />
        <Path
          d="M18 96 C 58 40, 100 104, 164 34"
          fill="none"
          stroke={colors.mint}
          strokeWidth={3}
          strokeDasharray="0 7"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export function NextRideCard({ ride, onPress }: NextRideCardProps) {
  const childNames = ride.children.map((child) => child.name).join(', ');
  const destination = ride.direction === 'toSchool' ? 'la școală' : 'acasă';
  // Only "azi" reads differently here; "mâine" or "luni" stay accurate as they are.
  const driverDay = ride.dayLabel === 'azi' ? 'astăzi' : ride.dayLabel;
  const driverLabel = ride.driverName
    ? `${ride.driverName} conduce ${driverDay}`
    : `Tu conduci ${driverDay}`;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Următoarea cursă ${ride.dayLabel}, plecare la ${ride.departureTime}, ${destination} la ${ride.arrivalTime}, copii: ${childNames}. ${driverLabel}. Deschide calendarul.`}
      onPress={onPress}
      className="rounded-[28px] bg-navy"
      style={shadows.strong}
    >
      {/* Clipping lives on an inner view so iOS keeps the outer shadow. */}
      <View className="gap-3 overflow-hidden rounded-[28px] p-5">
        <CardDecoration />

        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-peach" />
          <AppText numberOfLines={1} className="text-[13px] text-mint">
            Următoarea cursă · {ride.dayLabel}
          </AppText>
        </View>

        <View className="flex-row items-baseline gap-2">
          <AppText className="text-[52px] tracking-[-1.5px] text-mint">
            {ride.departureTime}
          </AppText>
          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            className="flex-1 text-[18px] text-sage"
          >
            → {destination} {ride.arrivalTime}
          </AppText>
        </View>

        <View className="h-px bg-mint/20" />

        <View className="flex-row items-center gap-3">
          <AvatarStack items={ride.children} ringColor={colors.navy} />
          <AppText numberOfLines={1} className="flex-1 text-[15px] text-mint">
            {driverLabel}
          </AppText>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-peach">
            <ArrowRight
              size={22}
              color={colors.ink}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </View>
        </View>
      </View>
    </PressableScale>
  );
}
