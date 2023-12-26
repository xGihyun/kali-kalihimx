<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Matchmake } from '$lib/types';
	import ScoresForm from './scores-form.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubmitScoreSchema } from '$lib/schemas';

	export let formAction: boolean = false;
	export let form: SuperValidated<typeof SubmitScoreSchema>;
	export let matches: Matchmake[];

	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}
</script>

<Table.Root class="border ">
	<Table.Header>
		<Table.Row class="text-base md:text-lg">
			<Table.Head>Player 1</Table.Head>
			<Table.Head>VS</Table.Head>
			<Table.Head>Player 2</Table.Head>
			<Table.Head>Skill</Table.Head>
			<Table.Head>Footwork</Table.Head>
			<Table.Head>Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each matches as match, idx (match.id)}
			{@const user1 = `${match.user1_first_name} ${match.user1_last_name}`}
			{@const user2 = `${match.user2_first_name} ${match.user2_last_name}`}

			<Table.Row class="text-base md:text-lg cursor-pointer" on:click={() => toggleRow(idx)}>
				<Table.Cell>
					{user1}
				</Table.Cell>
				<Table.Cell>
					<span class="text-red-400">VS</span>
				</Table.Cell>
				<Table.Cell>{user2}</Table.Cell>
				<Table.Cell>
					{match.arnis_skill}
				</Table.Cell>
				<Table.Cell>
					{match.arnis_footwork}
				</Table.Cell>
				<Table.Cell>
					{match.status}
				</Table.Cell>
			</Table.Row>

			<Dialog.Root open={clickedRow === idx}>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Score Submission</Dialog.Title>
						<Dialog.Description>Enter your scores for each player.</Dialog.Description>
					</Dialog.Header>

					<ScoresForm
						{form}
						{formAction}
						user1_id={match.user1_id}
						user2_id={match.user2_id}
						user1_name={user1}
						user2_name={user2}
					/>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</Table.Body>
</Table.Root>
