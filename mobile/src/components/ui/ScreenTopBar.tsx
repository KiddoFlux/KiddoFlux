import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

type ScreenTopBarProps = {
  title: string;
  onBack: () => void;
};

/** Back button on the left and a centered title, for full-screen pages without the tab bar. */
export function ScreenTopBar({ title, onBack }: ScreenTopBarProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Înapoi"
        onPress={onBack}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        className="h-11 w-11 items-center justify-center rounded-full bg-white"
        style={[shadows.soft, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <ArrowLeft
          size={22}
          color={colors.ink}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </Pressable>

      <AppText
        accessibilityRole="header"
        numberOfLines={1}
        className="flex-1 text-center text-[22px]"
      >
        {title}
      </AppText>

      {/* Same width as the back button, so the title is truly centered. */}
      <View className="h-11 w-11" />
    </View>
  );
}
