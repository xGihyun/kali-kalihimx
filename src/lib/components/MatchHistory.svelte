<script lang="ts">
	// import { pushState } from '$app/navigation';
	import { getOpponent, snakeCaseToTitleCase } from '$lib';
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
			pushState(href, { selected: { ...result.data, match } });

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
	<Dialog.Content class="max-w-6xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Card Battle</Dialog.Title>
			<!-- <Dialog.Description class="text-base">See how the match went</Dialog.Description> -->
		</Dialog.Header>

		{#if $page.state.selected}
			<CardBattle data={$page.state.selected} />
		{/if}
	</Dialog.Content>
</Dialog.Root>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">Match History</Card.Title>
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
							<Table.Row class="text-base md:text-lg">
								<Table.Head>Opponent</Table.Head>
								<Table.Head>Skill</Table.Head>
								<Table.Head>Footwork</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each matches as match (match.id)}
								<Table.Row class="text-base md:text-lg">
									<Table.Cell class="w-1/2">{getOpponent(userId, match).name}</Table.Cell>
									<Table.Cell class="w-1/4">{snakeCaseToTitleCase(match.arnis_skill)}</Table.Cell>
									<Table.Cell class="w-1/4">{snakeCaseToTitleCase(match.arnis_footwork)}</Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Tabs.Content>

				<Tabs.Content value="card_battle">
					<Table.Root>
						<Table.Header>
							<Table.Row class="text-base md:text-lg">
								<Table.Head>Opponent</Table.Head>
								<Table.Head>DMG Dealt</Table.Head>
								<Table.Head>DMG Taken</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each matches as match (match.id)}
								<a
									class="contents"
									href="/card-battle/{match.id}"
									on:click|preventDefault={(e) => showModal(e, match)}
								>
									<Table.Row class="text-base md:text-lg">
										<Table.Cell class="w-1/2">{getOpponent(userId, match).name}</Table.Cell>
										<Table.Cell class="w-1/4">
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
							{/each}
						</Table.Body>
					</Table.Root>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</Card.Content>
</Card.Root>
