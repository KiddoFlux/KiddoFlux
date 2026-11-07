import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { PixelRatio, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { MAP_STYLE } from '../mapStyle';
import type { LatLng } from '../types';

// The only file that imports the map library, so the provider can be swapped here.

const INITIAL_DELTA = 0.03;
const CAMERA_DELTA = 0.012;
const CAMERA_DURATION_MS = 450;
const CENTER_ANCHOR = { x: 0.5, y: 0.5 };

export type MapMarkerSpec = {
  id: string;
  coordinate: LatLng;
  accessibilityLabel: string;
  element: ReactNode;
  /** Where the coordinate sits on the element, from 0 to 1. Centred by default. */
  anchor?: { x: number; y: number };
  zIndex?: number;
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
  /** A tap on the map itself, not on a marker. */
  onPressMap?: () => void;
};

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  function MapCanvas(
    {
      initialCenter,
      markers,
      lines = [],
      showsUserLocation,
      onReady,
      onPressMap,
    },
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
        // Android reads the padding in physical pixels, iOS in points.
        const scale = Platform.OS === 'android' ? PixelRatio.get() : 1;
        mapRef.current?.fitToCoordinates([...points], {
          edgePadding: {
            top: insets.top * scale,
            right: insets.right * scale,
            bottom: insets.bottom * scale,
            left: insets.left * scale,
          },
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
        showsMyLocationButton={false}
        showsPointsOfInterests={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={onReady}
        onPress={(event) => {
          // Android also reports marker taps here.
          if (event.nativeEvent.action !== 'marker-press') onPressMap?.();
        }}
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

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            accessibilityLabel={marker.accessibilityLabel}
            anchor={marker.anchor ?? CENTER_ANCHOR}
            zIndex={marker.zIndex}
            onPress={marker.onPress}
          >
            {marker.element}
          </Marker>
        ))}
      </MapView>
    );
  },
);
