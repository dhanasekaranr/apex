# API Structure Documentation

## Overview
The API is organized in the `/src/api/` directory with separated data files for better maintainability and scalability.

## Directory Structure
```
src/api/
├── db.json                 # Combined database (auto-generated)
├── build-db.js            # Script to build combined database
├── routes.json             # API route mappings
├── allowcors.js           # CORS configuration middleware
├── json-server.json       # JSON Server configuration
└── data/
    ├── users.json         # User data
    └── lookupItems.json   # Lookup items data
```

## Data Files

### users.json
Contains user account information with the following structure:
- `id`: Unique user identifier
- `userCode`: User code (e.g., ADM001, MGR002)
- `userName`: Full name
- `userRole`: Role (Admin, Manager, User, Developer, Analyst, Support)
- `screenAccess`: Array of accessible screens
- `dualMode`: Boolean for dual mode access
- `debugMode`: Y/N flag for debug access
- `lastLogin`: Last login date
- `status`: Active/Inactive/Suspended

### lookupItems.json
Contains lookup table definitions with:
- `id`: Unique lookup identifier
- `name`: Display name
- `description`: Description
- `category`: Category grouping
- `values`: Array of key-value pairs with descriptions and active status

## Build Process

The database is built by combining separate data files:
```bash
npm run build:api    # Builds combined db.json from separate files
```

## API Server Commands

```bash
npm run json-server  # Build + start API server on port 3001
npm run start:api    # Alias for json-server
npm run dev          # Start both API and Angular dev servers
```

## API Endpoints

Base URL: `http://localhost:3001`

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Lookup Items
- `GET /lookupItems` - Get all lookup items
- `GET /lookupItems/:id` - Get lookup item by ID
- `POST /lookupItems` - Create new lookup item
- `PUT /lookupItems/:id` - Update lookup item
- `DELETE /lookupItems/:id` - Delete lookup item

## Adding New Data

1. **For new data types:** Create a new `.json` file in `/src/api/data/`
2. **Update build script:** Add the new data to `build-db.js`
3. **Rebuild database:** Run `npm run build:api`
4. **Update NgRx Effects:** Add new HTTP calls in Angular effects

## CORS Configuration

The `allowcors.js` middleware handles cross-origin requests from:
- Angular dev server (localhost:4200)
- Other development servers
- Supports all standard HTTP methods

## Routes Configuration

The `routes.json` file provides URL mappings for API endpoints, allowing for:
- Custom endpoint paths
- Alias routing
- API versioning support

## Development Workflow

1. Modify data in individual JSON files (`/src/api/data/`)
2. Run build script to update combined database
3. JSON Server automatically detects changes and updates endpoints
4. Angular components fetch updated data via NgRx Effects