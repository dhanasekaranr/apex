# Setup & Configuration Guide

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI 20

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd apex

# Install dependencies
npm install

# Start JSON Server API (in one terminal)
npm run json-server

# Start development server (in another terminal)
ng serve

# Open in browser
http://localhost:4200
```

### API Server Setup

The application includes a JSON server for API mocking:

```bash
# Start JSON server on port 3001
npm run json-server

# Available endpoints:
# http://localhost:3001/dashboard
# http://localhost:3001/users
# http://localhost:3001/lookupItems
# http://localhost:3001/generalSettings
# http://localhost:3001/userPreferences
# http://localhost:3001/securitySettings
# http://localhost:3001/systemInformation
# http://localhost:3001/navigation
# http://localhost:3001/breadcrumb
# http://localhost:3001/notifications
```

## Project Configuration

### Dependencies Overview
```json
{
  "dependencies": {
    "@angular/animations": "^20.0.6",
    "@angular/cdk": "^20.0.5",
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/material": "^20.0.5",
    "@fontsource/material-icons": "^5.2.5",
    "@fontsource/roboto": "^5.2.6",
    "rxjs": "~7.8.0"
  }
}
```

### Font Configuration

#### NPM-Based Fonts (No Internet Required)
The application uses npm packages for fonts instead of CDN links, eliminating proxy/internet connectivity issues.

```scss
// In styles.scss
@import '@fontsource/roboto/300.css';  // Light
@import '@fontsource/roboto/400.css';  // Regular
@import '@fontsource/roboto/500.css';  // Medium
@import '@fontsource/roboto/700.css';  // Bold

// Material Icons (all variants)
@import '@fontsource/material-icons/index.css';
@import '@fontsource/material-icons-outlined/index.css';
@import '@fontsource/material-icons-round/index.css';
@import '@fontsource/material-icons-sharp/index.css';
```

#### Benefits
- ✅ **No CDN dependency** - Works offline
- ✅ **Proxy-friendly** - No external requests
- ✅ **Version control** - Consistent font versions
- ✅ **Performance** - Local font loading

## Theme Configuration

### Material 3 Setup
```typescript
// In app.config.ts
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // Other providers...
  ]
};
```

### Theme Variables
Key CSS custom properties configured in the theme system:

```scss
// Color system
--primary-color: #6750a4;
--secondary-color: #625b71;
--surface-color: #fffbfe;
--background-color: #fffbfe;

// Typography
--font-family-primary: 'Roboto', sans-serif;
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
