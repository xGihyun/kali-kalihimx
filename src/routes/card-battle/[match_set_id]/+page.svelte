<script lang="ts">
	export let data;

	$: ({ turns } = data);

	// Function already exists in UpcomingMatch.svelte
</script>

{#each Array(6) as _, idx (idx)}
	<div>
		User: {turns.user2[idx].user_id}
	</div>
	<div>
		Card: {turns.user2[idx].card_name}
	</div>
	<div>
		Effect next turn: {turns.user2[idx].card_effect}
	</div>
	<div>
		Effect next turn: {turns.user2[idx].damage}
	</div>

	<div>
		User: {turns.user1[idx].user_id}
	</div>
	<div>
		Card: {turns.user1[idx].card_name}
	</div>
	<div>
		Effect next turn: {turns.user1[idx].card_effect}
	</div>
	<div>
		Effect next turn: {turns.user1[idx].damage}
	</div>
{/each}
