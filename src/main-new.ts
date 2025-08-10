/**
 * @fileoverview Bootstrap for Angular 20 application with Material 3
 * @version 1.0.0
 * @author Twenty Development Team
 */

import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app-simple';

// Optional: Add your HTTP interceptors here
// import { authInterceptor, errorInterceptor } from './app/core/interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    // withInterceptors([authInterceptor, errorInterceptor])
    // Add other providers as needed
  ],
}).catch((err) => console.error('Failed to bootstrap application:', err));
