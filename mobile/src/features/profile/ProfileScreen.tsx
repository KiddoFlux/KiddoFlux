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

  // Add a field here and it shows up in the Informații academice card.
  const academicFields: readonly AcademicField[] = [
    { label: 'Școala elevului', value: profile.schoolName, numberOfLines: 2 },
    { label: 'Nr. matricol', value: profile.matriculationNumber },
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
    </ScrollView>
  );
}
