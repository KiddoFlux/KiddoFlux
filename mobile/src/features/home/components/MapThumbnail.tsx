import { MapPin } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

export const MAP_THUMBNAIL_WIDTH = 106;
export const MAP_THUMBNAIL_HEIGHT = 72;

export function MapThumbnail() {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full"
      style={{ width: MAP_THUMBNAIL_WIDTH, height: MAP_THUMBNAIL_HEIGHT }}
    >
      <View className="absolute inset-0">
        <Svg
          width={MAP_THUMBNAIL_WIDTH}
          height={MAP_THUMBNAIL_HEIGHT}
          viewBox={`0 0 ${MAP_THUMBNAIL_WIDTH} ${MAP_THUMBNAIL_HEIGHT}`}
        >
          <Rect
            width={MAP_THUMBNAIL_WIDTH}
            height={MAP_THUMBNAIL_HEIGHT}
            fill={colors.mapGround}
          />
          <Rect
            x={4}
            y={2}
            width={30}
            height={22}
            rx={5}
            fill={colors.mapBlock}
          />
          <Rect x={70} y={4} width={32} height={18} rx={5} fill={colors.sage} />
          <Rect
            x={8}
            y={48}
            width={28}
            height={22}
            rx={5}
            fill={colors.mapBlock}
          />
          <Rect
            x={72}
            y={46}
            width={30}
            height={24}
            rx={5}
            fill={colors.mapBlock}
          />
          <Line
            x1={-6}
            y1={52}
            x2={112}
            y2={22}
            stroke={colors.white}
            strokeWidth={10}
          />
          <Line
            x1={40}
            y1={-6}
            x2={66}
            y2={78}
            stroke={colors.white}
            strokeWidth={10}
          />
          <Path
            d="M2 62 C 26 66, 34 26, 54 36 S 84 18, 104 10"
            fill="none"
            stroke={colors.navy}
            strokeWidth={2.5}
            strokeDasharray="0 6"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View className="h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-peach">
        <MapPin size={20} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
    </View>
  );
}
