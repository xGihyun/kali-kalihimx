import { BACKEND_URL, SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request, locals }) => {
	const { user_id } = locals;
	const formData = await request.formData();

	console.log(formData);

	const photoName = formData.get('filename') as string;
	const file = formData.get('file') as Blob;
	const fileName = `${user_id}_${photoName}`;

	await uploadBanner(fetch, file, fileName);

	const url = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/${fileName}`;

	console.log(url);

	await updateBannerUrl(fetch, user_id, url);

	return new Response();
};

async function uploadBanner(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	file: Blob,
	fileName: string
) {
	const response = await fetch(`${PUBLIC_SUPABASE_URL}/storage/v1/object/banners/${fileName}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${SERVICE_ROLE}`,
			'Content-Type': 'image/*'
		},
		body: file
	});

	if (response.ok) {
		console.log('Successfully uploaded banner');
	}
}

async function updateBannerUrl(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	user_id: string | undefined,
	image_url: string
) {
	if (!user_id) return;

	const response = await fetch(`${BACKEND_URL}/users/update/column?column=banner_url`, {
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
		console.log('Successfully updated banner URL');
	}
}
