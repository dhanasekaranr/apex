import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../state/users.state';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
