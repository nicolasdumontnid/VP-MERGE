export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  site: string;
  isActive: boolean;
  lastLoginAt?: Date;
}