import { BACKEND_URL } from '$env/static/private';
import type { CardBattleTurn } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const matchId = url.searchParams.get('match-id');

	const response = await fetch(`${BACKEND_URL}/matches/${matchId}/card-battle`, {
		method: 'GET'
	});

	const result: CardBattleTurn[] = await response.json();

	return json(result);
};
