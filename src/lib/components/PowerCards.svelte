<script lang="ts">
	import { POWER_CARDS, SKILLS } from '$lib';
	import type { PowerCard, User } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { CardStackPlus } from 'radix-icons-svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { MatchClient } from '$lib/types/matches';
	import { toast } from 'svelte-sonner';

	export let powerCards: PowerCard[];
	export let user: User | undefined;
	export let matches: MatchClient[];

	const currentUser = getContext<User>('user');

	let selectedUser: string | undefined;
	let selectedCard: string | undefined;
	let selectedSkill: string | undefined;

	$: hasNoMatch = matches.length < 1;

	function isCurrentUser(userId: string | undefined): boolean {
		if (!userId) return false;

		return currentUser.id === userId;
	}

	async function getUsersInSection(): Promise<User[] | undefined> {
		if (!isCurrentUser(user?.id)) return;

		const response = await fetch(`/api/users?section=${currentUser.section}`, {
			method: 'GET'
		});

		if (!response.ok) {
			console.error('Failed to fetch users in section: ', await response.text());
			return;
		}

		const users: User[] = await response.json();

		return users.filter(({ id }) => id !== currentUser.id);
	}

	let timerInterval: NodeJS.Timeout;
	let difference = 0;
	let remainingTime = {
		hours: 0,
		minutes: 0,
		seconds: 0
	};

	$: isPowerCardDisabled = (card: PowerCard) => {
		return card.is_used || card.is_active || hasNoMatch || difference > 0;
	};

	onMount(() => {
		timerInterval = setInterval(() => {
			if (matches.length < 1) return;

			const currentTime = new Date().getTime();
			const deadline = new Date(matches[0].card_deadline).getTime();

			// Add UTC+8 offset
			const asiaPacificDate = new Date(deadline - 8 * 60 * 60 * 1000).getTime();

			difference = asiaPacificDate - currentTime;

			remainingTime.hours = Math.floor(difference / (1000 * 60 * 60));
			remainingTime.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
			remainingTime.seconds = Math.floor((difference % (1000 * 60)) / 1000);

			if (difference <= 0) {
				console.log('STOP');
				clearInterval(timerInterval);
				invalidate('card_battle:timer');
			}
		}, 1000);
	});

	onDestroy(() => clearInterval(timerInterval));
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-2xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2 items-center"
		>
			Power Cards

			<!--NOTE: Put the timer at the bottom of the card instead-->
			{#if difference > 0}
				<div class="bg-card px-4 py-2 border border-border rounded-full">
					<p class="text-base font-jost-medium">
						{remainingTime.hours.toString().padStart(2, '0')}
						<span class="text-primary">:</span>
						{remainingTime.minutes.toString().padStart(2, '0')}
						<span class="text-primary">:</span>
						{remainingTime.seconds.toString().padStart(2, '0')}
					</p>
				</div>
			{:else}
				<div class="flex gap-8 items-center mb-2 text-base flex-wrap h-full">
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
			{/if}
		</Card.Title>
	</Card.Header>

	{#if hasNoMatch && isCurrentUser(user?.id)}
		<p class="text-muted-foreground italic col-span-2 px-6 pb-6">
			Please wait for the admin to queue a new match.
		</p>
	{:else if difference > 0}
		<p class="text-muted-foreground italic col-span-2 px-6 pb-6">
			You can only use Power Cards after the

			<a href="/card-battle" class="font-jost-medium text-primary/75 underline">Card Battle</a>
			is over.
		</p>
	{/if}

	<Card.Content class="grid grid-cols-[repeat(auto-fit,minmax(148px,1fr))] gap-4">
		{#if user?.is_private && !isCurrentUser(user?.id)}
			<p class="text-muted-foreground italic">Power cards are hidden...</p>
		{:else}
			{#each powerCards as card, idx (idx)}
				{@const powerCardDetails = POWER_CARDS.get(card.name)}

				{#if isCurrentUser(user?.id)}
					<Dialog.Root closeOnOutsideClick={false}>
						<Dialog.Trigger disabled={isPowerCardDisabled(card)}>
							<img
								src={powerCardDetails?.image_url}
								alt={card.name}
								class={`w-full ${
									isPowerCardDisabled(card)
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
									use:enhance={({ formData }) => {
										console.log('Activating power card: ', card.name);

										card.is_active = true;

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

										toast.info('Activating power card...');

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

										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Successfully activated power card.');
												console.log('Successfully activated power card.');
												await update();
											} else {
												toast.error('Failed to activate power card.');
												console.error('Failed to activate power card.');
											}
										};
									}}
								>
									<input type="text" name="card_id" value={card.id} hidden />

									<Button
										type="submit"
										class="text-base md:text-lg bg-primary"
										disabled={isPowerCardDisabled(card)}
									>
										<div class="flex items-center gap-1">
											<CardStackPlus class="h-5 w-5" />
											<span class="text-base md:text-lg">Activate</span>
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
