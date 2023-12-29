<script lang="ts">
	import {
		Banner,
		MatchHistory,
		PowerCards,
		Rank,
		UpcomingMatch,
		UserAvatar
	} from '$lib/components/index';
	import LoginForm from './(auth)/login/login-form.svelte';

	export let data;

	$: ({ session, user, matches, opponentDetails, powerCards } = data);
</script>

{#if session && user}
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
{:else}
	<div class="max-w-sm m-auto">
		<LoginForm form={data.form} />
	</div>
{/if}
