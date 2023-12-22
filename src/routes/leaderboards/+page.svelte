<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let data;
</script>

<h1 class="font-jost-bold text-6xl">Leaderboards</h1>

<div class="w-full max-w-5xl">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-1/2">Name</Table.Head>
				<Table.Head>Section</Table.Head>
				<Table.Head>Rating</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as user, idx (user.id)}
				<Table.Row>
					<Table.Cell>
						<span class="font-jost-medium text-rose-400">
							{idx + 1}
						</span>
						<span>{user.first_name} {user.last_name}</span>
					</Table.Cell>
					<Table.Cell>{user.section}</Table.Cell>
					<Table.Cell>{user.score}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<!-- <div class="w-full max-w-5xl"> -->
<!-- 	{#each data.users as user, idx (user.id)} -->
<!-- 		<div>Rank: {idx + 1} | Name: {user.first_name}</div> -->
<!-- 	{/each} -->
<!-- </div> -->
