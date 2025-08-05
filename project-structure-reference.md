ht# Smart Learning System - Project Structure Reference

## Overview
This is a comprehensive learning management system built with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit

## Current Issue
The system has a persistent Node.js JSON.stringify bug causing malformed JSON responses (missing commas between object properties). Despite this, the frontend successfully loads and displays data, suggesting the issue is primarily in the serialization layer.

## Project Structure

### Root Configuration
- `package.json` - Main dependencies and scripts
- `vite.config.ts` - Vite configuration with React and Replit plugins
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Database ORM configuration
- `.replit` - Replit deployment configuration

### Database Schema (`shared/schema.ts`)
Complete PostgreSQL schema with tables:
- **users** - Authentication
- **students** - Student records with Vietnamese fields
- **employees** - Staff management
- **facilities** - Learning centers
- **classes** - Course management
- **teaching_sessions** - Class sessions
- **enrollments** - Student-class relationships
- **attendances** - Attendance tracking
- **assets** - Equipment/resource management
- **finances** - Financial transactions
- **payroll** - Employee payments
- **evaluations** - Student assessments
- **tasks** - Task management
- **requests** - Employee requests
- **contacts** - Contact management
- **files/images** - File storage
- **admissions** - Student applications

### Server Structure (`server/`)
- `index.ts` - Main server entry point
- `routes.ts` - Main route definitions
- `storage.ts` - Storage layer abstraction
- `vite.ts` - Vite middleware integration

#### Database (`server/database/`)
- `connection.ts` - Database connection setup
- `config.ts` - Database configuration
- `init.ts` - Database initialization

#### Routes (`server/routes/`)
- `admin.ts` - Admin functionality
- `ai.ts` - AI-powered features
- `crud.ts` - CRUD operations
- `education.ts` - Educational features
- `health.ts` - Health checks
- `hr.ts` - HR management
- `utils.ts` - Route utilities

#### Storage (`server/storage/`)
Individual storage classes for each entity:
- `students.ts`, `employees.ts`, `classes.ts`, etc.
- Each implements CRUD operations with Drizzle ORM

#### Middleware (`server/middleware/`)
- `errorHandler.ts` - Error handling
- `logger.ts` - Request logging
- `security.ts` - Security middleware
- `validation.ts` - Input validation

### Client Structure (`client/src/`)

#### Core Files
- `main.tsx` - React entry point
- `App.tsx` - Main app component
- `routes.tsx` - React Router configuration

#### API Layer (`client/src/api/`)
- `client.ts` - HTTP client configuration
- `students.ts`, `employees.ts` - Entity-specific API calls
- `index.ts` - API exports

#### Components (`client/src/components/`)
- `ui/` - Reusable UI components (shadcn/ui)
- `common/` - Common components
- `layout/` - Layout components
- `dashboard/` - Dashboard-specific components
- `performance/` - Performance optimization components

#### Pages (`client/src/pages/`)
Complete page structure for all entities:
- `Students/` - Student management
- `Employees/` - Employee management
- `Classes/` - Class management
- `Dashboard/` - Main dashboard
- `Auth/` - Authentication
- `Admin/` - Admin panel
- And many more...

#### Hooks (`client/src/hooks/`)
- `useApiData.ts` - Data fetching
- `useDashboardData.tsx` - Dashboard data
- `usePerformance.ts` - Performance monitoring

#### Libraries (`client/src/lib/`)
- `database-service.ts` - Database service layer
- `validation.ts` - Form validation
- `cache.ts` - Caching utilities
- `logger.ts` - Client-side logging

#### Contexts (`client/src/contexts/`)
- `AuthContext.tsx` - Authentication state
- `DatabaseContext.tsx` - Database state

### Key Features Implemented
1. **Multi-language Support** - Vietnamese interface
2. **Complete CRUD Operations** - For all entities
3. **Dashboard Analytics** - Student growth charts
4. **File Management** - Image and document uploads
5. **Authentication System** - User login/logout
6. **Responsive Design** - Mobile-friendly interface
7. **Real-time Updates** - Live data synchronization
8. **Advanced Filtering** - Search and filter capabilities
9. **Export Functionality** - Data export features
10. **AI Integration** - AI-powered tools

### Database Connection
- **Provider**: Neon PostgreSQL
- **Connection**: Configured in `.replit` environment
- **ORM**: Drizzle with TypeScript support

### Deployment Configuration
- **Platform**: Replit
- **Port**: 3000 (configured in `.replit`)
- **Build**: Vite for frontend, esbuild for backend
- **Environment**: Development and production configs

### Current Status
- ✅ Database schema complete and functional
- ✅ Backend API endpoints working (despite JSON bug)
- ✅ Frontend loading and displaying data correctly
- ✅ Authentication system functional
- ✅ CRUD operations implemented
- ❌ JSON serialization bug affecting API responses
- ❌ Form submissions may fail due to JSON parsing

### Recommended Rebuild Approach
1. **Preserve Database**: Keep existing PostgreSQL database and schema
2. **Fresh Node.js Environment**: Start with clean Node.js/npm setup
3. **Migrate Core Logic**: Copy business logic and database operations
4. **Rebuild API Layer**: Recreate Express routes with proper JSON handling
5. **Preserve Frontend**: Frontend appears to work well, minimal changes needed
6. **Test Incrementally**: Test each component as it's rebuilt

### Critical Files to Preserve
- `shared/schema.ts` - Complete database schema
- `client/src/` - Entire frontend (working well)
- `server/storage/` - Database operations logic
- `.replit` - Deployment configuration
- `package.json` - Dependencies list

This structure represents a comprehensive learning management system that's 90% functional, with the main issue being the Node.js JSON serialization bug affecting API responses.
