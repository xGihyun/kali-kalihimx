import { BACKEND_URL } from '$env/static/private';
import type { BattleCardData } from '$lib/types';
import { error, type RequestHandler } from '@sveltejs/kit';

// Optimize later
export const POST: RequestHandler = async ({ fetch, request, locals }) => {
	const { user_id } = locals;

	const cards: BattleCardData[] = await request.json();

	const payload: { name: string; skill: 'strike' | 'block'; user_id: string | undefined }[] =
		cards.map((card) => {
			return {
				name: card.id,
				skill: card.skill,
				user_id
			};
		});

	console.log(payload);

	const response = await fetch(`${BACKEND_URL}/card_battle`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		console.log('Battle Cards submitted!');
	} else {
		error(500, await response.text());
	}

	return new Response();
};
