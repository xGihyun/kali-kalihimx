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

	$: ({ session, user } = data);
</script>

{#if session && user}
	<Banner {user} isCurrentUser={true} />
	<UserAvatar {user} isCurrentUser={true} />

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Rank {user} />
		{#await data.lazy.data}
			<Skeleton class="min-h-20" />
			<Skeleton class="min-h-20" />
			<Skeleton class="min-h-20" />
		{:then lazyData}
			<UpcomingMatch match={lazyData[1][0]} userId={user.id} opponentDetails={lazyData[2]} />
			<PowerCards powerCards={lazyData[0]} isCurrentUser={true} {user} matches={lazyData[1]} />
			<MatchHistory matches={lazyData[1]} userId={user.id} />
		{/await}
	</div>
{:else}
	<div class="max-w-sm m-auto">
		<LoginForm form={data.form} formAction={form} />
	</div>
{/if}
