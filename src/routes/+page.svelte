<script lang="ts">
	import {
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
	export let form;

	$: ({ session, user, matches, opponentDetails, powerCards } = data);
</script>

{#if session && user}
	<Banner {user} isCurrentUser={true} />
	<UserAvatar {user} isCurrentUser={true} />

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Rank {user} />

		{#await matches}
			<Skeleton class="min-h-20" />
		{:then matches}
			<UpcomingMatch match={matches[0]} userId={user.id} {opponentDetails} />
		{/await}

		{#await powerCards}
			<Skeleton class="min-h-20" />
		{:then powerCards}
			{#if powerCards}
				<PowerCards {powerCards} isCurrentUser={true} {user} {matches} />
			{/if}
		{/await}

		{#await matches}
			<Skeleton class="min-h-20" />
		{:then matches}
			<MatchHistory {matches} userId={user.id} />
		{/await}
	</div>
{:else}
	<div class="max-w-sm m-auto">
		<LoginForm form={data.form} formAction={form} />
	</div>
{/if}
