# EdConnect AI Tutoring Platform

## Overview

EdConnect is an educational AI tutoring platform designed for NYC's competitive high schools (Stuyvesant, Bronx Science, Brooklyn Tech, etc.), specifically targeting 9th-grade students who are very intelligent but may need extra processing time to keep up with rapid classroom instruction.

The platform provides personalized, interactive AI-powered tutoring across the **full 9th grade curriculum**:
- **Mathematics**: Algebra, Geometry
- **Sciences**: Chemistry, Biology, Physics  
- **Humanities**: Global Studies, English, U.S. History
- **Languages**: Spanish, French, Mandarin, Latin
- **Other**: Computer Science, Health, Art, Music

The tutoring system uses **visual aids, storytelling, reward systems, and detailed improvement plans** to make learning engaging and effective. All student data is stored permanently in PostgreSQL with comprehensive FERPA-compliant PII redaction before any third-party AI calls.

The application serves three primary user roles: Students (accessing AI tutoring and tracking progress), Educators (monitoring student performance and managing classes), and Administrators (overseeing system-wide analytics and compliance).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- Built on Radix UI primitives for accessible, composable components
- Styled with Tailwind CSS using a custom design system with CSS variables
- Theme configuration supports light/dark modes with customizable radius and color schemes
- Motion animations via Framer Motion for interactive elements (tutoring interface, celebrations, onboarding)

**State Management**:
- TanStack Query (React Query) for server state management and API caching
- Local component state with React hooks for UI interactions
- Custom context providers for authentication and onboarding flows

**Key Features**:
- AI Tutor chat interface with real-time message streaming
- Learning path visualization with interactive node graphs
- Progress tracking with charts and analytics
- Onboarding tutorial system with step-by-step guidance
- Study tools including focus timer with ambient sounds and AI companion
- Knowledge sharing hub for collaborative learning

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**:
- RESTful API endpoints organized by domain (auth, tutor, analytics, classes)
- Session-based authentication using Passport.js with local strategy
- Role-based access control middleware for Students, Educators, and Admins
- Hierarchical admin permissions (District, School, Department levels)

**Authentication & Authorization**:
- Password hashing using scrypt (Node.js crypto module)
- Session management with express-session
- HTTP-only cookies with secure flag in production
- Trust proxy configuration for deployment behind reverse proxies

**Business Logic Separation**:
- Storage layer abstraction in `server/storage.ts` for data operations
- AI integration logic isolated in `server/openai.ts`
- Route handlers in `server/routes.ts` coordinate between storage and external services

### Data Storage

**Database**: PostgreSQL via Neon serverless driver

**ORM**: Drizzle ORM with type-safe schema definitions

**Schema Design**:
- Users table with role-based access (student, educator, admin)
- Hierarchical organizational structure (Districts → Schools → Departments)
- Educational entities (Classes, Enrollments, Grades, Attendance)
- Tutoring system (Sessions, Messages with full conversation history)
- Achievements and progress tracking
- Students and Educators tables with role-specific metadata

**Session Storage**: 
- Development: In-memory store (MemoryStore)
- Production: PostgreSQL-backed sessions (connect-pg-simple) for persistence

**Migrations**: Managed via Drizzle Kit with schema changes tracked in `migrations/` directory

### External Dependencies

**AI/LLM Integration**:
- OpenAI GPT-5 API accessed via Replit AI Integrations service
- Base URL and API key provided through Replit environment variables
- Comprehensive system prompt optimized for interactive, engaging tutoring with:
  - Visual aids (detailed descriptions, mental images, ASCII art)
  - Storytelling (narratives, historical anecdotes, real-world scenarios)
  - Reward systems (celebrating progress, marking milestones, specific praise)
  - Detailed improvement plans (personalized feedback, study strategies, action plans)
- **FERPA COMPLIANCE IMPLEMENTED**: Comprehensive PII redaction applied to all student messages before OpenAI calls
  - Redacts: student names, emails, IDs, school names, phone, address, SSN, DOB, ZIP codes
  - Audit logging when redaction occurs
  - Student context passed from authenticated session data

**FERPA Compliance Requirements** (from FERPA_COMPLIANCE.md):
- Parental consent required before live deployment
- PII redaction needed before sending messages to OpenAI
- Data minimization and retention policies must be implemented
- Vendor Data Processing Agreement with Replit required
- Audit logging for data access not yet implemented

**Third-Party Services**:
- Google Classroom (planned integration, UI shows "Connected" status)
- Zoom (planned integration for virtual classrooms)
- Canvas LMS (planned integration)

**Development Tools**:
- Vite plugins: React, Shadcn theme JSON, runtime error modal, Cartographer (Replit-specific)
- TypeScript for type safety across frontend and backend
- Drizzle Kit for database schema management and migrations

### Security Architecture

**Current Implementation**:
- HTTPS/TLS encryption for data in transit (enforced in production)
- Secure session cookies with httpOnly flag
- CORS protection through Express middleware
- Input validation using Zod schemas

**Missing Critical Features** (per FERPA compliance):
- Database encryption at rest not implemented
- PII filtering/redaction before AI API calls
- Comprehensive audit logging
- Automated data retention and deletion
- Security audit procedures not established

### Deployment Considerations

**Environment Requirements**:
- `DATABASE_URL`: Required for PostgreSQL connection (fails fast if missing)
- `SESSION_SECRET`: Used for session encryption (defaults to "edconnect-secret-key")
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Replit AI service endpoint
- `AI_INTEGRATIONS_OPENAI_API_KEY`: Replit AI authentication
- `NODE_ENV`: Controls production vs development behavior

**Build Process**:
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Shared types in `shared/` directory accessible to both frontend and backend

**Production Blockers**:
- FERPA compliance requirements not fully implemented
- Parental consent system not built
- Data Processing Agreements with vendors not established
- No PII redaction in AI tutor messages