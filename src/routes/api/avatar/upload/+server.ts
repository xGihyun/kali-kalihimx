import { BACKEND_URL, SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request, locals, url }) => {
	const session = await locals.getSession();
	const user_id = session?.user.id;
	const query = url.searchParams.get('image');

	if (!user_id || !query) {
		throw new Error('Failed to update avatar.');
	}

	const formData = await request.formData();

	const photoName = formData.get('filename') as string;
	const file = formData.get('file') as Blob;
	const fileName = `${user_id}_${photoName}`;

	const { data, error } = await locals.supabase.storage
		.from(query)
		.upload(`/public/${fileName}`, file, {
			cacheControl: '3600',
			upsert: true
		});

	console.log(data?.path);

	return new Response();
};

async function uploadAvatar(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	file: Blob,
	fileName: string
) {
	const response = await fetch(`${PUBLIC_SUPABASE_URL}/storage/v1/object/avatars/${fileName}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${SERVICE_ROLE}`,
			'Content-Type': 'image/*'
		},
		body: file
	});

	if (!response.ok) {
		console.log('Failed to upload avatar');
		console.log(await response.text());
	}

	console.log('Successfully uploaded avatar');
}

async function updateAvatarUrl(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	user_id: string | undefined,
	image_url: string
) {
	if (!user_id) return;

	const response = await fetch(`${BACKEND_URL}/users/update/column?column=avatar_url`, {
		method: 'POST',
		body: JSON.stringify({
			user_id,
			url: image_url
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	console.log(await response.text());

	if (response.ok) {
		console.log('Successfully updated avatar URL');
	}
}
