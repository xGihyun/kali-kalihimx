<script lang="ts">
	import {
		Badges,
		Banner,
		MatchHistory,
		PowerCards,
		Rank,
		UpcomingMatch,
		UserAvatar
	} from '$lib/components/index';
	import LoginForm from './login-form.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let data;

	$: ({ session, user } = data);
</script>

{#if session && user}
	<Banner {user} isCurrentUser={true} />
	<UserAvatar {user} isCurrentUser={true} />

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Rank {user} />

		{#await Promise.all([data.lazy.matches, data.lazy.opponent])}
			<Skeleton class="min-h-20" />
		{:then [matches, opponent]}
			{#if !matches.success || !opponent.success}
				<p>
					Matches:
					{matches.code}: {matches.message}
				</p>
				<p>
					Opponent:
					{opponent.code}: {opponent.message}
				</p>
			{:else}
				<UpcomingMatch matches={matches.data || []} opponent={opponent.data} />
			{/if}
		{/await}

		{#await Promise.all([data.lazy.powerCards, data.lazy.matches])}
			<Skeleton class="min-h-20" />
		{:then [powerCards, matches]}
			{#if !powerCards.success || !matches.success}
				<p>
					Power Cards:
					{powerCards.code}: {powerCards.message}
				</p>
				<p>
					Matches:
					{matches.code}: {matches.message}
				</p>
			{:else}
				<PowerCards powerCards={powerCards.data || []} {user} matches={matches.data || []} />
			{/if}
		{/await}

		{#await data.lazy.matches}
			<Skeleton class="min-h-20" />
		{:then matches}
			{#if !matches.success}
				<p>
					Matches:
					{matches.code}: {matches.message}
				</p>
			{:else}
				<MatchHistory matches={matches.data || []} {user} />
			{/if}
		{/await}

		{#await data.lazy.badges}
			<Skeleton class="min-h-20" />
		{:then badges}
			<Badges {badges} {user} />
		{/await}

		<!-- {#await data.lazy.data} -->
		<!-- 	<Skeleton class="min-h-20" /> -->
		<!-- 	<Skeleton class="min-h-20" /> -->
		<!-- 	<Skeleton class="min-h-20" /> -->
		<!-- {:then [powerCards, matches, opponentDetails, ogMatches, badges]} -->
		<!-- 	<UpcomingMatch {matches} userId={user.id} {opponentDetails} /> -->
		<!-- 	<PowerCards {powerCards} isCurrentUser={true} {matches} /> -->
		<!-- 	<MatchHistory {matches} userId={user.id} {ogMatches} /> -->
		<!-- 	<Badges {badges} {user} /> -->
		<!-- {/await} -->
	</div>
{:else}
	<div class="flex w-full h-full">
		<!-- <div class="w-1/2 bg-card"></div> -->
		<div class="max-w-sm w-full m-auto">
			<LoginForm data={data.form} />
		</div>
	</div>
{/if}
