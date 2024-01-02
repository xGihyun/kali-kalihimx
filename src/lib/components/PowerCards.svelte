<script lang="ts">
	import { POWER_CARDS, SKILLS } from '$lib';
	import type { LoadingStatus, Matchmake, PowerCard, User } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { CardStackPlus, CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let powerCards: PowerCard[] = [];
	export let isCurrentUser: boolean = false;
	export let user: User | undefined;
	export let matches: Matchmake[] = [];

	let selectedUser: string | undefined;
	let selectedCard: string | undefined;
	let selectedSkill: string | undefined;

	let loadingStatus = Array.from({ length: powerCards.length }).fill('none') as LoadingStatus[];

	$: hasNoCurrentMatch = (matches.length > 0 && matches[0].status === 'done') || matches.length < 1;

	async function getUsersInSection(): Promise<User[] | undefined> {
		if (!user) return;

		const response = await fetch(`/api/users?section=${user.section}`, {
			method: 'GET'
		});

		const users: User[] = await response.json();

		return users;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-2xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2"
		>
			Power Cards

			<div class="flex gap-8 items-center mb-2 text-base flex-wrap">
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

	{#if hasNoCurrentMatch && isCurrentUser}
		<p class="text-muted-foreground italic col-span-2 px-6 pb-6">
			Please wait for the admin to queue a new match.
		</p>
	{/if}

	<Card.Content class="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-4">
		{#if user && user.is_private && !isCurrentUser}
			<p class="text-muted-foreground italic">Power cards are hidden...</p>
		{:else}
			{#each powerCards as card, idx (idx)}
				{@const powerCardDetails = POWER_CARDS.get(card.name)}

				{#if isCurrentUser}
					<Dialog.Root closeOnOutsideClick={false}>
						<Dialog.Trigger disabled={card.is_used || card.is_active || hasNoCurrentMatch}>
							<img
								src={powerCardDetails?.image_url}
								alt={card.name}
								class={`w-full ${
									card.is_used || hasNoCurrentMatch
										? 'brightness-[.30]'
										: card.is_active
											? 'animate-pulse'
											: 'brightness-100 hover:-translate-y-5 hover:brightness-125 transition-[transform,filter] duration-300'
								}`}
							/>
						</Dialog.Trigger>
						<Dialog.Content class="max-w-2xl w-full sm:w-auto md:w-auto">
							<Dialog.Header>
								<Dialog.Title class="font-normal font-jost-bold text-xl">{card.name}</Dialog.Title>
								<Dialog.Description>
									{powerCardDetails?.description}
								</Dialog.Description>
							</Dialog.Header>

							<div class="flex gap-8 flex-col sm:flex-row items-center justify-center">
								<img src={powerCardDetails?.image_url} alt={card.name} class="max-w-60" />
								{#if card.name === 'Twist of Fate' || card.name === 'Extra Wind' || card.name === "Warlord's Domain"}
									<div class="flex flex-col gap-8">
										{#if card.name === 'Twist of Fate'}
											{#await getUsersInSection()}
												<Skeleton class="w-60 h-10" />
											{:then users}
												{#if users}
													<Select.Root
														preventScroll={false}
														required
														onSelectedChange={(e) => (selectedUser = `${e?.value}`)}
													>
														<Select.Trigger class="w-60">
															<Select.Value placeholder="Users" />
														</Select.Trigger>
														<Select.Content class="overflow-auto max-h-60">
															{#each users as user (user.id)}
																<Select.Item value={user.id}
																	>{user.first_name}
																	{user.last_name}</Select.Item
																>
															{/each}
														</Select.Content>
													</Select.Root>
												{/if}
											{/await}
										{:else if card.name === 'Extra Wind'}
											<div
												class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-4"
											>
												{#each POWER_CARDS as [key, value], idx (idx)}
													{#if key !== 'Extra Wind'}
														<button on:click={() => (selectedCard = key)}>
															<img
																src={value.image_url}
																alt={key}
																title={key}
																class={`
                          hover:-translate-y-2 hover:brightness-100
                          ${
														selectedCard === key ? 'animate-pulse' : 'brightness-50'
													} transition-[filter,transform] duration-300`}
															/>
														</button>
													{/if}
												{/each}
											</div>
										{:else if card.name === "Warlord's Domain"}
											<Select.Root
												preventScroll={false}
												required
												onSelectedChange={(e) => (selectedSkill = `${e?.value}`)}
											>
												<Select.Trigger class="w-60">
													<Select.Value placeholder="Skills" />
												</Select.Trigger>
												<Select.Content class="overflow-auto max-h-60">
													{#each SKILLS as [key, value] (key)}
														<Select.Item value={key}>{value}</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										{/if}
									</div>
								{/if}
							</div>

							<Dialog.Description class="text-center">
								This action cannot be undone. You can only use each power card once.
							</Dialog.Description>

							<Dialog.Footer>
								<form
									class="flex items-center justify-end"
									method="POST"
									action="/?/power_card"
									use:enhance={async ({ formData }) => {
										console.log('Activating power card: ', card.name);

										if (card.name === "Warlord's Domain") {
											selectedCard = undefined;
											selectedUser = undefined;
										} else if (card.name === 'Twist of Fate') {
											selectedSkill = undefined;
											selectedCard = undefined;
										} else if (card.name === 'Extra Wind') {
											selectedSkill = undefined;
											selectedUser = undefined;
										}

										loadingStatus[idx] = 'pending';

										if (selectedUser) {
											formData.append('new_opponent_id', selectedUser);
										}
										if (selectedCard) {
											formData.append('new_power_card', selectedCard);
										}
										if (selectedSkill) {
											formData.append('new_skill', selectedSkill);
											formData.append('match_set_id', matches[0].id);
										}

										return async ({ result }) => {
											if (result.type === 'success') {
												loadingStatus[idx] = 'success';
												console.log('Successfully activated power card.');
												invalidate('user:power_cards');
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
										disabled={card.is_active || card.is_used || hasNoCurrentMatch}
									>
										<div class="flex items-center gap-1">
											{#if loadingStatus[idx] === 'pending'}
												<Reload class="h-5 w-5 animate-spin" />
												<span class="text-base md:text-lg">Activating...</span>
											{:else if loadingStatus[idx] === 'success'}
												<CheckCircled class="h-5 w-5" />
												<span class="text-base md:text-lg">Success</span>
											{:else if loadingStatus[idx] === 'error'}
												<CrossCircled class="h-5 w-5" />
												<span class="text-base md:text-lg">Error, please try again.</span>
											{:else}
												<CardStackPlus class="h-5 w-5" />
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
		{/if}
	</Card.Content>
</Card.Root>
