export interface Exam {
  id: string;
  patientId: string;
  patientName: string;
  patientBirthDate: Date;
  patientGender: 'M' | 'F';
  title: string;
  anatomicalRegion: string;
  examDate: Date;
  patientWeight: number;
  patientAge: number;
  diagnosis: 'positive' | 'negative' | 'pending';
  department: string;
  description: string;
  conclusion: string;
  prescribingPhysician: string;
  assignedRadiologist: string | null;
  siteId: string;
  siteName: string;
  sectorId: string;
  sectorName: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  isUrgent: boolean;
}