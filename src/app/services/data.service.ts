import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // User operations
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Lookup operations
  getLookupItems(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.apiUrl}/lookupItems`);
  }

  getLookupItem(id: string): Observable<LookupItem> {
    return this.http.get<LookupItem>(`${this.apiUrl}/lookupItems/${id}`);
  }

  updateLookupItem(id: string, lookupItem: LookupItem): Observable<LookupItem> {
    return this.http.put<LookupItem>(
      `${this.apiUrl}/lookupItems/${id}`,
      lookupItem
    );
  }

  createLookupItem(lookupItem: Omit<LookupItem, 'id'>): Observable<LookupItem> {
    return this.http.post<LookupItem>(`${this.apiUrl}/lookupItems`, lookupItem);
  }

  deleteLookupItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lookupItems/${id}`);
  }
}
