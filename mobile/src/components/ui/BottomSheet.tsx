import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_PADDING = 20;

type BottomSheetProps = {
  /** Read by screen readers on the dimmed area that closes the sheet. */
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

/** A pop-up anchored to the bottom of the screen. Render it only while open. */
export function BottomSheet({
  closeLabel,
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          className="absolute inset-0 bg-ink/40"
        />
        <View
          accessibilityViewIsModal
          className="max-h-[90%] overflow-hidden rounded-t-[28px] bg-white"
          style={{ paddingBottom: insets.bottom + BOTTOM_PADDING }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
