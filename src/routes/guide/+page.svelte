<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import ArnisGuide from './arnis-guide.svelte';
	import PowerCardsGuide from './power-cards-guide.svelte';
	import CardBattleGuide from './card-battle-guide.svelte';
</script>

<h1 class="text-4xl md:text-6xl font-jost-bold mb-5">Guide</h1>

<Tabs.Root value="arnis">
	<Tabs.List class="h-auto w-full mb-10">
		<Tabs.Trigger value="arnis" class="text-base md:text-lg h-auto w-full">Arnis</Tabs.Trigger>
		<Tabs.Trigger value="power_cards" class="text-base md:text-lg h-auto w-full"
			>Power Cards</Tabs.Trigger
		>
		<Tabs.Trigger value="card_battle" class="text-base md:text-lg h-auto w-full"
			>Card Battle</Tabs.Trigger
		>
	</Tabs.List>
	<Tabs.Content value="arnis">
		<ArnisGuide />
	</Tabs.Content>
	<Tabs.Content value="power_cards">
		<PowerCardsGuide />
	</Tabs.Content>
	<Tabs.Content value="card_battle">
		<CardBattleGuide />
	</Tabs.Content>
</Tabs.Root>
