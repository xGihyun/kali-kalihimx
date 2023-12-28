<script lang="ts">
	import { POWER_CARDS } from '$lib';
	import type { LoadingStatus, PowerCard } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';

	export let powerCards: PowerCard[] = [];
	export let isCurrentUser: boolean = false;

	let loadingStatus = Array.from({ length: powerCards.length }).fill('none') as LoadingStatus[];

	// function getPowerCardImage(card: string): string {
	// 	const imageUrl = POWER_CARDS.get(card);
	//
	// 	return imageUrl;
	// }
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-3xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2"
		>
			Power Cards

			<div class="flex gap-8 items-center mb-2 text-base">
				<div class="flex items-center gap-2">
					<div class="bg-muted-foreground w-4 h-4 rounded-full"></div>
					<span class="font-jost-medium">Available</span>
				</div>

				<div class="flex items-center gap-2">
					<div class="bg-muted-foreground w-4 h-4 animate-pulse rounded-full"></div>
					<span class="font-jost-medium">Activated</span>
				</div>

				<div class="flex items-center gap-2">
					<div class="bg-muted w-4 h-4 rounded-full"></div>
					<span class="font-jost-medium">Used</span>
				</div>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))]">
		{#each powerCards as card, idx (idx)}
			{@const powerCardDetails = POWER_CARDS.get(card.name)}

			{#if isCurrentUser}
				<Dialog.Root closeOnOutsideClick={false}>
					<Dialog.Trigger disabled={card.is_used || card.is_active}>
						<img
							src={powerCardDetails?.image_url}
							alt={card.name}
							class={`w-full ${
								card.is_used
									? 'brightness-[.30]'
									: card.is_active
										? 'animate-pulse'
										: 'brightness-100 hover:-translate-y-5 hover:brightness-125 transition-[transform,filter] duration-300'
							}`}
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
								class="flex items-center"
								method="POST"
								action="/?/power_card"
								use:enhance={() => {
									console.log('Activating power card.');

									loadingStatus[idx] = 'pending';

									return async ({ result }) => {
										if (result.type === 'success') {
											invalidate('user:power_cards');
											loadingStatus[idx] = 'success';
											console.log('Successfully activated power card.');
										} else {
											loadingStatus[idx] = 'error';
											console.error('Failed to activate power card.');
										}
									};
								}}
							>
								<input type="text" name="card_id" value={card.id} hidden />

								<Button
									type="submit"
									class={`text-base md:text-lg ${
										loadingStatus[idx] === 'success'
											? 'bg-green-500 pointer-events-none'
											: loadingStatus[idx] === 'error'
												? 'bg-red-500 hover:bg-red-600'
												: loadingStatus[idx] === 'pending'
													? 'bg-yellow-500 pointer-events-none'
													: 'bg-primary'
									}`}
									disabled={card.is_active || card.is_used}
								>
									<div class="flex items-center gap-1">
										{#if loadingStatus[idx] === 'pending'}
											<Reload class="h-5 w-5 animate-spin" />
											<span class="text-base md:text-lg">Activating...</span>
										{:else if loadingStatus[idx] === 'success'}
											<CheckCircled class="h-5 w-5 " />
											<span class="text-base md:text-lg">Success</span>
										{:else if loadingStatus[idx] === 'error'}
											<CrossCircled class="h-5 w-5 " />
											<span class="text-base md:text-lg">Error, please try again</span>
										{:else}
											<span class="text-base md:text-lg">Activate</span>
										{/if}
									</div>
								</Button>
							</form>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<img src={powerCardDetails?.image_url} alt={card.name} class="w-full" />
			{/if}
		{/each}
	</Card.Content>
</Card.Root>
