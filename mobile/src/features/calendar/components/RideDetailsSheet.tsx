import { TriangleAlert, X } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import type { Child } from '@/types/ride';

import type { CalendarRide } from '../types';

const DRIVER_AVATAR_SIZE = 48;
const CHILD_AVATAR_SIZE = 40;

function ChildRow({ child, isMine }: { child: Child; isMine: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={isMine ? `${child.name}, copilul tău` : child.name}
      className={`flex-row items-center gap-3 rounded-[20px] border-[1.5px] p-2 ${
        isMine ? 'border-peach bg-peach/25' : 'border-transparent'
      }`}
    >
      <Avatar
        initial={child.initial}
        tone={child.tone}
        size={CHILD_AVATAR_SIZE}
        ringWidth={2}
      />
      <AppText numberOfLines={1} className="flex-1 text-[16px]">
        {child.name}
      </AppText>
      {isMine ? (
        <View className="rounded-full bg-peach px-[10px] py-1">
          <AppText numberOfLines={1} className="text-[12px]">
            Copilul tău
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

type RideDetailsSheetProps = {
  ride: CalendarRide;
  dateLabel: string;
  myChildrenIds: readonly string[];
  onClose: () => void;
};

export function RideDetailsSheet({
  ride,
  dateLabel,
  myChildrenIds,
  onClose,
}: RideDetailsSheetProps) {
  const title = ride.direction === 'toSchool' ? 'Spre școală' : 'Spre casă';
  const isMyRide = ride.driverName === null;

  const isMine = (child: Child) => myChildrenIds.includes(child.id);
  // The parent's own child comes first, so it never has to be searched for.
  const children = [
    ...ride.children.filter(isMine),
    ...ride.children.filter((child) => !isMine(child)),
  ];

  return (
    <BottomSheet closeLabel="Închide detaliile cursei" onClose={onClose}>
      <View className="gap-3 bg-navy px-5 pb-[18px] pt-5">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <AppText
              accessibilityRole="header"
              numberOfLines={1}
              className="text-[22px] text-mint"
            >
              {title}
            </AppText>
            <AppText numberOfLines={1} className="text-[13px] text-sage">
              {dateLabel}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Închide detaliile cursei"
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-mint/[0.16]"
          >
            <X size={22} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
          </Pressable>
        </View>

        <View
          accessible
          accessibilityLabel={`Plecare la ${ride.departureTime}, sosire la ${ride.arrivalTime}`}
          className="flex-row items-baseline gap-2"
        >
          <AppText className="text-[40px] tracking-[-1px] text-mint">
            {ride.departureTime}
          </AppText>
          <AppText className="text-[20px] text-sage">
            → {ride.arrivalTime}
          </AppText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-5 pt-[18px]"
      >
        <View className="gap-2">
          <AppText className="text-[13px] text-navy">Șofer</AppText>
          <View
            accessible
            accessibilityLabel={
              isMyRide ? 'Conduci tu' : `Conduce ${ride.driverName}`
            }
            className="flex-row items-center gap-3 rounded-[20px] bg-steel/10 p-3"
          >
            <Avatar
              initial={isMyRide ? 'T' : (ride.driverName?.[0] ?? '')}
              tone="sage"
              size={DRIVER_AVATAR_SIZE}
            />
            <AppText numberOfLines={1} className="flex-1 text-[18px]">
              {isMyRide ? 'Conduci tu' : ride.driverName}
            </AppText>
          </View>

          {ride.needsReplacement ? (
            <View className="h-[26px] flex-row items-center gap-1 self-start rounded-full bg-peach/35 px-[10px]">
              <TriangleAlert
                size={12}
                color={colors.ink}
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <AppText numberOfLines={1} className="text-[12px]">
                Se caută înlocuitor
              </AppText>
            </View>
          ) : null}
        </View>

        <View className="gap-2">
          <View className="flex-row items-baseline justify-between gap-3">
            <AppText numberOfLines={1} className="text-[13px] text-navy">
              Copii în mașină
            </AppText>
            <AppText numberOfLines={1} className="text-[13px] text-navy">
              {ride.seatsTaken} din {ride.seatsTotal} locuri
            </AppText>
          </View>
          <View className="gap-1">
            {children.map((child) => (
              <ChildRow key={child.id} child={child} isMine={isMine(child)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
