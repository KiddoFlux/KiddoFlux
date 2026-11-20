import { Ruler } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { ScreenTopBar } from '@/components/ui/ScreenTopBar';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import {
  AcademicSection,
  type AcademicField,
} from './components/AcademicSection';
import { ProfileCard } from './components/ProfileCard';
import type { ProfileData } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;
// A full-screen page: no tab bar, so only a little room at the bottom.
const SCREEN_BOTTOM_PADDING = 32;

export type ProfileScreenProps = {
  profile: ProfileData;
  onBack: () => void;
  onEditHeight?: () => void;
};

export function ProfileScreen({
  profile,
  onBack,
  onEditHeight,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

  // Add a field to one of these lists and it shows up in its card.
  const academicFields: readonly AcademicField[] = [
    { label: 'Școala elevului', value: profile.schoolName, numberOfLines: 2 },
    { label: 'Adresa școlii', value: profile.schoolAddress, numberOfLines: 2 },
    { label: 'Clasa', value: profile.grade },
    { label: 'Nr. matricol', value: profile.matriculationNumber },
  ];

  const studentFields: readonly AcademicField[] = [
    { label: 'Prenume', value: profile.firstName },
    { label: 'Înălțime', value: `${profile.heightCm} cm` },
    { label: 'Tip scaun auto', value: profile.seatTypeBadge },
    {
      label: 'Ultima verificare',
      value: profile.lastHeightDeclaration ?? 'La prima autentificare',
    },
  ];

  const vehicleFields: readonly AcademicField[] = [
    { label: 'Mașină', value: profile.vehicleName },
    { label: 'Anul fabricației', value: String(profile.vehicleYear) },
    { label: 'Culoare', value: profile.vehicleColor },
    { label: 'Număr de înmatriculare', value: profile.vehiclePlate },
    { label: 'Locuri', value: String(profile.vehicleSeats) },
    {
      label: 'Scaune auto pentru copii',
      value: String(profile.vehicleChildSeats),
    },
  ];

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
      <ScreenTopBar title="Profil" onBack={onBack} />
      <ProfileCard profile={profile} />
      <AcademicSection fields={academicFields} />
      <AcademicSection title="Informații elev" fields={studentFields} />
      {onEditHeight && (
        <PressableScale
          onPress={onEditHeight}
          className="-mt-2 h-12 flex-row items-center justify-center gap-2 rounded-[20px] border border-mint bg-white"
          style={shadows.soft}
        >
          <Ruler
            size={16}
            color={colors.navy}
            strokeWidth={ICON_STROKE_WIDTH}
          />
          <AppText className="font-bold text-[14px] text-navy">
            Actualizează înălțimea elevului
          </AppText>
        </PressableScale>
      )}
      <AcademicSection title="Vehicul" fields={vehicleFields} />
    </ScrollView>
  );
}
