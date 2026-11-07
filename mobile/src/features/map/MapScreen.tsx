import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

import type { DayOption } from './components/DaySelector';
import { EmptyRidesCard } from './components/EmptyRidesCard';
import { HomeMarker } from './components/HomeMarker';
import {
  MapCanvas,
  type MapCanvasHandle,
  type MapLineSpec,
  type MapMarkerSpec,
} from './components/MapCanvas';
import { MapHeader } from './components/MapHeader';
import { PICKUP_MARKER_ANCHOR, PickupMarker } from './components/PickupMarker';
import { RideSheet } from './components/RideSheet';
import { SCHOOL_MARKER_ANCHOR, SchoolMarker } from './components/SchoolMarker';
import { useUserLocation } from './hooks/useUserLocation';
import type {
  CarpoolParent,
  CarpoolRide,
  LatLng,
  MapPeriod,
  RouteStop,
  School,
  SchoolDay,
} from './types';
import {
  distanceMeters,
  formatWeekLabel,
  getDefaultDay,
  getDefaultPeriod,
  getSchoolWeek,
  isSameDate,
} from './utils';

const SHEET_GAP = 14;
const FIT_PADDING = 6;
const FIT_SIDE_PADDING = 14;
const NOTE_DURATION_MS = 2500;
/** Closer than this, the user counts as being in the school's city. */
const SAME_CITY_METERS = 25_000;
/** Closer than this, the camera keeps the user in view along with the route. */
const ROUTE_AREA_METERS = 4_000;

const DAY_NAMES = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'] as const;

/** Animates the next layout change, so the panels grow and shrink smoothly. */
function animateLayout() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

export type MapScreenProps = {
  rides: readonly CarpoolRide[];
  parents: readonly CarpoolParent[];
  school: School;
  /** Where the map opens before the user's location is known. */
  defaultCenter: LatLng;
  myChildrenIds: readonly string[];
  /** Fixes the clock, for tests. Otherwise the real time is used. */
  nowMs?: number;
  onCallDriver: (driver: CarpoolParent) => void;
  onPlanRides: () => void;
};

function findRide(
  rides: readonly CarpoolRide[],
  day: SchoolDay,
  period: MapPeriod,
) {
  return (
    rides.find((ride) => ride.day === day && ride.period === period) ?? null
  );
}

export function MapScreen({
  rides,
  parents,
  school,
  defaultCenter,
  myChildrenIds,
  nowMs,
  onCallDriver,
  onPlanRides,
}: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapCanvasHandle>(null);
  const userLocation = useUserLocation();

  const [now] = useState(() => nowMs ?? Date.now());
  const week = useMemo(() => getSchoolWeek(now), [now]);
  const [day, setDay] = useState<SchoolDay>(() => getDefaultDay(now));
  const [period, setPeriod] = useState<MapPeriod>(() => getDefaultPeriod(now));
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (note === null) return undefined;
    const timer = setTimeout(() => setNote(null), NOTE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [note]);

  const ride = findRide(rides, day, period);

  const userCoordinate = userLocation.coordinate;
  const userDistance = userCoordinate
    ? distanceMeters(userCoordinate, school.coordinate)
    : Infinity;
  const isInSchoolCity = userDistance <= SAME_CITY_METERS;
  const keepsUserInView = userDistance <= ROUTE_AREA_METERS;
  const city = (isInSchoolCity && userLocation.city) || school.city;

  const bottomOffset =
    insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT + SHEET_GAP;

  // Frames the whole route between the compact header and sheet. The open
  // panels float over the map instead, so opening one never moves the camera.
  useEffect(() => {
    if (!isMapReady) return;

    if (!ride) {
      mapRef.current?.focusOn(
        isInSchoolCity && userCoordinate ? userCoordinate : school.coordinate,
      );
      return;
    }

    const points = [...ride.path, ...parents.map((parent) => parent.home)];
    if (keepsUserInView && userCoordinate) points.push(userCoordinate);

    mapRef.current?.fitTo(points, {
      top: headerHeight + FIT_PADDING,
      right: FIT_SIDE_PADDING,
      bottom: bottomOffset + sheetHeight + FIT_PADDING,
      left: FIT_SIDE_PADDING,
    });
    // Moves when the ride or the free space changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, ride?.id, headerHeight, sheetHeight, keepsUserInView]);

  const days: DayOption[] = week.map((date, index) => {
    const dayRide = findRide(rides, index as SchoolDay, period);
    return {
      date,
      isToday: isSameDate(date, new Date(now)),
      driver: dayRide
        ? {
            name: dayRide.driver.name,
            initial: dayRide.driver.initial,
            tone: dayRide.driver.tone,
          }
        : null,
    };
  });

  const periodTimes = {
    morning: findRide(rides, day, 'morning')?.departureTime,
    afternoon: findRide(rides, day, 'afternoon')?.departureTime,
  };

  const handleChangeDay = (next: SchoolDay) => {
    // Choosing a day is the panel's main job, so it closes right after.
    animateLayout();
    setDay(next);
    setSelectedStopId(null);
    setIsHeaderExpanded(false);
  };

  const toggleHeader = () => {
    animateLayout();
    setIsHeaderExpanded((current) => !current);
  };

  const toggleSheet = () => {
    animateLayout();
    setIsSheetExpanded((current) => !current);
  };

  const collapsePanels = () => {
    if (!isHeaderExpanded && !isSheetExpanded) return;
    animateLayout();
    setIsHeaderExpanded(false);
    setIsSheetExpanded(false);
  };

  const handleChangePeriod = (next: MapPeriod) => {
    setPeriod(next);
    setSelectedStopId(null);
  };

  const handleSelectStop = (stop: RouteStop) => {
    setSelectedStopId(stop.id);
    mapRef.current?.focusOn(stop.coordinate);
  };

  const handleLocate = () => {
    if (userCoordinate) {
      mapRef.current?.focusOn(userCoordinate);
    } else if (userLocation.isGranted) {
      setNote('Te căutăm pe hartă…');
    } else {
      setNote('Activează locația ca să te găsim pe hartă');
    }
  };

  const measure =
    (setHeight: (height: number) => void) => (event: LayoutChangeEvent) =>
      setHeight(Math.round(event.nativeEvent.layout.height));

  const driver = ride?.driver ?? null;
  const pickupStop = ride?.stops.find((stop) => stop.kind === 'pickup');

  // Dotted: the other families walk their children to the driver's home.
  const walkLines: MapLineSpec[] = driver
    ? parents
        .filter((parent) => parent.id !== driver.id)
        .map((parent) => ({
          id: `walk-${parent.id}`,
          coordinates: [parent.home, driver.home],
          color: colors.steel,
          width: 3,
          isDotted: true,
        }))
    : [];
  const lines: MapLineSpec[] = ride
    ? [
        ...walkLines,
        // A white casing under the route keeps it readable over any street.
        {
          id: 'route-casing',
          coordinates: ride.path,
          color: colors.white,
          width: 9,
        },
        { id: 'route', coordinates: ride.path, color: colors.navy, width: 5 },
      ]
    : [];

  const schoolMarker: MapMarkerSpec = {
    id: 'school',
    coordinate: school.coordinate,
    accessibilityLabel: school.name,
    anchor: SCHOOL_MARKER_ANCHOR,
    zIndex: 2,
    element: <SchoolMarker label={school.shortName} />,
  };

  // The driver's home is the pickup point, so it gets the pin instead of an avatar.
  const pickupMarkers: MapMarkerSpec[] =
    driver && pickupStop
      ? [
          {
            id: 'pickup',
            coordinate: driver.home,
            accessibilityLabel: `Preluare la ${pickupStop.time}, ${pickupStop.label}, ${pickupStop.address}`,
            anchor: PICKUP_MARKER_ANCHOR,
            zIndex: 3,
            element: (
              <PickupMarker
                initial={driver.initial}
                tone={driver.tone}
                time={pickupStop.time}
              />
            ),
            onPress: () => {
              animateLayout();
              setIsSheetExpanded(true);
              handleSelectStop(pickupStop);
            },
          },
        ]
      : [];

  const homeMarkers: MapMarkerSpec[] = parents
    .filter((parent) => parent.id !== driver?.id)
    .map((parent) => ({
      id: `home-${parent.id}`,
      coordinate: parent.home,
      accessibilityLabel: `Acasă la ${parent.firstName}`,
      element: <HomeMarker initial={parent.initial} tone={parent.tone} />,
    }));

  return (
    <View className="flex-1 bg-mint">
      <MapCanvas
        ref={mapRef}
        initialCenter={defaultCenter}
        markers={[schoolMarker, ...homeMarkers, ...pickupMarkers]}
        lines={lines}
        showsUserLocation={userLocation.isGranted}
        onReady={() => setIsMapReady(true)}
        onPressMap={collapsePanels}
      />

      <MapHeader
        city={city}
        schoolName={school.name}
        schoolShortName={school.shortName}
        weekLabel={formatWeekLabel(week)}
        dayLabel={`${DAY_NAMES[day]} ${week[day].getDate()}`}
        days={days}
        day={day}
        period={period}
        periodTimes={periodTimes}
        isExpanded={isHeaderExpanded}
        onToggleExpanded={toggleHeader}
        onChangeDay={handleChangeDay}
        onChangePeriod={handleChangePeriod}
        onLocate={handleLocate}
        onLayout={isHeaderExpanded ? undefined : measure(setHeaderHeight)}
      />

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 gap-2"
        style={{ bottom: bottomOffset }}
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

        {ride ? (
          <RideSheet
            ride={ride}
            dayLabel={DAY_NAMES[day]}
            destinationName={school.shortName}
            myChildrenIds={myChildrenIds}
            isExpanded={isSheetExpanded}
            onToggleExpanded={toggleSheet}
            selectedStopId={selectedStopId}
            onSelectStop={handleSelectStop}
            onCallDriver={() => onCallDriver(ride.driver)}
            onLayout={isSheetExpanded ? undefined : measure(setSheetHeight)}
          />
        ) : (
          <EmptyRidesCard onPlanRides={onPlanRides} />
        )}
      </View>
    </View>
  );
}
