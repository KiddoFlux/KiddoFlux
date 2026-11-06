export type SettingsUser = {
  name: string;
  email: string;
  initial: string;
  /** Not shown yet: the shared Avatar has no photo support. Kept for when it gets one. */
  avatarUrl: string | null;
};
