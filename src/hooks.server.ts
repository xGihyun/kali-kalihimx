import { SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { displaySupabaseError } from '$lib/server';
import type { User } from '$lib/types';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE);

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const session = await event.locals.getSession();

	if (!session) {
		console.log('Session not found.');
		redirect(307, '/');
	}

	event.locals.getUserData = async () => {
		const { data, error } = await event.locals.supabase
			.from('users')
			.select('*')
			.eq('id', session?.user.id)
			.single();

		if (error) {
			displaySupabaseError(error);

			redirect(307, '/');
		}

		return data as User;
	};

	const user = await event.locals.getUserData();

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
		console.log('Session already exists.');
		redirect(302, '/');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
