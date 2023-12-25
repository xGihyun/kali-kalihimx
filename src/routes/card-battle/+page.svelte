<script lang="ts">
	import { BLOCK_CARDS, STRIKE_CARDS } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import type { BattleCardData } from '$lib/types';
	import { Button } from '$lib/components/ui/button';

	let selectedCards: BattleCardData[] = [];

	function addToDeck(card: BattleCardData) {
		if (selectedCards.length >= 6) return;

		selectedCards.push(card);

		selectedCards = selectedCards;
	}

	async function submitCards() {
		if (selectedCards.length < 6) return;

		const response = await fetch('/api/card_battle/insert', {
			method: 'POST',
			body: JSON.stringify(selectedCards),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			console.log('Success');
		}
	}
</script>

{#each selectedCards as card, idx (idx)}
	<div>
		{card.name}
	</div>
{/each}

<Button class="text-base md:text-lg" on:click={submitCards}>Submit</Button>

<!-- Ignore type errors I hate TypeScript -->
<div class="flex flex-wrap">
	{#each STRIKE_CARDS as strike (strike.data.id)}
		{@const accuracy = strike.type.accuracy * 100}

		<Card.Root>
			<Card.Header>
				<Card.Title>{strike.data.name}</Card.Title>
				<Card.Description>Strike</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>{strike.type.damage}</p>
				<p>{accuracy}%</p>
				<p>{strike.type.effect}</p>
			</Card.Content>
			<Card.Footer>
				<Button class="text-base md:text-lg" on:click={() => addToDeck(strike.data)}>Select</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<div class="flex flex-wrap">
	{#each BLOCK_CARDS as block (block.data.id)}
		{@const damageReduction = block.type.damage_reduction * 100}

		<Card.Root class="max-w-60">
			<Card.Header>
				<Card.Title>{block.data.name}</Card.Title>
				<Card.Description>Block</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>{damageReduction}%</p>
				<p>{block.type.strike_to_cancel}</p>
				<p>{block.type.effect}</p>
			</Card.Content>
			<Card.Footer>
				<Button class="text-base md:text-lg" on:click={() => addToDeck(block.data)}>Select</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
