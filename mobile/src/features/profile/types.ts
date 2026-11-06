export type ProfileData = {
  firstName: string;
  initial: string;
  heightCm: number;
  schoolName: string;
  /** Nr. matricol, kept as text because it can contain letters or separators. */
  matriculationNumber: string;
  avatarUrl: string | null;
};
