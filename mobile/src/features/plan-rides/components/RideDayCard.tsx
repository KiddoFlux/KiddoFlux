import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import { hasInvalidTimeOrder } from '../rideRules';
import { RIDE_SLOTS } from '../rideSlots';
import type { RideDirection, RideDraft, WeekDay } from '../types';
import { SeatsField } from './SeatsField';
import { TimeField } from './TimeField';

type RideDayCardProps = {
  day: WeekDay;
  getRide: (direction: RideDirection) => RideDraft | undefined;
  maxSeats: number;
  onChangeRide: (direction: RideDirection, changes: Partial<RideDraft>) => void;
};

export function RideDayCard({
  day,
  getRide,
  maxSeats,
  onChangeRide,
}: RideDayCardProps) {
  return (
    <View
      className="gap-4 rounded-[28px] bg-white p-[18px]"
      style={shadows.soft}
    >
      <AppText numberOfLines={1} className="text-[18px]">
        {day.fullName}, {day.dayOfMonth}
      </AppText>

      {RIDE_SLOTS.map(({ direction, label, routeLabel, Icon }) => {
        const ride = getRide(direction);
        if (!ride) return null;

        const a11yContext = `${day.fullName}, ${label}`;

        return (
          <View key={direction} className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icon
                size={18}
                color={colors.steel}
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <AppText
                numberOfLines={1}
                className="flex-1 text-[13px] text-navy"
              >
                {label} · {routeLabel}
              </AppText>
            </View>

            <View className="flex-row gap-2">
              <TimeField
                label="Plecare"
                value={ride.departureTime}
                tone="steel"
                accessibilityLabel={`Alege ora de plecare, ${a11yContext}`}
                onChange={(departureTime) =>
                  onChangeRide(direction, { departureTime })
                }
              />
              <TimeField
                label="Ajung la"
                value={ride.arrivalTime}
                tone="peach"
                accessibilityLabel={`Alege ora de sosire, ${a11yContext}`}
                onChange={(arrivalTime) =>
                  onChangeRide(direction, { arrivalTime })
                }
              />
              <SeatsField
                value={ride.seats}
                max={maxSeats}
                dayName={a11yContext}
                onChange={(seats) => onChangeRide(direction, { seats })}
              />
            </View>

            {hasInvalidTimeOrder(ride) ? (
              <AppText
                accessibilityLiveRegion="polite"
                className="text-[13px] text-navy"
              >
                Ora de plecare trebuie să fie înainte de ora de sosire.
              </AppText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
