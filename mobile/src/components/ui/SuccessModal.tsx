import { CheckCircle2 } from 'lucide-react-native';
import { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

export type SuccessModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  /** Inchide automat pop-up-ul dupa X milisecunde (default: 3500ms). Pune 0 pentru a dezactiva. */
  autoDismissMs?: number;
};

export function SuccessModal({
  visible,
  title = 'Modificările au fost salvate cu succes!',
  message = 'Înălțimea și categoria de scaun auto au fost actualizate.',
  buttonText = 'Am înțeles',
  onClose,
  autoDismissMs = 3500,
}: SuccessModalProps) {
  useEffect(() => {
    if (!visible || autoDismissMs <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [visible, autoDismissMs, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-ink/50 px-6">
        {/* Tapping backdrop dismisses */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Închide"
          onPress={onClose}
          className="absolute inset-0"
        />

        <View
          accessibilityViewIsModal
          className="w-full max-w-[340px] items-center gap-4 rounded-[30px] bg-white p-6"
          style={shadows.strong}
        >
          {/* Circular mint badge with green check */}
          <View className="h-16 w-16 items-center justify-center rounded-full bg-mint">
            <CheckCircle2 size={36} color="#1f7a3f" strokeWidth={2.4} />
          </View>

          <View className="items-center gap-1.5">
            <AppText
              accessibilityRole="header"
              className="text-center font-bold text-[20px] text-navy"
            >
              {title}
            </AppText>
            {message ? (
              <AppText className="text-center text-[14px] leading-5 text-steel">
                {message}
              </AppText>
            ) : null}
          </View>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={buttonText}
            onPress={onClose}
            className="h-12 w-full items-center justify-center rounded-[20px] bg-navy active:bg-navy/90"
            style={shadows.soft}
          >
            <AppText className="font-bold text-[15px] text-white">
              {buttonText}
            </AppText>
          </PressableScale>
        </View>
      </View>
    </Modal>
  );
}
