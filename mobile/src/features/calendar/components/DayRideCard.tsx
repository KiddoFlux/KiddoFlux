import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { shadows } from '@/theme/shadows';

import type { CalendarRide } from '../types';

function getSubtitle(ride: CalendarRide): string {
  if (ride.driverName === null) {
    return `Conduci tu · ${ride.seatsTaken} din ${ride.seatsTotal} locuri`;
  }

  const childNames = ride.children.map((child) => child.name).join(', ');
  return `Conduce ${ride.driverName} · ${childNames}`;
}

type DayRideCardProps = {
  ride: CalendarRide;
  onPress: () => void;
};

export function DayRideCard({ ride, onPress }: DayRideCardProps) {
  const isMyRide = ride.driverName === null;
  const title = ride.direction === 'toSchool' ? 'Spre școală' : 'Spre casă';
  const subtitle = getSubtitle(ride);
  const childNames = ride.children.map((child) => child.name).join(', ');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${title}, plecare la ${ride.departureTime}, sosire la ${ride.arrivalTime}. ${
        ride.driverName === null ? 'Conduci tu' : `Conduce ${ride.driverName}`
      }. Copii: ${childNames}. Deschide detaliile.`}
      onPress={onPress}
      className="flex-row gap-3 rounded-[28px] bg-white p-3"
      style={shadows.soft}
    >
      <View
        className={`h-[84px] w-[76px] items-center justify-center rounded-[20px] ${
          isMyRide ? 'bg-navy' : 'bg-steel/[0.14]'
        }`}
      >
        <AppText
          numberOfLines={1}
          className={`text-[20px] ${isMyRide ? 'text-mint' : 'text-ink'}`}
        >
          {ride.departureTime}
        </AppText>
        <AppText
          numberOfLines={1}
          className={`text-[12px] ${isMyRide ? 'text-sage' : 'text-navy'}`}
        >
          → {ride.arrivalTime}
        </AppText>
      </View>

      <View className="flex-1 gap-[6px]">
        <AppText numberOfLines={1} className="text-[17px]">
          {title}
        </AppText>

        <AppText numberOfLines={1} className="text-[12px] text-navy">
          {subtitle}
        </AppText>

        <AvatarStack
          items={ride.children}
          size={30}
          overlap={8}
          ringWidth={2}
        />
      </View>
    </PressableScale>
  );
}
