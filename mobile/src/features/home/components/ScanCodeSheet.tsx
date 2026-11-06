import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

type ScanCodeSheetProps = {
  onClose: () => void;
};

/** The camera, full screen. Any code it reads shows the "left safely" popup. */
export function ScanCodeSheet({ onClose }: ScanCodeSheetProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);

  // TODO: check the scanned code against the child and save it to Firebase.
  // For now any code counts.
  const handleScanned = () => setHasScanned(true);

  const renderBody = () => {
    // Null while the permission status is loading.
    if (!permission) return null;

    if (!permission.granted) {
      return (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <AppText className="text-center text-[18px] text-mint">
            Avem nevoie de cameră ca să scanăm codul.
          </AppText>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={
              permission.canAskAgain
                ? 'Permite accesul la cameră'
                : 'Deschide setările'
            }
            onPress={
              permission.canAskAgain
                ? requestPermission
                : () => Linking.openSettings()
            }
            className="h-14 items-center justify-center rounded-full bg-mint px-8"
          >
            <AppText className="text-[16px] text-navy">
              {permission.canAskAgain ? 'Permite camera' : 'Deschide setările'}
            </AppText>
          </PressableScale>
        </View>
      );
    }

    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        // Stops reading once a code was found, so the popup shows only once.
        onBarcodeScanned={hasScanned ? undefined : handleScanned}
      />
    );
  };

  return (
    <Modal
      visible
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-ink">
        {renderBody()}

        <View
          pointerEvents="box-none"
          className="absolute inset-x-0 top-0 flex-row items-center gap-3 px-5"
          style={{ paddingTop: insets.top + 12 }}
        >
          <AppText
            accessibilityRole="header"
            numberOfLines={1}
            className="flex-1 text-[22px] text-mint"
          >
            Scanează codul
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Închide camera"
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-ink/60"
          >
            <X size={22} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
          </Pressable>
        </View>

        {hasScanned ? (
          <View
            accessibilityViewIsModal
            className="absolute inset-0 items-center justify-center bg-ink/60 px-8"
          >
            <View className="w-full items-center gap-5 rounded-[28px] bg-white p-6">
              <AppText
                accessibilityRole="header"
                className="text-center text-[22px]"
              >
                Copilul a fost lăsat în siguranță
              </AppText>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Închide"
                onPress={onClose}
                className="h-14 w-full items-center justify-center rounded-full bg-navy"
              >
                <AppText className="text-[16px] text-mint">OK</AppText>
              </PressableScale>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
