<script lang="ts">
	import { getRankTitle } from '$lib';
	import type { User } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	export let user: User;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">{getRankTitle(user.score)}</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex flex-col">
			<h4 class="text-muted-foreground text-base md:text-lg">Score</h4>
			<span class="text-3xl font-jost-medium">{user.score}</span>
		</div>

		<div class="flex flex-col">
			<h4 class="text-muted-foreground text-base md:text-lg">Overall</h4>
			<span class="text-3xl font-jost-medium">#{user.rank_overall}</span>
		</div>

		<div class="flex flex-col">
			<h4 class="text-muted-foreground text-base md:text-lg">Section</h4>
			<span class="text-3xl font-jost-medium">#{user.rank_section}</span>
		</div>
	</Card.Content>
</Card.Root>
