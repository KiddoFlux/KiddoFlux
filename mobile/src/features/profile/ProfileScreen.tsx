import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenTopBar } from '@/components/ui/ScreenTopBar';

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
};

export function ProfileScreen({ profile, onBack }: ProfileScreenProps) {
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
      <AcademicSection title="Vehicul" fields={vehicleFields} />
    </ScrollView>
  );
}
