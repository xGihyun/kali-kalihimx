<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { invalidate } from '$app/navigation';
	import { MATCH_TYPES, snakeCaseToTitleCase } from '$lib';
	import ArnisTable from './arnis-table.svelte';
	import CardBattleTable from './card-battle-table.svelte';

	export let data;
	export let form;

	$: ({ selectedSet, selectedSection, selectedMatchType } = data);

	async function runCardBattle() {
		console.log('Set ', selectedSet);
		console.log('Section ', selectedSection);
		console.log('Running card battle...');

		const response = await fetch(`/api/card_battle?set=${selectedSet}&section=${selectedSection}`, {
			method: 'GET'
		});

		if (response.ok) {
			console.log('Success card battle');
			invalidate('card-battle:damage');
		} else {
			console.error('Failed to run card battle.');
		}
	}
</script>

<h1 class="font-jost-bold text-6xl mb-10">Match History</h1>

<div class="w-full mx-auto">
	<div class="flex gap-2 mb-5">
		{#if data.sections}
			<Select.Root
				selected={{
					value: selectedSection,
					label: snakeCaseToTitleCase(selectedSection)
				}}
			>
				<Select.Trigger class="w-80">
					<Select.Value placeholder="Section" class="text-base md:text-lg" />
				</Select.Trigger>
				<Select.Content>
					{#each data.sections as section (section.id)}
						<a
							class="contents"
							href={`/match-history?set=${selectedSet}&section=${section.id}&match_type=${selectedMatchType}`}
						>
							<Select.Item value={section.id} class="text-base md:text-lg">
								{section.name}
							</Select.Item>
						</a>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description
					>Failed to fetch sections. Please check your connection.</Alert.Description
				>
			</Alert.Root>
		{/if}

		{#if data.maxSets}
			<Select.Root selected={{ value: selectedSet, label: `Match ${selectedSet}` }}>
				<Select.Trigger class="w-60">
					<Select.Value placeholder="Match Set" class="text-base md:text-lg" />
				</Select.Trigger>
				<Select.Content>
					{#each data.maxSets as maxSet (maxSet.section)}
						{#if maxSet.section === selectedSection}
							{#each Array(maxSet.max_set) as _, idx (idx)}
								<a
									class="contents"
									href={`/match-history?set=${
										idx + 1
									}&section=${selectedSection}&match_type=${selectedMatchType}`}
								>
									<Select.Item value={idx + 1} class="text-base md:text-lg">
										{idx + 1}
									</Select.Item>
								</a>
							{/each}
						{/if}
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description
					>Failed to fetch match sets. Please check your connection.</Alert.Description
				>
			</Alert.Root>
		{/if}

		<Select.Root selected={{ value: selectedMatchType, label: MATCH_TYPES.get(selectedMatchType) }}>
			<Select.Trigger class="w-60">
				<Select.Value placeholder="Match Set" class="text-base md:text-lg" />
			</Select.Trigger>
			<Select.Content>
				{#each MATCH_TYPES as [key, value] (key)}
					<a
						class="contents"
						href={`/match-history?set=${selectedSet}&section=${selectedSection}&match_type=${key}`}
					>
						<Select.Item value={key} class="text-base md:text-lg">
							{value}
						</Select.Item>
					</a>
				{/each}
			</Select.Content>
		</Select.Root>

		{#if selectedMatchType === 'card_battle'}
			<Button class="text-base md:text-lg" on:click={runCardBattle}>Run Card Battle</Button>
		{/if}
	</div>

	{#if data.matches}
		{#if selectedMatchType === 'arnis'}
			<ArnisTable form={data.form} matches={data.matches} formAction={form?.success} />
		{:else if selectedMatchType === 'card_battle'}
			<CardBattleTable matches={data.matches} />
		{:else}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Not Found</Alert.Title>
				<Alert.Description>Unknown match type.</Alert.Description>
			</Alert.Root>
		{/if}
	{:else}
		<Alert.Root variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description
				>Failed to fetch matches. Please check your connection or try again later.</Alert.Description
			>
		</Alert.Root>
	{/if}
</div>
