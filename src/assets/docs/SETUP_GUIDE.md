# Setup & Configuration Guide# Setup Guide# Setup & Configuration Guide



## Installation & Setup



### Prerequisites## Installation## Installation & Setup

- Node.js (version 18 or higher)

- npm or yarn package manager



### Initial Setup### Prerequisites### Prerequisites



```bash- Node.js 18+- Node.js (version 18 or higher)

# Clone the repository

git clone <repository-url>- npm- npm or yarn package manager

cd apex

- Angular CLI 20

# Install dependencies

npm install### Steps



# Start JSON Server API (in one terminal)```bash### Initial Setup

npm run json-server

# Install dependencies```bash

# Start development server (in another terminal)

ng servenpm install# Clone the repository



# Open in browsergit clone <repository-url>

http://localhost:4200

```# Start development (API + Angular)cd apex



## Configurationnpm run dev



### Environment Setup# Install dependencies

No environment files needed for development. The app uses json-server for API simulation.

# Or start separately:npm install

### API Server

The JSON server runs on `http://localhost:3001` and provides:npm run json-server  # API on port 3001

- `/users` - User management endpoints

- `/lookup-items` - Master datang serve             # Angular on port 4200# Start JSON Server API (in one terminal)

- `/navigation` - Menu configuration

- `/settings` - App settings```npm run json-server

- `/dashboard` - Dashboard data

- `/notifications` - User notifications



## Development## Configuration# Start development server (in another terminal)



### Running the Applicationng serve



**Start both servers together:**### Environment Files

```bash

npm run dev```typescript# Open in browser

```

// src/environments/environment.tshttp://localhost:4200

**Or start individually:**

```bashexport const environment = {```

# Terminal 1: API Server

npm run json-server  production: false,



# Terminal 2: Angular Dev Server  apiUrl: 'http://localhost:3001'### API Server Setup

ng serve

```};



### Building for Production```The application includes a JSON server for API mocking:

```bash

npm run build

```

Output will be in `dist/apex/browser/`### API Endpoints```bash



### Running TestsMock API available at `http://localhost:3001`:# Start JSON server on port 3001

```bash

# Unit tests- `/dashboard` - Dashboard datanpm run json-server

npm test

- `/users` - User management

# End-to-end tests

npm run e2e- `/settings` - Application settings# Available endpoints:



# Code linting- `/navigation` - Menu configuration# http://localhost:3001/dashboard

npm run lint

```- `/notifications` - User notifications# http://localhost:3001/users



## Project Structure# http://localhost:3001/lookupItems



```## Development# http://localhost:3001/generalSettings

apex/

├── src/# http://localhost:3001/userPreferences

│   ├── app/

│   │   ├── components/     # Feature components### Project Structure# http://localhost:3001/securitySettings

│   │   ├── store/          # NgRx Signal Stores

│   │   ├── services/       # Business services```# http://localhost:3001/systemInformation

│   │   └── shared/         # Shared utilities

│   ├── themes/             # Material 3 themingsrc/# http://localhost:3001/navigation

│   └── assets/             # Static files

├── api/├── app/# http://localhost:3001/breadcrumb

│   ├── db.json             # Mock database

│   └── routes.json         # API routes│   ├── core/          # Core services, layout# http://localhost:3001/notifications

└── cypress/                # E2E tests

```│   ├── features/      # Feature modules```



## Common Issues│   └── shared/        # Shared utilities



### Port Already in Use├── themes/            # SCSS theming## Project Configuration

If port 4200 or 3001 is occupied:

```bash└── assets/            # Static files

# Kill process on Windows

netstat -ano | findstr :4200```### Dependencies Overview

taskkill /PID <pid> /F

``````json



### Module Not Found### Adding a New Feature{

```bash

# Clear node_modules and reinstall  "dependencies": {

rm -rf node_modules package-lock.json

npm install1. Create feature folder:    "@angular/animations": "^20.0.6",

```

```bash    "@angular/cdk": "^20.0.5",

### Build Errors

```bashsrc/app/features/my-feature/    "@angular/common": "^20.0.0",

# Clear cache

npm run clean├── data-access/     # State store    "@angular/core": "^20.0.0",

npm install

```├── ui/              # Components    "@angular/material": "^20.0.5",



## Next Steps└── api/             # API service    "@fontsource/material-icons": "^5.2.5",



- Review **NAVIGATION_SYSTEM.md** for menu configuration```    "@fontsource/roboto": "^5.2.6",

- Check **STYLING_SYSTEM.md** for theming guidelines

- Explore the codebase in `/src/app/`    "rxjs": "~7.8.0"


2. Create signal store:  }

```typescript}

export const MyFeatureStore = signalStore(```

  { providedIn: 'root' },

  withState(initialState),### Font Configuration

  withMethods(...)

);#### NPM-Based Fonts (No Internet Required)

```The application uses npm packages for fonts instead of CDN links, eliminating proxy/internet connectivity issues.



3. Create component:```scss

```typescript// In styles.scss

@Component({@import '@fontsource/roboto/300.css';  // Light

  selector: 'app-my-feature',@import '@fontsource/roboto/400.css';  // Regular

  standalone: true,@import '@fontsource/roboto/500.css';  // Medium

  template: '...'@import '@fontsource/roboto/700.css';  // Bold

})

export class MyFeatureComponent {}// Material Icons (all variants)

```@import '@fontsource/material-icons/index.css';

@import '@fontsource/material-icons-outlined/index.css';

## Testing@import '@fontsource/material-icons-round/index.css';

@import '@fontsource/material-icons-sharp/index.css';

```bash```

# Unit tests

npm test#### Benefits

- ✅ **No CDN dependency** - Works offline

# E2E tests- ✅ **Proxy-friendly** - No external requests

npm run cypress:open- ✅ **Version control** - Consistent font versions

- ✅ **Performance** - Local font loading

# Build production

npm run build## Theme Configuration

```

### Material 3 Setup

## Troubleshooting```typescript

// In app.config.ts

### Common Issuesimport { provideAnimations } from '@angular/platform-browser/animations';



**Port already in use:**export const appConfig: ApplicationConfig = {

```bash  providers: [

# Kill process on port    provideAnimations(),

npx kill-port 4200    // Other providers...

npx kill-port 3001  ]

```};

```

**Dependencies error:**

```bash### Theme Variables

# Clean installKey CSS custom properties configured in the theme system:

rm -rf node_modules package-lock.json

npm install```scss

```// Color system

--primary-color: #6750a4;

**Build errors:**--secondary-color: #625b71;

```bash--surface-color: #fffbfe;

# Clear Angular cache--background-color: #fffbfe;

rm -rf .angular dist

ng serve// Typography

```--font-family-primary: 'Roboto', sans-serif;

--font-size-base: 14px;
--line-height-base: 1.5;

// Spacing scale
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;

// Border radius
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;

// Shadows
--shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
--shadow-md: 0 4px 6px rgba(0,0,0,0.12);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.12);
```

## Environment Configuration

### Development Environment
```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebugMode: true
};
```

### Production Environment
```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  enableDebugMode: false
};
```

## Build Configuration

### Development Build
```bash
ng serve
# Serves on http://localhost:4200
# Hot reload enabled
# Source maps included
```

### Production Build
```bash
ng build --configuration production
# Optimized bundle
# Minified code
# Tree-shaking enabled
# AOT compilation
```

### Build Optimization
```json
// angular.json optimizations
"optimization": {
  "scripts": true,
  "styles": {
    "minify": true,
    "inlineCritical": true
  },
  "fonts": true
}
```

## Routing Configuration

### App Routes
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: Users },
  { path: 'orders', component: Orders },
  { path: 'lookup-management', component: LookupManagement },
  { path: 'settings', loadChildren: () => import('./settings/settings.module') },
  { path: '**', redirectTo: '/dashboard' }
];
```

### Lazy Loading
```typescript
// Lazy load feature modules
{
  path: 'analytics',
  loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
}
```

## Component Configuration

### Standalone Components
All components use the standalone component pattern:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    // Other required modules
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // Component logic
}
```

### Import Strategy
```typescript
// Centralized Material imports
const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
];

@Component({
  imports: [CommonModule, ...MATERIAL_MODULES]
})
```

## Service Configuration

### Menu Service Setup
```typescript
@Injectable({ providedIn: 'root' })
export class MenuService {
  private topNavConfigSubject = new BehaviorSubject<TopNavConfig>(
    this.getDefaultConfig()
  );
  
  // Service implementation
}
```

### HTTP Configuration
```typescript
// For API integration
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```

## Styling Configuration

### SCSS Setup
```scss
// styles.scss - Global styles
@import 'themes/index';

// Global resets
* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: var(--font-family-primary);
}

// Material theme
@include mat.all-component-themes($theme);
```

### Component Styles
```scss
// component.scss - Minimal component-specific styles
@import 'themes/index';

.my-component {
  @include component-mixin();
  
  // Component-specific overrides only
  .specific-element {
    custom-property: value;
  }
}
```

## Testing Configuration

### Unit Testing Setup
```typescript
// component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component],
      providers: [provideAnimations()]
    }).compileComponents();
  });
});
```

### E2E Testing
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720
  }
});
```

## Performance Configuration

### Bundle Analysis
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Optimization Settings
```json
// angular.json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kb",
    "maximumError": "1mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kb",
    "maximumError": "4kb"
  }
]
```

## Security Configuration

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline';">
```

### Trusted Types
```typescript
// For enhanced security
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
```

## Development Tools

### VS Code Configuration
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### Linting Setup
```json
// .eslintrc.json
{
  "extends": [
    "@angular-eslint/recommended",
    "@angular-eslint/template/process-inline-templates"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@angular-eslint/component-selector": ["error", {
      "prefix": "app",
      "style": "kebab-case",
      "type": "element"
    }]
  }
}
```

## Deployment Configuration

### Development Deployment
```bash
ng serve --host 0.0.0.0 --port 4200
```

### Production Deployment
```bash
ng build --configuration production
# Deploy dist/ folder to web server
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/admin-dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **Font loading issues**: Verify @fontsource imports
2. **Style conflicts**: Check SCSS import order
3. **Bundle size**: Use webpack analyzer to identify large dependencies
4. **Memory issues**: Increase Node.js memory limit: `--max-old-space-size=8192`

### Debug Configuration
```typescript
// Enable debug mode
import { enableProdMode } from '@angular/core';

if (!environment.production) {
  // Development debugging
  console.log('Debug mode enabled');
} else {
  enableProdMode();
}
```

### Performance Monitoring
```typescript
// Add performance monitoring
import { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // Other providers
  ]
};
```

---

For additional configuration details, see the specific documentation files in the `docs/` folder.
