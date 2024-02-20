<script lang="ts">
	import { BADGES } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import type { Badge, User } from '$lib/types';

	export let badges: Badge[];
	export let user: User | undefined;
	export let currentUser: User | undefined;

	let selectedBadges: string[] = badges.map(({ name }) => name);

	function toggleBadge(badgeName: string): void {
		if (selectedBadges.some((name) => badgeName === name)) {
			selectedBadges = selectedBadges.filter((name) => name !== badgeName);
			return;
		}

		selectedBadges.push(badgeName);
		selectedBadges = selectedBadges;

		console.log(selectedBadges);
	}

	async function updateBadges(): Promise<void> {
		if (selectedBadges.length < 1) {
			return;
		}

		const response = await fetch(`/api/badges?user_id=${user?.id}`, {
			method: 'POST',
			body: JSON.stringify(selectedBadges),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(selectedBadges);

		if (!response.ok) {
			console.error('Failed to update badges: ', await response.text());
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-2xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2 items-center"
		>
			Badges
			<button on:click={updateBadges}>Apply</button>
		</Card.Title>
	</Card.Header>

	<Card.Content class="flex gap-4 flex-wrap">
		{#each BADGES as badge (badge.name)}
			<button
				class={`p-4 rounded-md border-4 border-white ${
					// badges.some(({ name }) => badge.name === name) ? 'brightness-100' : 'brightness-25'
					selectedBadges.some((name) => badge.name === name) ? 'brightness-100' : 'brightness-25'
				}`}
				disabled={currentUser?.role === 'user'}
				on:click={() => toggleBadge(badge.name)}
			>
				<svelte:component this={badge.icon} class="w-10 h-10" />
			</button>
		{/each}
	</Card.Content>
</Card.Root>
