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
  /** Zilele saptamanii in care parintele poate conduce (format afisabil). */
  availableDaysLabel: string;
  /** Status consimtamant carpool (format afisabil). */
  consentLabel: string;

  // Additional children if the parent has multiple.
  additionalChildren?: {
    firstName: string;
    heightCm: number;
    grade: string;
    matriculationNumber: string;
    seatTypeBadge: string;
  }[];

  // The parent's car.
  vehicleName: string;
  vehicleYear: number;
  vehicleColor: string;
  vehiclePlate: string;
  vehicleSeats: number;
  vehicleChildSeats: number;
};
