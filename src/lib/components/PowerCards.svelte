<script lang="ts">
	import { POWER_CARDS } from '$lib';
	import type { PowerCard } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	export let powerCards: PowerCard[];

	// function getPowerCardImage(card: string): string {
	// 	const imageUrl = POWER_CARDS.get(card);
	//
	// 	return imageUrl;
	// }
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">Power Cards</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-wrap">
		{#each powerCards as card, idx (idx)}
			<img src={POWER_CARDS.get(card.name)} alt={card.name} class="max-w-60" />
		{/each}
	</Card.Content>
</Card.Root>
