import { BACKEND_URL } from '$env/static/private';
import { SectionSchema } from '$lib/schemas';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const data = await request.json();

	const parsedData = SectionSchema.safeParse(data);

	if (!parsedData.success) {
		throw error(400, {
			message: 'Invalid form data.'
		});
	}

	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'POST',
		body: JSON.stringify(parsedData.data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());

		throw error(500, {
			message: 'Server error. Please try again.'
		});
	}

	console.log('Successfully added new section.');

	return new Response();
};

export const DELETE: RequestHandler = async ({ fetch, request }) => {
	const data = await request.json();

	console.log('Deleting ', data);

	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'DELETE',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());

		throw error(500, {
			message: 'Server error. Please try again.'
		});
	}

	console.log('Successfully deleted sections.');

	return new Response();
};
