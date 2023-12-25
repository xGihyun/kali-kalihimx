<script lang="ts">
	import type { BattleCard } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	export let card: BattleCard;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Card Title</Card.Title>
		<Card.Description>Strike</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>Damage, Acc, Effect</p>
	</Card.Content>
	<Card.Footer>
		<p>Select</p>
	</Card.Footer>
</Card.Root>
