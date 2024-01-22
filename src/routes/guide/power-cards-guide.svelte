<script lang="ts">
	import { POWER_CARDS } from '$lib';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="mb-5">
	<h2 class="font-jost-semibold text-4xl mb-1">Power Cards</h2>

	<p class="italic text-muted-foreground text-base md:text-lg">
		Power Cards can only be used for the upcoming Arnis match.
	</p>
</div>

<div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
	{#each POWER_CARDS as [key, value], idx (idx)}
		<Card.Root class="h-full">
			<Card.Header>
				<img src={value.image_url} alt={key} />
			</Card.Header>

			<Card.Content>
				<Card.Title class="font-normal font-jost-semibold text-base md:text-xl">{key}</Card.Title>
				<Card.Description class="mt-2">{value.description}</Card.Description>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
