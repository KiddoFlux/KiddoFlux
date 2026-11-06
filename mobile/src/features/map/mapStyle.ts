import { colors } from '@/theme/colors';

/** Steel at about 30% over the mint ground, because the style needs a solid color. */
const WATER_COLOR = '#bfdadd';

/** Google Maps style (Android). Apple Maps on iOS doesn't accept custom styles. */
export const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: colors.mint }] },
  { elementType: 'labels.text.fill', stylers: [{ color: colors.ink }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: colors.mint }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: colors.white }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: WATER_COLOR }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: colors.sage }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];
