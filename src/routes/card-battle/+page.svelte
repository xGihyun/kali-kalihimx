<script lang="ts">
	import { BLOCK_CARDS, STRIKE_CARDS } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import type { BattleCard, BattleCardData, LoadingStatus } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';

	let selectedCards: BattleCardData[] = [];
	let loadingStatus: LoadingStatus = 'none';

	function addToDeck(card: BattleCard) {
		if (selectedCards.length >= 6) return;

		selectedCards.push({
			name: card.data.name,
			skill: card.data.skill,
			id: card.data.id
		});

		selectedCards = selectedCards;
	}

	function removeInDeck(idx: number) {
		if (selectedCards.length < 1) return;

		selectedCards = selectedCards.filter((_, i) => i !== idx);
		// selectedCards = selectedCards.filter((card) => name !== card);
	}

	async function submitCards() {
		if (selectedCards.length < 6) return;

		loadingStatus = 'pending';

		const response = await fetch('/api/card_battle/insert', {
			method: 'POST',
			body: JSON.stringify(selectedCards),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			loadingStatus = 'success';
			console.log('Successfully submitted cards.');
		} else {
			loadingStatus = 'error';
			console.error('Failed to submit cards.');
		}
	}
</script>

<div class="fixed bottom-10 right-[5%]">
	<Popover.Root>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} class="text-base md:text-lg h-auto">View Deck</Button>
		</Popover.Trigger>
		<Popover.Content asChild>
			<Card.Root class="fixed bottom-24 right-[5%]">
				<Card.Header>
					<Card.Title class="font-jost-semibold text-xl">Selected Cards</Card.Title>
					<Card.Description>The cards you selected will be listed here</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					{#each selectedCards as card, idx (idx)}
						<div class="flex items-center justify-between">
							<p>
								<span class="text-primary font-jost-medium">
									#{idx + 1}
								</span>
								<span>
									{card.name}
								</span>
							</p>

							{#if loadingStatus === 'none' || loadingStatus === 'error'}
								<button on:click|preventDefault={() => removeInDeck(idx)}>
									<CrossCircled class="w-5 h-5 text-destructive" />
								</button>
							{/if}
						</div>
					{/each}
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button
						on:click={submitCards}
						class={`text-base md:text-lg ${
							loadingStatus === 'success'
								? 'bg-green-500 text-primary-foreground pointer-events-none'
								: loadingStatus === 'error'
									? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
									: loadingStatus === 'pending'
										? 'bg-yellow-500 text-primary-foreground pointer-events-none'
										: 'bg-secondary'
						}`}
						disabled={loadingStatus === 'success'}
						variant="secondary"
					>
						<div class="flex items-center gap-1">
							{#if loadingStatus === 'pending'}
								<Reload class="h-5 w-5 animate-spin" />
								<span class="text-base md:text-lg">Submitting...</span>
							{:else if loadingStatus === 'success'}
								<CheckCircled class="h-5 w-5 " />
								<span class="text-base md:text-lg">Success</span>
							{:else if loadingStatus === 'error'}
								<CrossCircled class="h-5 w-5 " />
								<span class="text-base md:text-lg">Error, please try again</span>
							{:else}
								<span class="text-base md:text-lg">Submit</span>
							{/if}
						</div>
					</Button>
				</Card.Footer>
			</Card.Root>
		</Popover.Content>
	</Popover.Root>
</div>

<h1 class="text-4xl md:text-6xl font-jost-bold mb-10">Card Battle</h1>

<h2 class="font-jost-semibold text-3xl md:text-4xl mb-5 text-muted-foreground uppercase">
	Strikes
</h2>

<div
	class="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-2 place-items-center text-sm md:text-base mb-10"
>
	{#each STRIKE_CARDS as strike (strike.data.id)}
		{@const accuracy = strike.type.accuracy * 100}

		<Card.Root class="w-full h-full flex flex-col justify-between">
			<div>
				<Card.Header>
					<Card.Title class="font-normal font-jost-medium text-xl">{strike.data.name}</Card.Title>
					<Card.Description class="italic text-base">{strike.type.effect}</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-1">
					<div class="grid grid-cols-5 items-center gap-4">
						<span class="col-span-2 sm:col-span-2">Damage</span>
						<p class="col-span-3 font-jost-medium text-primary/80">{strike.type.damage}</p>
					</div>

					<hr />

					<div class="grid grid-cols-5 items-center gap-4">
						<span class="col-span-2 sm:col-span-2">Accuracy</span>
						<p class="col-span-3 font-jost-medium text-primary/80">{accuracy}%</p>
					</div>
				</Card.Content>
			</div>
			<Card.Footer class="flex justify-end">
				<Button
					class="text-sm md:text-base h-auto"
					variant="outline"
					on:click={() => addToDeck(strike)}>Select</Button
				>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<h2 class="font-jost-semibold text-3xl md:text-4xl mb-5 text-muted-foreground uppercase">Blocks</h2>

<div
	class="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-2 place-items-center text-sm md:text-base mb-40"
>
	{#each BLOCK_CARDS as block (block.data.id)}
		{@const damageReduction = block.type.damage_reduction * 100}

		<Card.Root class="max-w-md w-full h-full flex flex-col justify-between">
			<div>
				<Card.Header>
					<Card.Title class="font-normal font-jost-semibold text-xl">{block.data.name}</Card.Title>
					<Card.Description class="italic text-sm md:text-base"
						>{block.type.effect}</Card.Description
					>
				</Card.Header>
				<Card.Content class="space-y-1">
					<div class="grid grid-cols-5 items-center gap-4">
						<span class="col-span-2 sm:col-span-2">Damage Reduction</span>
						<p class="col-span-3 font-jost-medium text-primary/80">{damageReduction}%</p>
					</div>

					<hr />

					<div class="grid grid-cols-5 items-center gap-4">
						<span class="col-span-2 sm:col-span-2">Cancels</span>
						<p class="col-span-3 font-jost-medium text-primary/80">{block.type.strike_to_cancel}</p>
					</div>
				</Card.Content>
			</div>
			<Card.Footer class="flex justify-end">
				<Button
					class="text-sm md:text-base h-auto"
					variant="outline"
					on:click={() => addToDeck(block)}>Select</Button
				>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
