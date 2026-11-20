export type ProfileData = {
  /** First letter of the parent's first name, shown when there is no photo. */
  initial: string;
  avatarUrl: string | null;

  // The child.
  firstName: string;
  heightCm: number;
  /** Clasa, e.g. "a III-a". */
  grade: string;
  /** Nr. matricol, kept as text because it can contain letters or separators. */
  matriculationNumber: string;
  /** Tip scaun auto necesar conform inaltimii. */
  seatTypeLabel: string;
  seatTypeBadge: string;
  needsChildSeat: boolean;
  lastHeightDeclaration: string | null;

  // The school.
  schoolName: string;
  schoolAddress: string;

  // The parent.
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  homeAddress: string;

  // The parent's car.
  vehicleName: string;
  vehicleYear: number;
  vehicleColor: string;
  vehiclePlate: string;
  vehicleSeats: number;
  vehicleChildSeats: number;
};
