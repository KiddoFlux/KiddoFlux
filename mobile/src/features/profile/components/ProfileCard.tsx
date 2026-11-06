import { Fragment } from 'react';
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
      accessibilityLabel={`Fotografia de profil a lui ${profile.parentName}`}
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
  // The account holder: the parent. Add a row here and it appears in the card.
  const parentRows = [
    { label: 'Nume', value: profile.parentName },
    { label: 'Telefon', value: profile.parentPhone },
    { label: 'Email', value: profile.parentEmail, numberOfLines: 2 },
    { label: 'Adresă acasă', value: profile.homeAddress, numberOfLines: 2 },
  ];

  return (
    <View
      className="items-center gap-5 rounded-[32px] bg-white p-6"
      style={shadows.strong}
    >
      <ProfilePicture profile={profile} />

      <View className="gap-5 self-stretch">
        {parentRows.map((row, index) => (
          <Fragment key={row.label}>
            {index > 0 ? <View className="h-px bg-steel/20" /> : null}
            <DetailRow
              label={row.label}
              value={row.value}
              numberOfLines={row.numberOfLines}
              valueClassName="text-[20px]"
            />
          </Fragment>
        ))}
      </View>
    </View>
  );
}
