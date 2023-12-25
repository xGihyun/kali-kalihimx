<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { Matchmake } from '$lib/types';
	import { enhance } from '$app/forms';

	export let matches: Matchmake[];

	let dialogOpen = false;
	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}
</script>

<Table.Root>
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
					<!-- Use shadcn form instead -->
					<form
						method="post"
						action="/match-history?/submit_score"
						use:enhance={({ formData }) => {
							formData.set('user1', match.user1_id);
							formData.set('user2', match.user2_id);
						}}
					>
						<div>{user1}</div>
						<Input
							type="text"
							placeholder="Enter score..."
							class="text-base md:text-lg h-auto"
							name="user1_score"
							required
						/>

						<div>{user2}</div>
						<Input
							type="text"
							placeholder="Enter score..."
							class="text-base md:text-lg h-auto"
							name="user2_score"
							required
						/>
						<Dialog.Footer>
							<Button type="submit">Submit</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</Table.Body>
</Table.Root>
