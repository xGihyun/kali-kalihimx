<script lang="ts">
	import { ARNIS_STRIKES_VIDEOS, ARNIS_FOOTWORKS_VIDEOS, POWER_CARDS } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import { Video } from 'radix-icons-svelte';
</script>

<h1 class="text-6xl font-jost-bold mb-10">Guide</h1>

<h2 class="font-jost-semibold text-4xl mb-5">Strikes</h2>

<div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-10">
	{#each ARNIS_STRIKES_VIDEOS as video, idx (idx)}
		<a href={video.url} target="_blank" rel="noreferrer">
			<Card.Root class="h-full">
				<Card.Header>
					<Card.Title class="font-normal font-jost-semibold text-xl">{video.title}</Card.Title>
					<!-- <Card.Description>Card Description</Card.Description> -->
				</Card.Header>
				<Card.Content>
					<!-- <Video class="w-10 h-10 lg:w-20 lg:h-20" /> -->
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</div>

<h2 class="font-jost-semibold text-4xl mb-5">Footwork</h2>

<div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-10">
	{#each ARNIS_FOOTWORKS_VIDEOS as video, idx (idx)}
		<a href={video.url} target="_blank" rel="noreferrer">
			<Card.Root class="h-full">
				<Card.Header>
					<Card.Title class="font-normal font-jost-semibold text-xl">{video.title}</Card.Title>
					<!-- <Card.Description>Card Description</Card.Description> -->
				</Card.Header>
				<Card.Content>
					<!-- <Video class="w-10 h-10 lg:w-20 lg:h-20" /> -->
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</div>

<h2 class="font-jost-semibold text-4xl mb-5">Power Cards</h2>

<div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
	{#each POWER_CARDS as [key, value], idx (idx)}
		<Card.Root class="h-full">
			<Card.Header>
				<img src={value.image_url} alt={key} />
			</Card.Header>

			<Card.Content>
				<Card.Title class="font-normal font-jost-semibold text-xl">{key}</Card.Title>
				<Card.Description class="mt-2">{value.description}</Card.Description>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
