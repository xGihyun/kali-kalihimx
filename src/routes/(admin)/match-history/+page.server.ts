import type { Matchmake, MaxSet, Section, UpdateScore } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SubmitScoreSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, url, depends, setHeaders }) => {
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
	setHeaders({ 'cache-control': `max-age=0, s-maxage=120, proxy-revalidate` });

	return {
		matches: getMatches(),
		sections: getSections(),
		maxSets: getMaxSets(),
		form: await superValidate(SubmitScoreSchema),
		selectedSection: section,
		selectedSet: set,
		selectedMatchType: matchType
	};
};

// This is pretty bad
export const actions: Actions = {
	submit_score: async (event) => {
		const form = await superValidate(event, SubmitScoreSchema);

		if (!form.valid) {
			return fail(400, {
				form,
				success: false
			});
		}

		const { user1_id, user2_id, user1_score, user2_score, match_set_id } = form.data;
		const difference = Math.abs(user1_score - user2_score);

		const data1: UpdateScore = {
			user_id: user1_id,
			score: user1_score,
			is_winner: user1_score > user2_score,
			difference
		};

		const data2: UpdateScore = {
			user_id: user2_id,
			score: user2_score,
			is_winner: user1_score < user2_score,
			difference
		};

		await submitScore(data1, event.fetch);
		await submitScore(data2, event.fetch);
		await updateMatchStatus(event.fetch, match_set_id, 'done');

		return {
			form,
			success: true
		};
	}
};

async function submitScore(
	data: UpdateScore,
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>
) {
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
	} else {
		return fail(response.status, {
			success: false,
			error: 'Failed to submit score.'
		});
	}
}

async function updateMatchStatus(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	match_set_id: string,
	status: 'pending' | 'done'
) {
	console.log('Updating status...');

	const response = await fetch(`${BACKEND_URL}/matches/update`, {
		method: 'POST',
		body: JSON.stringify({
			match_set_id,
			status
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		console.log('Successfully updated match status to: ', status);
	}
}
