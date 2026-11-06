import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { MAP_STYLE } from '../mapStyle';
import type { LatLng } from '../types';

// The only file that imports the map library, so the provider can be swapped here.

const INITIAL_DELTA = 0.04;
const CAMERA_DELTA = 0.025;
const CAMERA_DURATION_MS = 450;
const MARKER_GLIDE_MS = 1000;

export type MapMarkerSpec = {
  id: string;
  coordinate: LatLng;
  accessibilityLabel: string;
  element: ReactNode;
  /** Glides to new coordinates instead of jumping. */
  isMoving?: boolean;
  onPress?: () => void;
};

export type MapLineSpec = {
  id: string;
  coordinates: readonly LatLng[];
  color: string;
  width: number;
  isDotted?: boolean;
};

export type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type MapCanvasHandle = {
  focusOn: (location: LatLng) => void;
  fitTo: (points: readonly LatLng[], insets: EdgeInsets) => void;
};

type MapCanvasProps = {
  initialCenter: LatLng;
  markers: readonly MapMarkerSpec[];
  lines?: readonly MapLineSpec[];
  showsUserLocation: boolean;
  onReady?: () => void;
};

function MovingMarker({ marker }: { marker: MapMarkerSpec }) {
  const [coordinate, setCoordinate] = useState(marker.coordinate);
  const latest = useRef(marker.coordinate);
  const { latitude, longitude } = marker.coordinate;

  useEffect(() => {
    const from = latest.current;
    const startedAt = Date.now();
    let frame: number;

    const step = () => {
      const fraction = Math.min((Date.now() - startedAt) / MARKER_GLIDE_MS, 1);
      const next = {
        latitude: from.latitude + (latitude - from.latitude) * fraction,
        longitude: from.longitude + (longitude - from.longitude) * fraction,
      };

      latest.current = next;
      setCoordinate(next);
      if (fraction < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [latitude, longitude]);

  return (
    <Marker
      coordinate={coordinate}
      accessibilityLabel={marker.accessibilityLabel}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={marker.onPress}
    >
      {marker.element}
    </Marker>
  );
}

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  function MapCanvas(
    { initialCenter, markers, lines = [], showsUserLocation, onReady },
    ref,
  ) {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      focusOn: (location) => {
        mapRef.current?.animateToRegion(
          {
            ...location,
            latitudeDelta: CAMERA_DELTA,
            longitudeDelta: CAMERA_DELTA,
          },
          CAMERA_DURATION_MS,
        );
      },
      fitTo: (points, insets) => {
        mapRef.current?.fitToCoordinates([...points], {
          edgePadding: insets,
          animated: true,
        });
      },
    }));

    return (
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          ...initialCenter,
          latitudeDelta: INITIAL_DELTA,
          longitudeDelta: INITIAL_DELTA,
        }}
        customMapStyle={MAP_STYLE}
        showsUserLocation={showsUserLocation}
        showsPointsOfInterests={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={onReady}
      >
        {lines.map((line) => (
          <Polyline
            key={line.id}
            coordinates={[...line.coordinates]}
            strokeColor={line.color}
            strokeWidth={line.width}
            lineCap="round"
            lineJoin="round"
            lineDashPattern={line.isDotted ? [1, 8] : undefined}
          />
        ))}

        {markers.map((marker) =>
          marker.isMoving ? (
            <MovingMarker key={marker.id} marker={marker} />
          ) : (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              accessibilityLabel={marker.accessibilityLabel}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={marker.onPress}
            >
              {marker.element}
            </Marker>
          ),
        )}
      </MapView>
    );
  },
);
