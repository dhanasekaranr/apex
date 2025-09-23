import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../core/services/environment.service';

/**
 * Base API service that provides common HTTP methods and URL building
 * All feature API services should extend this class
 */
@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly environmentService = inject(EnvironmentService);

  /**
   * Abstract property that each service must define to specify the API endpoint
   */
  protected abstract readonly endpoint: string;

  /**
   * Build API URL using the environment service
   */
  protected buildUrl(path?: string): string {
    const fullPath = path ? `${this.endpoint}${path}` : this.endpoint;
    return this.environmentService.buildApiUrl(fullPath);
  }

  /**
   * Generic GET request
   */
  protected get<T>(path?: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }

  /**
   * Generic POST request
   */
  protected post<T>(data: any, path?: string): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), data);
  }

  /**
   * Generic PUT request
   */
  protected put<T>(data: any, path?: string): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), data);
  }

  /**
   * Generic DELETE request
   */
  protected delete<T>(path?: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path));
  }

  /**
   * Generic PATCH request
   */
  protected patch<T>(data: any, path?: string): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), data);
  }
}
