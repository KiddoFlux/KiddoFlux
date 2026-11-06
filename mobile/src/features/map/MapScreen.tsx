import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

import { CarMarker } from './components/CarMarker';
import { EmptyRidesCard } from './components/EmptyRidesCard';
import { LiveStatusSheet } from './components/LiveStatusSheet';
import { LiveTopBar } from './components/LiveTopBar';
import {
  MapCanvas,
  type MapCanvasHandle,
  type MapLineSpec,
  type MapMarkerSpec,
} from './components/MapCanvas';
import { MapTopBar } from './components/MapTopBar';
import { RideCarousel } from './components/RideCarousel';
import { RideMarker } from './components/RideMarker';
import { SchoolMarker } from './components/SchoolMarker';
import { useLiveRide } from './hooks/useLiveRide';
import { useLocationPermission } from './hooks/useLocationPermission';
import { useMapMode } from './hooks/useMapMode';
import type { LatLng, MapPeriod, MapRide } from './types';
import {
  getDefaultPeriod,
  getPeriodDirection,
  involvesMe,
  routeLengthMeters,
  splitRoute,
} from './utils';

const CLOCK_TICK_MS = 15_000;
const CAROUSEL_GAP = 18;
const NOTE_DURATION_MS = 2500;
const CONFIRMED_DURATION_MS = 1500;
const ARRIVED_LIVE_WINDOW_MS = 10 * 60_000;

const NO_ROUTE: readonly LatLng[] = [];
/** Keeps the route clear of the top bar and the bottom sheet. */
const LIVE_FIT_INSETS = { top: 130, right: 50, bottom: 440, left: 50 };

export type MapScreenProps = {
  rides: readonly MapRide[];
  school: LatLng;
  myChildrenIds: readonly string[];
  liveRoutes: Readonly<Record<string, readonly LatLng[]>>;
  /** Fixes the clock, for tests. Otherwise the real time is used. */
  nowMs?: number;
  /** Where the live mock starts, from 0 to 1. */
  liveStartProgress?: number;
  onCallDriver: (ride: MapRide) => void;
  onMessageDriver: (ride: MapRide) => void;
  onConfirmArrival: (rideId: string) => void;
  onPlanRides: () => void;
  onSearch: () => void;
  onOpenFilters: () => void;
  onLiveModeChange: (isLive: boolean) => void;
};

export function MapScreen({
  rides,
  school,
  myChildrenIds,
  liveRoutes,
  nowMs,
  liveStartProgress,
  onCallDriver,
  onMessageDriver,
  onConfirmArrival,
  onPlanRides,
  onSearch,
  onOpenFilters,
  onLiveModeChange,
}: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapCanvasHandle>(null);
  const hasLocation = useLocationPermission();

  const [clockMs, setClockMs] = useState(() => Date.now());
  const now = nowMs ?? clockMs;
  const [period, setPeriod] = useState<MapPeriod>(() => getDefaultPeriod(now));
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [isLiveDismissed, setIsLiveDismissed] = useState(false);
  const [openedLiveRideId, setOpenedLiveRideId] = useState<string | null>(null);
  const [confirmingRideId, setConfirmingRideId] = useState<string | null>(null);
  const [finishedRideIds, setFinishedRideIds] = useState<readonly string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Keeps "Actualizat acum 2 min" current.
  useEffect(() => {
    const timer = setInterval(() => setClockMs(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (note === null) return undefined;
    const timer = setTimeout(() => setNote(null), NOTE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [note]);

  useEffect(() => {
    if (confirmingRideId === null) return undefined;
    const timer = setTimeout(() => {
      setFinishedRideIds((current) => [...current, confirmingRideId]);
      setOpenedLiveRideId(null);
      setConfirmingRideId(null);
    }, CONFIRMED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [confirmingRideId]);

  const openRides = useMemo(
    () =>
      rides.filter(
        (ride) =>
          ride.status !== 'cancelled' && !finishedRideIds.includes(ride.id),
      ),
    [rides, finishedRideIds],
  );

  // Live mode
  const autoMode = useMapMode(openRides, myChildrenIds, now);
  const liveRideId = openedLiveRideId ?? autoMode.liveRideId ?? null;
  const liveRide = openRides.find((ride) => ride.id === liveRideId) ?? null;
  const live = useLiveRide({
    ride: liveRide,
    route: liveRide ? (liveRoutes[liveRide.id] ?? NO_ROUTE) : NO_ROUTE,
    startProgress: liveStartProgress,
  });

  const isArrivalOver =
    live?.arrivedAtMs != null &&
    now - live.arrivedAtMs > ARRIVED_LIVE_WINDOW_MS;
  const canShowLive = live !== null && !isArrivalOver;
  const isLive = canShowLive && !isLiveDismissed;
  const liveRoute = live?.route;
  const followedRideId = isLive ? live.rideId : null;

  useEffect(() => {
    onLiveModeChange(isLive);
  }, [isLive, onLiveModeChange]);

  // Browse mode
  const periodRides = useMemo(
    () =>
      openRides.filter((ride) => ride.direction === getPeriodDirection(period)),
    [openRides, period],
  );
  const foundIndex = periodRides.findIndex(
    (ride) => ride.id === selectedRideId,
  );
  const selectedIndex = Math.max(foundIndex, 0);
  const selectedRide = periodRides[selectedIndex] ?? null;
  const selectedId = selectedRide?.id ?? null;
  const selectedLocation = selectedRide?.approxPickup ?? null;

  // The camera follows the selection, or fits the route while following a ride.
  useEffect(() => {
    if (!isMapReady) return;

    if (followedRideId !== null && liveRoute) {
      mapRef.current?.fitTo(liveRoute, LIVE_FIT_INSETS);
    } else if (selectedLocation) {
      mapRef.current?.focusOn(selectedLocation);
    } else {
      mapRef.current?.focusOn(school);
    }
    // Moves only when the followed or selected ride changes, not on every update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, followedRideId, selectedId]);

  const handleOpenLive = (ride: MapRide) => {
    const isUnderway =
      ride.status === 'pickedUp' || ride.status === 'inProgress';

    if (isUnderway && involvesMe(ride, myChildrenIds)) {
      setOpenedLiveRideId(ride.id);
      setIsLiveDismissed(false);
    } else {
      setNote('Status live apare când cursa pornește');
    }
  };

  const handleConfirmArrival = (rideId: string) => {
    onConfirmArrival(rideId);
    setConfirmingRideId(rideId);
  };

  const split = useMemo(
    () =>
      live
        ? splitRoute(live.route, routeLengthMeters(live.route) * live.progress)
        : null,
    [live],
  );

  const lines: MapLineSpec[] =
    isLive && split
      ? [
          {
            id: 'route-remaining',
            coordinates: split.remaining,
            color: colors.navy,
            width: 3,
            isDotted: true,
          },
          {
            id: 'route-completed',
            coordinates: split.completed,
            color: colors.navy,
            width: 5,
          },
        ]
      : [];

  const schoolMarker: MapMarkerSpec = {
    id: 'school',
    coordinate: school,
    accessibilityLabel: 'Școala',
    element: <SchoolMarker />,
  };
  const markers: MapMarkerSpec[] = isLive
    ? [
        schoolMarker,
        {
          id: 'car',
          coordinate: live.position,
          accessibilityLabel: 'Mașina',
          isMoving: true,
          element: <CarMarker />,
        },
      ]
    : [
        schoolMarker,
        ...periodRides.map((ride) => ({
          id: ride.id,
          coordinate: ride.approxPickup,
          accessibilityLabel: `Zona de plecare, ${ride.driver.name}`,
          element: <RideMarker isSelected={ride.id === selectedId} />,
          onPress: () => setSelectedRideId(ride.id),
        })),
      ];

  const myChildren =
    liveRide?.children.filter((child) => myChildrenIds.includes(child.id)) ??
    [];

  return (
    <View className="flex-1 bg-mint">
      <MapCanvas
        ref={mapRef}
        initialCenter={school}
        markers={markers}
        lines={lines}
        showsUserLocation={hasLocation}
        onReady={() => setIsMapReady(true)}
      />

      {isLive ? (
        <>
          <LiveTopBar
            lastUpdatedAt={live.lastUpdatedAt}
            nowMs={now}
            onBack={() => setIsLiveDismissed(true)}
          />
          {liveRide ? (
            <LiveStatusSheet
              ride={liveRide}
              live={live}
              myChildren={myChildren}
              isConfirmed={confirmingRideId === liveRide.id}
              onClose={() => setIsLiveDismissed(true)}
              onCallDriver={() => onCallDriver(liveRide)}
              onMessageDriver={() => onMessageDriver(liveRide)}
              onConfirmArrival={() => handleConfirmArrival(liveRide.id)}
            />
          ) : null}
        </>
      ) : (
        <>
          <MapTopBar
            period={period}
            onResumeLive={canShowLive ? () => setIsLiveDismissed(false) : null}
            onChangePeriod={(next) => {
              setPeriod(next);
              setSelectedRideId(null);
            }}
            onSearch={onSearch}
            onOpenFilters={onOpenFilters}
          />

          <View
            pointerEvents="box-none"
            className="absolute inset-x-0 gap-2"
            style={{
              bottom:
                insets.bottom +
                TAB_BAR_BOTTOM_GAP +
                TAB_BAR_HEIGHT +
                CAROUSEL_GAP,
            }}
          >
            {note ? (
              <View
                accessible
                accessibilityLiveRegion="polite"
                className="self-center rounded-full bg-ink px-4 py-2"
                style={shadows.dark}
              >
                <AppText numberOfLines={1} className="text-[13px] text-mint">
                  {note}
                </AppText>
              </View>
            ) : null}

            {periodRides.length > 0 ? (
              <RideCarousel
                rides={periodRides}
                selectedIndex={selectedIndex}
                onSelectIndex={(index) =>
                  setSelectedRideId(periodRides[index]?.id ?? null)
                }
                onCallDriver={onCallDriver}
                onOpenLive={handleOpenLive}
              />
            ) : (
              <EmptyRidesCard onPlanRides={onPlanRides} />
            )}
          </View>
        </>
      )}
    </View>
  );
}
