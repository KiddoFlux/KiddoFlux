import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  WebView as BaseWebView,
  type WebViewMessageEvent,
  type WebViewProps,
} from 'react-native-webview';

import type { AvatarTone } from '@/components/ui/Avatar';
import type { LatLng, MapSkin } from '../types';

// React 19 type compatibility for react-native-webview
const WebView = BaseWebView as unknown as ComponentType<
  WebViewProps & { ref?: any }
>;

// OpenStreetMap + Leaflet implementation replacing Google Maps.
// No API key, credit card, or Google Play Services required.

export type MapMarkerSpec = {
  id: string;
  coordinate: LatLng;
  accessibilityLabel: string;
  element?: ReactNode;
  /** Where the coordinate sits on the element, from 0 to 1. Centred by default. */
  anchor?: { x: number; y: number };
  zIndex?: number;
  onPress?: () => void;
  /** Marker style metadata for OpenStreetMap HTML rendering */
  markerType?: 'school' | 'pickup' | 'home';
  label?: string;
  initial?: string;
  tone?: AvatarTone;
  time?: string;
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
  userCoordinate?: LatLng | null;
  skin?: MapSkin;
  onReady?: () => void;
  /** A tap on the map itself, not on a marker. */
  onPressMap?: () => void;
};

function serializeMarker(m: MapMarkerSpec) {
  let type = m.markerType;
  if (!type) {
    if (m.id === 'school') type = 'school';
    else if (m.id === 'pickup') type = 'pickup';
    else if (m.id.startsWith('home-')) type = 'home';
  }

  return {
    id: m.id,
    coordinate: m.coordinate,
    accessibilityLabel: m.accessibilityLabel,
    markerType: type,
    label: m.label,
    initial: m.initial,
    tone: m.tone,
    time: m.time,
    zIndex: m.zIndex,
  };
}

function generateMapHtml(
  initialCenter: LatLng,
  initialSkin: MapSkin = 'mint',
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #effbf5;
      overflow: hidden;
    }
    .leaflet-container {
      background: #effbf5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .leaflet-control-attribution {
      font-size: 10px !important;
      background: rgba(255, 255, 255, 0.75) !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
    }
    .leaflet-bottom.leaflet-right {
      bottom: 80px;
    }

    /* Map Skins */
    /* 1. Mint (KiddoFlux Signature Theme) */
    .skin-mint .leaflet-tile {
      filter: saturate(0.55) brightness(1.05) contrast(0.92);
    }
    .skin-mint #tint-overlay {
      display: block;
      background-color: #dcebea;
      mix-blend-mode: color;
      opacity: 0.45;
    }

    /* 2. Clean (Minimalist Grayscale / Architectural High Contrast) */
    .skin-clean .leaflet-tile {
      filter: grayscale(0.85) brightness(1.08) contrast(0.9);
    }
    .skin-clean #tint-overlay {
      display: none;
    }

    /* 3. Warm (Pastel Cald / Terracotta) */
    .skin-warm .leaflet-tile {
      filter: sepia(0.25) saturate(0.65) brightness(1.04) contrast(0.92);
    }
    .skin-warm #tint-overlay {
      display: block;
      background-color: #fbf0e8;
      mix-blend-mode: color;
      opacity: 0.4;
    }

    /* 4. Standard (Classic OpenStreetMap) */
    .skin-standard .leaflet-tile {
      filter: none;
    }
    .skin-standard #tint-overlay {
      display: none;
    }

    .clean-leaflet-icon {
      background: transparent !important;
      border: none !important;
    }

    /* Anchor pins by setting bottom center at (0, 0) */
    .pin-container {
      position: absolute;
      transform: translate(-50%, -100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    /* Anchor circular avatars by setting center at (0, 0) */
    .circle-container {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }

    /* School Pin */
    .school-bubble {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      background-color: #084887;
      color: #effbf5;
      border: 3px solid #ffffff;
      border-radius: 9999px;
      padding: 5px 12px 5px 8px;
      font-weight: 700;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    .school-pointer {
      width: 12px;
      height: 12px;
      background-color: #084887;
      border-bottom: 3px solid #ffffff;
      border-right: 3px solid #ffffff;
      transform: rotate(45deg);
      margin-top: -6px;
    }

    /* Pickup Pin */
    .pickup-bubble {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      background-color: #efa48b;
      color: #2d2e2e;
      border: 3px solid #ffffff;
      border-radius: 9999px;
      padding: 4px 12px 4px 4px;
      font-weight: 700;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    .pickup-pointer {
      width: 12px;
      height: 12px;
      background-color: #efa48b;
      border-bottom: 3px solid #ffffff;
      border-right: 3px solid #ffffff;
      transform: rotate(45deg);
      margin-top: -6px;
    }

    /* Avatars */
    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #ffffff;
      font-weight: 700;
      color: #2d2e2e;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .avatar-sm { width: 26px; height: 26px; font-size: 11px; }
    .avatar-md { width: 34px; height: 34px; font-size: 14px; }
    .tone-peach { background-color: #efa48b; }
    .tone-sage { background-color: #c2cfb2; }
    .tone-steel { background-color: #508ca4; }

    /* Home Marker */
    .home-pin {
      width: 44px;
      height: 44px;
    }

    /* User Location Pulse */
    .user-location-pin {
      position: relative;
      width: 24px;
      height: 24px;
    }
    .user-location-pulse {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(8, 72, 135, 0.25);
      animation: user-pulse 2s infinite ease-out;
    }
    .user-location-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #084887;
      border: 2.5px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 2;
    }
    @keyframes user-pulse {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.8); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="map" class="skin-${initialSkin}"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map;
    var linesGroup;
    var markersGroup;
    var userLocationMarker = null;

    function init() {
      if (!window.L) {
        setTimeout(init, 50);
        return;
      }

      map = L.map('map', {
        center: [${initialCenter.latitude}, ${initialCenter.longitude}],
        zoom: 14,
        zoomControl: false,
        attributionControl: true,
      });

      // Dedicated tint overlay pane between tilePane (200) and overlayPane (400)
      var tintPane = map.createPane('tintPane');
      tintPane.style.zIndex = 250;
      tintPane.style.pointerEvents = 'none';

      var tintOverlay = document.createElement('div');
      tintOverlay.id = 'tint-overlay';
      tintOverlay.style.position = 'absolute';
      tintOverlay.style.top = '-5000px';
      tintOverlay.style.left = '-5000px';
      tintOverlay.style.width = '10000px';
      tintOverlay.style.height = '10000px';
      tintOverlay.style.pointerEvents = 'none';
      tintPane.appendChild(tintOverlay);

      window.setSkin = function(skinName) {
        var mapEl = document.getElementById('map');
        if (mapEl) {
          mapEl.className = 'leaflet-container skin-' + (skinName || 'mint');
        }
      };

      // 100% Free OpenStreetMap tiles - NO API key, credit card, or registration required
      var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      // Fallback to OSM Humanitarian tiles if any tile fails to load
      osmLayer.on('tileerror', function(error) {
        if (error.coords && error.tile && !error.tile.dataset.retried) {
          error.tile.dataset.retried = 'true';
          var subdomains = ['a', 'b', 'c'];
          var s = subdomains[Math.abs(error.coords.x + error.coords.y) % subdomains.length];
          error.tile.src = 'https://' + s + '.tile.openstreetmap.fr/hot/' + error.coords.z + '/' + error.coords.x + '/' + error.coords.y + '.png';
        }
      });

      osmLayer.addTo(map);

      linesGroup = L.layerGroup().addTo(map);
      markersGroup = L.layerGroup().addTo(map);

      map.on('click', function(e) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapPress' }));
        }
      });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
      }
    }

    function renderSchoolHtml(m) {
      var label = m.label || 'Școală';
      return '<div class="pin-container school-pin" data-id="' + m.id + '">' +
        '<div class="school-bubble">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#effbf5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>' +
            '<path d="M22 10v6"/>' +
            '<path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>' +
          '</svg>' +
          '<span>' + label + '</span>' +
        '</div>' +
        '<div class="school-pointer"></div>' +
      '</div>';
    }

    function renderPickupHtml(m) {
      var initial = m.initial || 'P';
      var tone = m.tone || 'peach';
      var time = m.time || '';
      return '<div class="pin-container pickup-pin" data-id="' + m.id + '">' +
        '<div class="pickup-bubble">' +
          '<div class="avatar-circle avatar-sm tone-' + tone + '">' + initial + '</div>' +
          '<span>Preluare · ' + time + '</span>' +
        '</div>' +
        '<div class="pickup-pointer"></div>' +
      '</div>';
    }

    function renderHomeHtml(m) {
      var initial = m.initial || 'A';
      var tone = m.tone || 'sage';
      return '<div class="circle-container home-pin" data-id="' + m.id + '">' +
        '<div class="avatar-circle avatar-md tone-' + tone + '">' + initial + '</div>' +
      '</div>';
    }

    function renderUserLocationHtml() {
      return '<div class="circle-container user-location-pin">' +
        '<div class="user-location-pulse"></div>' +
        '<div class="user-location-dot"></div>' +
      '</div>';
    }

    function addMarker(m) {
      var html = '';
      if (m.markerType === 'school') {
        html = renderSchoolHtml(m);
      } else if (m.markerType === 'pickup') {
        html = renderPickupHtml(m);
      } else {
        html = renderHomeHtml(m);
      }

      var icon = L.divIcon({
        className: 'clean-leaflet-icon',
        html: html,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      var marker = L.marker([m.coordinate.latitude, m.coordinate.longitude], {
        icon: icon,
        zIndexOffset: (m.zIndex || 1) * 100,
      });

      marker.on('click', function(e) {
        if (e.originalEvent) e.originalEvent.stopPropagation();
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }));
        }
      });

      marker.addTo(markersGroup);
    }

    window.updateData = function(data) {
      if (!map) return;

      // Update lines
      linesGroup.clearLayers();
      if (data.lines) {
        data.lines.forEach(function(line) {
          var latlngs = line.coordinates.map(function(c) {
            return [c.latitude, c.longitude];
          });
          L.polyline(latlngs, {
            color: line.color,
            weight: line.width,
            opacity: 1.0,
            dashArray: line.isDotted ? '4, 8' : undefined,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(linesGroup);
        });
      }

      // Update markers
      markersGroup.clearLayers();
      if (data.markers) {
        data.markers.forEach(function(m) {
          addMarker(m);
        });
      }

      // Update user location marker
      if (data.userCoordinate) {
        var userIcon = L.divIcon({
          className: 'clean-leaflet-icon',
          html: renderUserLocationHtml(),
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        if (!userLocationMarker) {
          userLocationMarker = L.marker([data.userCoordinate.latitude, data.userCoordinate.longitude], {
            icon: userIcon,
            zIndexOffset: 50,
          }).addTo(map);
        } else {
          userLocationMarker.setLatLng([data.userCoordinate.latitude, data.userCoordinate.longitude]);
          if (!map.hasLayer(userLocationMarker)) {
            userLocationMarker.addTo(map);
          }
        }
      } else if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
        userLocationMarker = null;
      }
    };

    window.focusOn = function(lat, lng) {
      if (!map) return;
      map.flyTo([lat, lng], 15, { animate: true, duration: 0.5 });
    };

    window.fitTo = function(points, insets) {
      if (!map || !points || points.length === 0) return;
      var bounds = L.latLngBounds(points.map(function(p) {
        return [p.latitude, p.longitude];
      }));
      map.fitBounds(bounds, {
        paddingTopLeft: [insets.left || 20, insets.top || 20],
        paddingBottomRight: [insets.right || 20, insets.bottom || 20],
        maxZoom: 16,
        animate: true,
        duration: 0.5,
      });
    };

    window.onload = init;
  </script>
</body>
</html>`;
}

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  function MapCanvas(
    {
      initialCenter,
      markers,
      lines = [],
      showsUserLocation,
      userCoordinate,
      skin = 'mint',
      onReady,
      onPressMap,
    },
    ref,
  ) {
    const webViewRef = useRef<BaseWebView>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const markersRef = useRef(markers);
    markersRef.current = markers;
    const skinRef = useRef(skin);
    skinRef.current = skin;

    useImperativeHandle(ref, () => ({
      focusOn: (location) => {
        webViewRef.current?.injectJavaScript(
          `if (window.focusOn) { window.focusOn(${location.latitude}, ${location.longitude}); } true;`,
        );
      },
      fitTo: (points, insets) => {
        const pointsJson = JSON.stringify(points);
        const insetsJson = JSON.stringify(insets);
        webViewRef.current?.injectJavaScript(
          `if (window.fitTo) { window.fitTo(${pointsJson}, ${insetsJson}); } true;`,
        );
      },
    }));

    // Sync skin changes immediately without reloading the WebView
    useEffect(() => {
      if (!isMapReady) return;
      webViewRef.current?.injectJavaScript(
        `if (window.setSkin) { window.setSkin('${skin}'); } true;`,
      );
    }, [isMapReady, skin]);

    // Sync markers, lines, and user location whenever they change and the map is ready
    useEffect(() => {
      if (!isMapReady) return;

      const payload = JSON.stringify({
        markers: markers.map(serializeMarker),
        lines,
        userCoordinate: showsUserLocation ? userCoordinate : null,
      });

      webViewRef.current?.injectJavaScript(
        `if (window.updateData) { window.updateData(${payload}); } true;`,
      );
    }, [isMapReady, markers, lines, showsUserLocation, userCoordinate]);

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'ready') {
          setIsMapReady(true);
          // Initial data injection right after ready
          const payload = JSON.stringify({
            markers: markersRef.current.map(serializeMarker),
            lines,
            userCoordinate: showsUserLocation ? userCoordinate : null,
          });
          webViewRef.current?.injectJavaScript(
            `if (window.updateData) { window.updateData(${payload}); } if (window.setSkin) { window.setSkin('${skinRef.current}'); } true;`,
          );
          onReady?.();
        } else if (data.type === 'mapPress') {
          onPressMap?.();
        } else if (data.type === 'markerPress' && data.id) {
          const marker = markersRef.current.find((m) => m.id === data.id);
          marker?.onPress?.();
        }
      } catch {
        // ignore JSON parse errors
      }
    };

    return (
      <View style={StyleSheet.absoluteFill}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHtml(initialCenter, skin) }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          userAgent="KiddoFluxApp/1.0 (Android; Mobile; OpenStreetMap)"
          onMessage={handleMessage}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: '#effbf5',
  },
});
