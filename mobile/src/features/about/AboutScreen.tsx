import { Car } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { ScreenTopBar } from '@/components/ui/ScreenTopBar';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;
const SCREEN_BOTTOM_PADDING = 32;

export type AboutScreenProps = {
  title: string;
  text: string;
  onBack: () => void;
};

export function AboutScreen({ title, text, onBack }: AboutScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-mint"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: SECTION_GAP,
        paddingHorizontal: SCREEN_SIDE_PADDING,
        paddingTop: insets.top + SCREEN_TOP_PADDING,
        paddingBottom: insets.bottom + SCREEN_BOTTOM_PADDING,
      }}
    >
      <ScreenTopBar title={title} onBack={onBack} />

      <View
        className="items-center gap-5 rounded-[32px] bg-white p-6"
        style={shadows.strong}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="h-16 w-16 items-center justify-center rounded-full bg-navy/10"
        >
          <Car size={30} color={colors.navy} strokeWidth={ICON_STROKE_WIDTH} />
        </View>

        <AppText className="font-bold text-[24px] tracking-[-0.4px]">
          KiddoFlux
        </AppText>

        <AppText className="text-center text-[17px] leading-[26px]">
          {text}
        </AppText>
      </View>
    </ScrollView>
  );
}
