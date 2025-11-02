import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../shared/services/base-api.service';
import { User } from '../state/users.state';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService extends BaseApiService {
  protected readonly endpoint = '/users';

  getUsers(): Observable<User[]> {
    return this.get<User[]>();
  }

  getUser(id: number): Observable<User> {
    return this.get<User>(`/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.post<User>(user);
  }

  updateUser(user: User): Observable<User> {
    // Defensive programming - validate user object
    if (!user || typeof user.id === 'undefined') {
      console.error('❌ Invalid user object passed to updateUser API:', user);
      throw new Error('User object is required and must have a valid id');
    }

    return this.put<User>(user, `/${user.id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}
