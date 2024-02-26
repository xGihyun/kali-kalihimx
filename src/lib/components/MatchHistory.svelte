<script lang="ts">
	import { getUserCardBattleVerdict, getUserVerdict, snakeCaseToTitleCase } from '$lib';
	import { getOpponent } from '$lib/helpers';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { MatchClient } from '$lib/types/matches';
	import type { User } from '$lib/types';
	import { getContext } from 'svelte';
	import { ArnisResults } from '.';

	export let matches: MatchClient[];
	export let user: User | undefined;

	const currentUser = getContext<User>('user');

	type MatchType = 'arnis' | 'card_battle';
	type MatchSelected = {
		match: MatchClient;
		type: MatchType;
	};

	let selectedMatch: MatchSelected | undefined;

	let isOpen = false;

	function selectMatch(match: MatchClient, type: 'arnis' | 'card_battle'): void {
		selectedMatch = {
			match,
			type
		};

		isOpen = true;
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={(open) => (isOpen = open)}>
	<Dialog.Content class="max-w-6xl z-[250] overflow-y-auto max-h-[90svh]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl"
				>{selectedMatch?.type === 'arnis' ? 'Arnis' : 'Card Battle'}</Dialog.Title
			>
			<!-- <Dialog.Description class="text-sm sm:text-base">See how the match went</Dialog.Description> -->
		</Dialog.Header>

		{#if selectedMatch?.type === 'arnis'}
			<ArnisResults match={selectedMatch.match} />
		{/if}
	</Dialog.Content>
</Dialog.Root>

<Card.Root>
	<Card.Header>
		<Card.Title
			class="text-2xl md:text-4xl font-normal font-jost-bold flex justify-between flex-wrap gap-2"
		>
			Match History

			<div class="flex gap-8 items-center mb-2 text-base flex-wrap">
				<div class="flex items-center gap-2">
					<div class="bg-green-500 w-4 h-4 rounded-full"></div>
					<span class="font-jost-medium">Win</span>
				</div>

				<div class="flex items-center gap-2">
					<div class="bg-yellow-500 w-4 h-4 rounded-full"></div>
					<span class="font-jost-medium">Draw</span>
				</div>

				<div class="flex items-center gap-2">
					<div class="bg-red-600 w-4 h-4 rounded-full"></div>
					<span class="font-jost-medium">Loss</span>
				</div>

				<!-- <div class="flex items-center gap-2"> -->
				<!-- 	<div class="bg-muted-foreground w-4 h-4 rounded-full"></div> -->
				<!-- 	<span class="font-jost-medium">Pending</span> -->
				<!-- </div> -->
			</div>
		</Card.Title>
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
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each matches as match (match.id)}
								{@const opponent = getOpponent(currentUser.id, match)}
								<Table.Row
									class="w-full text-sm sm:text-base md:text-lg hover:cursor-pointer"
									on:click={() => selectMatch(match, 'arnis')}
								>
									<Table.Cell
										class={` bg-gradient-to-r  to-50% border-l-8 ${
											getUserVerdict(currentUser.id, match.users) === 'win'
												? 'border-l-green-500 from-green-900'
												: getUserVerdict(currentUser.id, match.users) === 'lose'
													? 'border-l-red-600 from-red-950'
													: getUserVerdict(currentUser.id, match.users) === 'draw'
														? 'border-l-yellow-500 from-yellow-900'
														: 'border-l-muted-foreground from-muted'
										}`}>{opponent.first_name} {opponent.last_name}</Table.Cell
									>
									<Table.Cell>{snakeCaseToTitleCase(match.arnis_skill)}</Table.Cell>
								</Table.Row>
								<!-- </button> -->
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
						<Table.Body></Table.Body>
					</Table.Root>
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	</Card.Content>
</Card.Root>
