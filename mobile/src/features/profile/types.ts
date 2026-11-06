export type ProfileData = {
  // The child.
  firstName: string;
  initial: string;
  heightCm: number;
  /** Clasa, e.g. "a III-a". */
  grade: string;
  /** Nr. matricol, kept as text because it can contain letters or separators. */
  matriculationNumber: string;
  avatarUrl: string | null;

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
