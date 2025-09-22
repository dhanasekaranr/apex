export interface User {
  id: number;
  userCode: string;
  userName: string;
  userRole: string;
  screenAccess: string[];
  dualMode: boolean;
  debugMode: 'Y' | 'N';
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}
