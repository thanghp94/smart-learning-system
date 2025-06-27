# School Management System

## Overview

This is a comprehensive school management system built with a modern full-stack architecture. The application provides features for managing students, classes, teaching sessions, employees, facilities, and various administrative tasks. It includes an AI-powered command interface for natural language interactions and comprehensive data management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API routes
- **Database**: PostgreSQL with Drizzle ORM (migrated from SQLite)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store
- **Development**: Development server with hot reload

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit
- **Connection**: Serverless connection pooling with Neon

## Key Components

### Core Entities
1. **Students**: Student management with personal information, enrollment status, and academic tracking
2. **Classes**: Class organization with scheduling, teacher assignments, and curriculum management
3. **Teaching Sessions**: Individual lesson management with attendance, evaluations, and materials
4. **Employees**: Staff management including teachers and administrative personnel
5. **Facilities**: Physical resource management including classrooms and equipment
6. **Enrollments**: Student-class relationship management
7. **Attendance**: Session-based attendance tracking
8. **Finances**: Fee management and financial tracking

### AI Integration
- **Command Interface**: Natural language command processing using OpenAI GPT models
- **Supabase Edge Functions**: Serverless functions for AI command processing
- **Multi-modal Support**: Text and image generation capabilities
- **Vietnamese Language Support**: Optimized for Vietnamese educational context

### Authentication & Authorization
- **Context-based Auth**: React context for authentication state management
- **Protected Routes**: Route-level access control
- **Role-based Access**: Different interfaces for different user types

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful API endpoints with Express.js
2. **Data Fetching**: TanStack Query for efficient data fetching and caching
3. **Form Handling**: React Hook Form with server-side validation
4. **Real-time Updates**: Optimistic updates with query invalidation

### Database Operations
1. **Type Safety**: End-to-end type safety with TypeScript and Drizzle
2. **Connection Management**: Serverless connection pooling
3. **Schema Synchronization**: Automated schema updates with migrations
4. **Query Optimization**: Efficient queries with proper indexing

### AI Command Processing
1. **Command Analysis**: Natural language understanding using OpenAI
2. **Intent Recognition**: Multi-step processing for command execution
3. **Database Integration**: Direct database operations from AI commands
4. **Response Generation**: Human-friendly response generation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development

### AI & External Services
- **OpenAI API**: For natural language processing and image generation
- **Supabase**: Backend-as-a-Service for edge functions and storage

## Deployment Strategy

### Production Build
- **Frontend**: Static assets built with Vite and served from `/dist/public`
- **Backend**: Node.js server bundled with esbuild for optimal performance
- **Database**: Serverless PostgreSQL deployment with automatic scaling

### Development Environment
- **Hot Reload**: Vite development server with React Fast Refresh
- **TypeScript**: Real-time type checking during development
- **Database**: Local development with production-like schema

### Hosting Configuration
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Express server on port 5000
- **Environment Variables**: Secure configuration for database and API keys

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Successfully migrated from SQLite to PostgreSQL database
  * Updated schema from sqlite-core to pg-core
  * Replaced better-sqlite3 with @neondatabase/serverless
  * Updated all table definitions to use PostgreSQL types
  * Fixed timestamp handling to use PostgreSQL defaultNow()
  * All API endpoints verified working with PostgreSQL
- June 26, 2025. Added comprehensive database tables and removed Supabase dependencies
  * Added 19 new database tables: settings, finances, finance_transaction_types, 
    asset_transfers, activities, images, files, events, contacts, requests, 
    tasks, evaluations, student_assignments, payroll, employee_clock_ins, 
    admissions, sessions, enums
  * Removed all Supabase client dependencies and configurations
  * Updated DatabaseContext to work directly with PostgreSQL API
  * All database operations now use PostgreSQL exclusively
  * Fixed frontend loading issue caused by Supabase client initialization
  * System now loads properly without hanging on loading screen
- June 26, 2025. Fixed critical runtime errors and stabilized application
  * Fixed SelectItem component error by adding proper value props
  * Resolved navigation duplicate key warning for file/folder links
  * Added missing API endpoints for events, tasks, sessions, and admissions
  * Fixed TypeScript errors in teaching-session-service (trang_thai vs status)
  * Improved error handling in base-service to prevent UI crashes
  * All major sections now load correctly: students, employees, classes, teaching sessions
  * Application fully functional with PostgreSQL backend
- June 26, 2025. Resolved all reported application errors and completed missing functionality
  * Fixed tasks table schema mismatch - corrected column names from English to Vietnamese
  * Added complete API endpoints for evaluations, payroll, admissions, and images
  * Implemented missing storage methods for all new entities with proper error handling
  * Fixed teaching sessions teacher loading by updating TeachingSessionService to use PostgreSQL API
  * Resolved all TypeScript compilation errors in storage and routes
  * Added proper null safety checks for database operations
  * All reported errors now fixed: tasks, teacher lists, payroll, evaluations, enrollments, finances, images, requests
- June 26, 2025. Fixed Vietnamese console errors for evaluations and enrollments
  * Resolved "không thể tải danh sách đánh giá" by ensuring evaluations API endpoint works correctly
  * Fixed "không thể tải danh sách ghi danh" by adding missing enrollments API endpoint
  * Added complete CRUD operations for enrollments with proper error handling
  * Verified all database operations return proper responses without errors
  * Application now fully functional with all data loading correctly
- June 26, 2025. Completed final error fixes and employee saving functionality
  * Fixed all remaining schema-related errors by updating schema service to use PostgreSQL API
  * Added database schema API endpoint (/api/database-schema) for schema information
  * Resolved employee saving issue by fixing field mappings between form and database schema
  * Updated Employee type definition to match PostgreSQL schema (ten_nhan_vien, chuc_vu, so_dien_thoai, trang_thai)
  * Created EmployeeFormContainer component with proper form submission handling
  * Fixed Supabase references in MonthlyAttendanceView to use PostgreSQL API
  * Added getByRole method to employee service for teacher filtering
  * All console errors eliminated, employee data now saves successfully to database
- June 27, 2025. Implemented comprehensive Supabase migration system
  * Created complete Supabase storage implementation with all CRUD operations
  * Built dynamic database configuration that automatically selects between Supabase and PostgreSQL
  * Implemented migration API endpoints and UI for data transfer from PostgreSQL to Supabase
  * Updated all server routes to use dynamic storage selection with automatic fallback
  * Fixed environment variable configuration for proper Supabase client initialization
  * System now supports both databases with seamless switching based on availability
  * Migration tool integrated into admin panel for easy data transfer management
  * Created comprehensive admin interface with tabbed navigation for migration, SQL execution, schema management
  * Implemented automatic database detection and fallback mechanisms for seamless operation
  * System architecture now supports full PostgreSQL to Supabase migration with data integrity preservation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```