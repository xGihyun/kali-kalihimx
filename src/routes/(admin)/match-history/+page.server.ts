import { CACHE_DURATION } from '$lib';
import { BACKEND_URL } from '$lib/server';
import type { Matchmake, MaxSet, Section, UpdateScore, User } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import z from 'zod';
import { UpdateScoreSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ fetch, url, setHeaders, depends }) => {
	const section = url.searchParams.get('section');
	const set = Number(url.searchParams.get('set')) || 1;
	const matchType = url.searchParams.get('match_type') || 'arnis';

	const getMatches = async () => {
		const response = await fetch(`${BACKEND_URL}/matches?set=${set}&section=${section}`, {
			method: 'GET'
		});

		if (response.ok) {
			const matches: Matchmake[] = await response.json();

			return matches;
		}

		return null;
	};

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
		const sections: Section[] = await response.json();

		if (response.ok) {
			return sections;
		}

		return null;
	};

	const getMaxSets = async () => {
		const response = await fetch(`${BACKEND_URL}/max_sets`, { method: 'GET' });
		const maxSets: MaxSet[] = await response.json();

		if (response.ok) {
			return maxSets;
		}

		return null;
	};

	depends('card-battle:damage');

	// TODO: CACHE INVALIDATION
	// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		matches: await getMatches(),
		sections: await getSections(),
		maxSets: await getMaxSets()
	};
};

export const actions: Actions = {
	submit_score: async ({ fetch, request }) => {
		try {
			const formData = await request.formData();

			const user1_score = Number(formData.get('user1_score'));
			const user2_score = Number(formData.get('user2_score'));
			const difference = Math.abs(user1_score - user2_score);

			const data1: UpdateScore = {
				user_id: formData.get('user1') as string,
				score: user1_score,
				is_winner: user1_score > user2_score,
				difference
			};

			const data2: UpdateScore = {
				user_id: formData.get('user2') as string,
				score: user2_score,
				is_winner: user1_score < user2_score,
				difference
			};

			const parsedData1 = UpdateScoreSchema.parse(data1);
			const parsedData2 = UpdateScoreSchema.parse(data2);

			await submitScore(parsedData1, fetch);
			await submitScore(parsedData2, fetch);

			return {
				success: true
			};
		} catch (err) {
			console.log('Failed to submit score:');
			console.log(err);

			return {
				success: false
			};
		}
	}
};

async function submitScore(data: UpdateScore, fetch: any) {
	try {
		console.log('Submitting...');
		const response = await fetch(`${BACKEND_URL}/scores/update`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			console.log('Successfully submitted score.');
		}
	} catch (err) {
		console.log('Failed to submit score:');
		console.log(err);
	}
}
