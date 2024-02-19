<script lang="ts">
	import { BADGES } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import type { Badge } from '$lib/types';

	export let badges: Badge[];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-2xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2 items-center"
		>
			Badges
		</Card.Title>
	</Card.Header>

	<Card.Content class="flex gap-4 flex-wrap">
		{#each BADGES as badge (badge.name)}
			<div
				class={`p-4 rounded-md border-4 border-white ${
					badges.some(({ name }) => badge.name === name) ? 'brightness-100' : 'brightness-25'
				}`}
			>
				<svelte:component this={badge.icon} class="w-10 h-10" />
			</div>
		{/each}
	</Card.Content>
</Card.Root>
