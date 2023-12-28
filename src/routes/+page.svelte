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

	$: ({ user, powerCards, matches, opponentDetails } = data);
</script>

{#if user}
	<Banner {user} isCurrentUser={true} />
	<UserAvatar {user} isCurrentUser={true} />

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Rank {user} />
		<UpcomingMatch match={matches[0]} userId={user.id} {opponentDetails} />

		{#if powerCards}
			<PowerCards {powerCards} isCurrentUser={true} />
		{/if}

		<MatchHistory {matches} userId={user.id} />
	</div>
	<!-- <div class="flex gap-4 flex-col xl:flex-row"> -->
	<!-- 	<div class="flex-1"> -->
	<!-- 		<Rank {user} /> -->
	<!-- 	</div> -->
	<!-- 	<div class="flex-1"> -->
	<!-- 		<UpcomingMatch match={matches[0]} userId={user.id} {opponentDetails} /> -->
	<!-- 	</div> -->
	<!-- </div> -->
	<!---->
	<!-- <div class="flex gap-4 flex-col xl:flex-row"> -->
	<!-- 	{#if powerCards} -->
	<!-- 		<div class="flex-1"> -->
	<!-- 			<PowerCards {powerCards} /> -->
	<!-- 		</div> -->
	<!-- 	{/if} -->
	<!---->
	<!-- 	<div class="flex-1"> -->
	<!-- 		<MatchHistory {matches} userId={user.id} /> -->
	<!-- 	</div> -->
	<!-- </div> -->
{/if}
