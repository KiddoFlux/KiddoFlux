import { Palette } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { MapSkin } from '../types';

const SKINS: readonly { id: MapSkin; label: string; icon: string }[] = [
  { id: 'mint', label: 'Mint', icon: '🌿' },
  { id: 'clean', label: 'Curat', icon: '🤍' },
  { id: 'warm', label: 'Cald', icon: '🌅' },
  { id: 'standard', label: 'OSM', icon: '🗺️' },
] as const;

type SkinToggleProps = {
  value: MapSkin;
  onChange: (skin: MapSkin) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
};

export function SkinToggle({
  value,
  onChange,
  isExpanded: controlledExpanded,
  onToggleExpanded,
}: SkinToggleProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (onToggleExpanded) {
      onToggleExpanded();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const selectSkin = (skin: MapSkin) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(skin);
    if (onToggleExpanded) {
      onToggleExpanded();
    } else {
      setInternalExpanded(false);
    }
  };

  return (
    <View className="items-end">
      {isExpanded ? (
        <View
          className="flex-row items-center gap-1 rounded-full bg-white p-1"
          style={shadows.soft}
        >
          {SKINS.map((skin) => {
            const isSelected = skin.id === value;
            return (
              <Pressable
                key={skin.id}
                onPress={() => selectSkin(skin.id)}
                className={`flex-row items-center gap-1 rounded-full px-2.5 py-1.5 ${
                  isSelected ? 'bg-navy' : 'bg-transparent'
                }`}
              >
                <AppText className="text-[12px]">{skin.icon}</AppText>
                <AppText
                  numberOfLines={1}
                  className={`font-bold text-[12px] ${
                    isSelected ? 'text-mint' : 'text-ink'
                  }`}
                >
                  {skin.label}
                </AppText>
              </Pressable>
            );
          })}
          <Pressable
            onPress={toggle}
            className="h-8 w-8 items-center justify-center rounded-full bg-mint/50"
          >
            <Palette
              size={16}
              color={colors.navy}
              strokeWidth={ICON_STROKE_WIDTH}
            />
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Temă hartă: ${value}. Apasă pentru a schimba`}
          onPress={toggle}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
          style={shadows.soft}
        >
          <Palette
            size={20}
            color={colors.navy}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </Pressable>
      )}
    </View>
  );
}
