import { Image, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

import type { ProfileData } from '../types';
import { DetailRow } from './DetailRow';

const PICTURE_SIZE = 104;
const PICTURE_RING = 4;

function ProfilePicture({ profile }: { profile: ProfileData }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Fotografia de profil a lui ${profile.firstName}`}
    >
      {profile.avatarUrl ? (
        <Image
          source={{ uri: profile.avatarUrl }}
          resizeMode="cover"
          style={{
            width: PICTURE_SIZE,
            height: PICTURE_SIZE,
            borderRadius: PICTURE_SIZE / 2,
            borderWidth: PICTURE_RING,
            borderColor: colors.white,
          }}
        />
      ) : (
        <Avatar
          initial={profile.initial}
          size={PICTURE_SIZE}
          ringWidth={PICTURE_RING}
        />
      )}
    </View>
  );
}

type ProfileCardProps = {
  profile: ProfileData;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <View
      className="items-center gap-5 rounded-[32px] bg-white p-6"
      style={shadows.strong}
    >
      <ProfilePicture profile={profile} />

      <View className="gap-5 self-stretch">
        <DetailRow label="Prenume" value={profile.firstName} />
        <View className="h-px bg-steel/20" />
        <DetailRow label="Înălțime" value={`${profile.heightCm} cm`} />
      </View>
    </View>
  );
}
