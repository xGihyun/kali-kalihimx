<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Matchmake } from '$lib/types';

	export let matches: Matchmake[];
</script>

<Table.Root class="border">
	<Table.Header>
		<Table.Row class="text-base md:text-lg">
			<Table.Head>Player 1</Table.Head>
			<Table.Head>Damage</Table.Head>
			<Table.Head class="font-jost-medium">VS</Table.Head>
			<Table.Head>Player 2</Table.Head>
			<Table.Head>Damage</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each matches as match (match.id)}
			{@const user1 = `${match.user1_first_name} ${match.user1_last_name}`}
			{@const user2 = `${match.user2_first_name} ${match.user2_last_name}`}

			<Table.Row class="text-base md:text-lg">
				<Table.Cell>
					{user1}
				</Table.Cell>
				<Table.Cell
					class={`${match.user1_total_damage ? 'text-foreground' : 'text-muted-foreground italic'}`}
					>{match.user1_total_damage}</Table.Cell
				>
				<Table.Cell>
					<span class="text-red-400 font-jost-medium">VS</span>
				</Table.Cell>
				<Table.Cell>{user2}</Table.Cell>
				<Table.Cell
					class={`${match.user2_total_damage ? 'text-foreground' : 'text-muted-foreground italic'}`}
					>{match.user2_total_damage}</Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
