export interface Site {
  id: string;
  name: string;
  type: 'public' | 'private';
  address: string;
  city: string;
  phone: string;
  isActive: boolean;
}