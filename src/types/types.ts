// types/types.ts
export type UserRole = 'CLIENTE' | 'ADMIN' | 'BARBERO';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  tab: string;
  allowedRoles: UserRole[];
}

export interface User {
  id: number;
  nombre: string;
  rol: UserRole;
}