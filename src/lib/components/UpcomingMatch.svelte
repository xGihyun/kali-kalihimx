<script lang="ts">
	import type { Matchmake } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	export let match: Matchmake;
	export let userId: string;

	function getOpponent(match: Matchmake): { id: string; name: string } {
		if (userId === match.user1_id) {
			return {
				id: match.user2_id,
				name: `${match.user2_first_name} ${match.user2_last_name}`
			};
		}

		return {
			id: match.user1_id,
			name: `${match.user1_first_name} ${match.user1_last_name}`
		};
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">Upcoming Match</Card.Title>
	</Card.Header>
	<Card.Content>
		Opponent: {getOpponent(match).name}
		Skill: {match.arnis_skill}
		Footwork: {match.arnis_footwork}
	</Card.Content>
</Card.Root>
