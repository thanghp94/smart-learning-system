
// This file re-exports all services from the new structure for backward compatibility
// Consider updating imports in your components to use the new structure directly

export * from './supabase/index';
import teachingSessionService from './teaching-session-service';

// Export teachingSessionService
export { teachingSessionService };
