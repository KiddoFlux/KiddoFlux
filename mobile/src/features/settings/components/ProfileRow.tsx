import { User } from 'lucide-react-native';

import { SettingsRow } from './SettingsRow';

type ProfileRowProps = {
  onPress: () => void;
};

export function ProfileRow({ onPress }: ProfileRowProps) {
  return (
    <SettingsRow
      Icon={User}
      accessibilityLabel="Profil. Deschide profilul"
      onPress={onPress}
    >
      Profil
    </SettingsRow>
  );
}
