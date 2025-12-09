export type UserRole = 'Staff' | 'Admin' | 'Keuangan' | 'Direksi';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  department: string;
  photo?: string;
}

export interface ProfileHistory extends ProfileData {
  changedAt: string;
}
