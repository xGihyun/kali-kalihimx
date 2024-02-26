<script lang="ts">
	import type { MatchClient } from '$lib/types/matches';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { getOpponent } from '$lib/helpers';
	import { getContext } from 'svelte';
	import { type User } from '$lib/types';

	export let match: MatchClient;

	const user = getContext<User>('user');
	const opponent = getOpponent(user.id, match);
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="text-sm sm:text-base md:text-lg">
			<Table.Head></Table.Head>
			<Table.Head class="text-primary/80 font-jost-semibold"
				>{user.first_name} {user.last_name} (You)</Table.Head
			>
			<Table.Head>{opponent.first_name} {opponent.last_name}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row class="text-sm sm:text-base md:text-lg">
			<Table.Cell class="text-sm sm:text-base md:text-lg font-jost-medium"
				>Received Score</Table.Cell
			>
			{#each match.users as user (user.id)}
				<Table.Cell class="text-sm sm:text-base md:text-lg">{user.score}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row class="text-sm sm:text-base md:text-lg">
			<Table.Cell class="text-sm sm:text-base md:text-lg font-jost-medium"
				>Double-edged Sword</Table.Cell
			>
			{#each match.users as user (user.id)}
				<Table.Cell class="text-sm sm:text-base md:text-lg">{user.des_count}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row class="text-sm sm:text-base md:text-lg">
			<Table.Cell class="text-sm sm:text-base md:text-lg font-jost-medium"
				>Ancient's Protection</Table.Cell
			>
			{#each match.users as user (user.id)}
				<Table.Cell class="text-sm sm:text-base md:text-lg">{user.ap_count}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row class="text-sm sm:text-base md:text-lg">
			<Table.Cell class="text-sm sm:text-base md:text-lg font-jost-medium">Final Score</Table.Cell>
			{#each match.users as user (user.id)}
				<Table.Cell class="text-sm sm:text-base md:text-lg">{user.score}</Table.Cell>
			{/each}
		</Table.Row>
	</Table.Body>
</Table.Root>

<Separator></Separator>

<div>
	<h4 class="text-sm sm:text-base md:text-lg font-semibold">Comment</h4>

	{#if match.comment}
		<p>{match.comment}</p>
	{:else}
		<p class="italic text-muted-foreground">Nothing to see here</p>
	{/if}
</div>
