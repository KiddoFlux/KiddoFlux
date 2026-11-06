import { useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type { MapRide } from '../types';
import { PageDots } from './PageDots';
import { RideCard } from './RideCard';

const CARD_WIDTH_INSET = 68;
const CARD_GAP = 10;
const SIDE_PADDING = 20;
/** Room for the cards' strong shadow, which the list would otherwise clip. */
const SHADOW_ROOM = 24;

type RideCarouselProps = {
  rides: readonly MapRide[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onCallDriver: (ride: MapRide) => void;
  onOpenLive: (ride: MapRide) => void;
};

export function RideCarousel({
  rides,
  selectedIndex,
  onSelectIndex,
  onCallDriver,
  onOpenLive,
}: RideCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<MapRide>>(null);

  const cardWidth = screenWidth - CARD_WIDTH_INSET;
  const interval = cardWidth + CARD_GAP;

  // Follows the selection when it changes from a marker or the next button.
  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: selectedIndex * interval,
      animated: true,
    });
  }, [selectedIndex, interval]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / interval);
    const clamped = Math.min(Math.max(index, 0), rides.length - 1);
    if (clamped !== selectedIndex) onSelectIndex(clamped);
  };

  return (
    <View pointerEvents="box-none" className="gap-[10px]">
      <FlatList
        ref={listRef}
        horizontal
        data={rides}
        keyExtractor={(ride) => ride.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          gap: CARD_GAP,
          paddingLeft: SIDE_PADDING,
          // Lets the last card snap into the same spot as the others.
          paddingRight: screenWidth - cardWidth - SIDE_PADDING,
          paddingTop: SHADOW_ROOM,
          paddingBottom: SHADOW_ROOM,
        }}
        getItemLayout={(_data, index) => ({
          length: cardWidth,
          offset: SIDE_PADDING + index * interval,
          index,
        })}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item, index }) => (
          <RideCard
            ride={item}
            width={cardWidth}
            position={index + 1}
            total={rides.length}
            onCallDriver={() => onCallDriver(item)}
            onOpenLive={() => onOpenLive(item)}
            onNext={() => onSelectIndex((index + 1) % rides.length)}
          />
        )}
      />
      <PageDots count={rides.length} activeIndex={selectedIndex} />
    </View>
  );
}
