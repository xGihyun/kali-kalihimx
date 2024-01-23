import { BACKEND_URL } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from 'lucide-svelte';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const session = await event.locals.getSession();

	event.locals.getUserData = async () => {
		const response = await event.fetch(`${BACKEND_URL}/users/${session?.user.id}`, {
			method: 'GET'
		});

		if (!response.ok) {
			return;
		}

		const user: User = await response.json();

		return user;
	};

	const user = await event.locals.getUserData();

	if (!session || !user) {
		if (!event.route.id?.startsWith('/(auth)') && event.url.pathname !== '/') {
			console.log('Access denied');
			redirect(307, '/');
		}
	} else {
		if (
			event.route.id?.startsWith('/(admin)') &&
			event.url.pathname !== '/' &&
			user.role === 'user'
		) {
			console.log('Route for admins only. Access denied.');
			redirect(307, '/');
		}

		// NOTE: This causes bugs for reset password
		// if (event.route.id?.startsWith('/(auth)/(supabase)')) {
		// 	console.log('Please log out first.');
		// 	redirect(307, '/');
		// }

		if (event.url.pathname === '/register') {
			console.log('User session available');
			redirect(302, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
