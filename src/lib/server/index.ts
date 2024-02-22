import type { PostgrestError } from '@supabase/supabase-js';

export function displaySupabaseError(error: PostgrestError): void {
	console.error(
		`ERROR ${error.code}:\nMESSAGE: ${error.message}\nHINT: ${error.hint}\nDETAILS: ${error.details}`
	);
}
