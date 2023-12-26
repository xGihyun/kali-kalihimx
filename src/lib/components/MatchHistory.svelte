<script lang="ts">
	// import { pushState } from '$app/navigation';
	import { getOpponent } from '$lib';
	import type { Matchmake } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	export let matches: Matchmake[];
	export let userId: string;

	// pushState('hi', {uwu: 'nya'})
</script>

<!-- Use shadcn tabs to switch between Arnis and Card Battle matches -->
<!-- The match history itself will be displayed with a table -->

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">Match History</Card.Title>
	</Card.Header>
	<Card.Content>
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
								<Table.Cell class="w-1/4">{match.arnis_skill}</Table.Cell>
								<Table.Cell class="w-1/4">{match.arnis_footwork}</Table.Cell>
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
							<Table.Head>Damage Given</Table.Head>
							<Table.Head>Damage Received</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each matches as match (match.id)}
							<Table.Row class="text-base md:text-lg">
								<Table.Cell class="w-1/2">{getOpponent(userId, match).name}</Table.Cell>
								<Table.Cell class="w-1/4">
									{#if match.og_user1_id === userId}
										{match.user1_total_damage}
									{:else}
										{match.user2_total_damage}
									{/if}
								</Table.Cell>
								<Table.Cell class="w-1/4">
									{#if match.og_user1_id === userId}
										{match.user2_total_damage}
									{:else}
										{match.user1_total_damage}
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>

<!-- <Dialog.Root> -->
<!-- 	<Dialog.Content> -->
<!-- 		<Dialog.Header> -->
<!-- 			<Dialog.Title>Score Submission</Dialog.Title> -->
<!-- 			<Dialog.Description>Enter your scores for each player.</Dialog.Description> -->
<!-- 		</Dialog.Header> -->
<!-- 	</Dialog.Content> -->
<!-- </Dialog.Root> -->
