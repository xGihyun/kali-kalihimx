<script lang="ts">
	import {
		Banner,
		MatchHistory,
		PowerCards,
		Rank,
		UpcomingMatch,
		UserAvatar
	} from '$lib/components/index';

	export let data;

	$: ({ user, powerCards, matches } = data);
</script>

{#if user}
	<Banner {user} />
	<UserAvatar {user} />

	<Rank {user} />
	<PowerCards {powerCards} />

	<UpcomingMatch match={matches[0]} userId={user.id} />
	<MatchHistory {matches} userId={user.id} />
{/if}
