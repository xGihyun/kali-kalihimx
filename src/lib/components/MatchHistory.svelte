<script lang="ts">
	// import { pushState } from '$app/navigation';
	import {
		getOpponent,
		getUserCardBattleVerdict,
		getUserVerdict,
		snakeCaseToTitleCase
	} from '$lib';
	import type { Matchmake } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { goto, preloadData, pushState } from '$app/navigation';
	import CardBattle from '../../routes/card-battle/[match_set_id]/+page.svelte';
	import { page } from '$app/stores';

	export let matches: Matchmake[];
	export let userId: string;

	let isOpen = false;

	async function showModal(e: MouseEvent, match: Matchmake) {
		const { href } = e.currentTarget as HTMLAnchorElement;

		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { selected: { turns: result.data.turns, user: result.data.user, match } });

			isOpen = true;
		} else {
			goto(href);
		}
	}
</script>

<Dialog.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		history.back();
	}}
	closeOnOutsideClick={false}
>
	<Dialog.Content class="max-w-6xl z-[250] overflow-y-auto max-h-[90svh]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Card Battle</Dialog.Title>
			<!-- <Dialog.Description class="text-sm sm:text-base">See how the match went</Dialog.Description> -->
		</Dialog.Header>

		{#if $page.state.selected}
			<CardBattle data={$page.state.selected} />
		{/if}
	</Dialog.Content>
</Dialog.Root>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl md:text-4xl font-normal font-jost-bold">Match History</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if matches.length < 1}
			<p class="text-muted-foreground italic">
				History is empty. You will see your previous matches here.
			</p>
		{:else}
			<Tabs.Root value="arnis">
				<Tabs.List>
					<Tabs.Trigger value="arnis">Arnis</Tabs.Trigger>
					<Tabs.Trigger value="card_battle">Card Battle</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="arnis">
					<Table.Root>
						<Table.Header>
							<Table.Row class="text-sm sm:text-base md:text-lg">
								<Table.Head>Opponent</Table.Head>
								<Table.Head>Skill</Table.Head>
								<Table.Head>Footwork</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each matches as match (match.id)}
								{#if match.status === 'done'}
									<Table.Row class="text-sm sm:text-base md:text-lg">
										<Table.Cell
											class={`w-1/3 bg-gradient-to-r  to-50% border-l-8 ${
												getUserVerdict(userId, match) === 'win'
													? 'border-l-green-500 from-green-900'
													: getUserVerdict(userId, match) === 'lose'
														? 'border-l-red-600 from-red-950'
														: getUserVerdict(userId, match) === 'draw'
															? 'border-l-yellow-500 from-yellow-900'
															: 'border-l-neutral-500 from-neutral-900'
											}`}>{getOpponent(userId, match).name}</Table.Cell
										>
										<Table.Cell class="w-1/4">{snakeCaseToTitleCase(match.arnis_skill)}</Table.Cell>
										<Table.Cell class="w-1/4"
											>{snakeCaseToTitleCase(match.arnis_footwork)}</Table.Cell
										>
									</Table.Row>
								{/if}
							{/each}
						</Table.Body>
					</Table.Root>
				</Tabs.Content>

				<Tabs.Content value="card_battle">
					<Table.Root>
						<Table.Header>
							<Table.Row class="text-sm sm:text-base md:text-lg">
								<Table.Head>Opponent</Table.Head>
								<Table.Head>DMG Dealt</Table.Head>
								<Table.Head>DMG Taken</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each matches as match, idx (match.id)}
								{#if idx < matches.length - 1}
									<a
										class="contents"
										href={`/card-battle/${match.id}`}
										on:click|preventDefault={(e) => showModal(e, match)}
									>
										<Table.Row class="text-sm sm:text-base md:text-lg">
											<Table.Cell
												class={`w-1/3 bg-gradient-to-r to-50% border-l-8 ${
													getUserCardBattleVerdict(userId, match) === 'win'
														? 'border-l-green-500 from-green-900'
														: getUserCardBattleVerdict(userId, match) === 'lose'
															? 'border-l-red-600 from-red-950'
															: getUserCardBattleVerdict(userId, match) === 'draw'
																? 'border-l-yellow-500 from-yellow-900'
																: 'border-l-neutral-500 from-neutral-900'
												}`}>{getOpponent(userId, match).name}</Table.Cell
											>
											<Table.Cell
												class={`w-1/4 ${
													match.user1_total_damage
														? 'text-foreground'
														: 'text-muted-foreground italic'
												}`}
											>
												{#if match.og_user1_id === userId}
													{match.user1_total_damage}
												{:else}
													{match.user2_total_damage}
												{/if}
											</Table.Cell>
											<Table.Cell
												class={`w-1/4 ${
													match.user1_total_damage
														? 'text-foreground'
														: 'text-muted-foreground italic'
												}`}
											>
												{#if match.og_user1_id === userId}
													{match.user2_total_damage}
												{:else}
													{match.user1_total_damage}
												{/if}
											</Table.Cell>
										</Table.Row>
									</a>
								{/if}
							{/each}
						</Table.Body>
					</Table.Root>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</Card.Content>
</Card.Root>
