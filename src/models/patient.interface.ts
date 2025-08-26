export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  socialSecurityNumber: string;
  createdAt: Date;
}