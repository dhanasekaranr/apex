// This file contains shared interfaces that are used across the application.
// The actual HTTP operations are handled by NgRx Effects with direct HttpClient calls.

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

export interface LookupValue {
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
}

export interface LookupItem {
  id: string;
  name: string;
  description: string;
  category: string;
  values: LookupValue[];
}
