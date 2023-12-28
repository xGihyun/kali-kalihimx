import { BACKEND_URL, SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request, locals }) => {
	const { user_id } = locals;
	const formData = await request.formData();

	const photoName = formData.get('filename') as string;
	const file = formData.get('file') as Blob;
	const fileName = `${user_id}_${photoName}`;

	await uploadAvatar(fetch, file, fileName);

	const url = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

	await updateAvatarUrl(fetch, user_id, url);

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

	if (response.ok) {
		console.log('Successfully uploaded avatar');
	}
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
