<script lang="ts">
	import { Banner, PowerCards, Rank, UserAvatar } from '$lib/components';

	export let data;

	$: ({ user, currentUserId, powerCards } = data);
</script>

{#if user}
	<Banner {user} isCurrentUser={user.id === currentUserId} />
	<UserAvatar {user} isCurrentUser={user.id === currentUserId} />

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Rank {user} />

		{#if powerCards}
			<PowerCards {powerCards} isCurrentUser={user.id === currentUserId} />
		{/if}
	</div>
{/if}
