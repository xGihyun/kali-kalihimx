<script lang="ts">
	import { POWER_CARDS } from '$lib';
	import type { PowerCard } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

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
			{@const powerCardDetails = POWER_CARDS.get(card.name)}

			<Dialog.Root>
				<Dialog.Trigger disabled={card.is_used || card.is_active}>
					<img
						src={powerCardDetails?.image_url}
						alt={card.name}
						class="max-w-60 hover:-translate-y-5 hover:brightness-125 transition-[transform,filter] duration-300"
					/>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-2xl">
					<Dialog.Header>
						<Dialog.Title class="font-normal font-jost-medium text-xl"
							>Activate
							<span class="font-jost-bold">{card.name}</span>
							?
						</Dialog.Title>
					</Dialog.Header>

					<div class="flex gap-8">
						<img src={powerCardDetails?.image_url} alt={card.name} class="max-w-60" />
						<div>
							<h3 class="font-jost-bold text-3xl mb-4">
								{card.name}
							</h3>
							<p class="text-base md:text-lg">{powerCardDetails?.description}</p>
						</div>
					</div>

					<Dialog.Description class="text-center">
						This action cannot be undone. You can only use each power card once.
					</Dialog.Description>

					<Dialog.Footer>
						<form
							class="contents"
							method="POST"
							action="/?/power_card"
							use:enhance={() => {
								console.log('Activating power card.');

								return async ({ result }) => {
									if (result.type === 'success') {
										invalidate('user:power_cards');
										console.log('Successfully activated power card.');
									}
								};
							}}
						>
							<input type="text" name="card_id" value={card.id} hidden />
							<Button type="submit" class="text-base md:text-lg">Activate</Button>
						</form>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</Card.Content>
</Card.Root>
