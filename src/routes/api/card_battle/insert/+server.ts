import { BACKEND_URL } from '$lib/server';
import type { BattleCardData } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

// Optimize later
export const POST: RequestHandler = async ({ fetch, request, locals }) => {
	const { user_id } = locals;

	// if (!user_id) return new Response();

	console.log(user_id);
	const cards: BattleCardData[] = await request.json();

	// @ts-ignore
	const payload: { name: string; skill: string; user_id: string }[] = cards.map((card) => {
		return {
			name: card.name,
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
		console.log('Failed to submit battle cards.');
	}

	return new Response();
};
