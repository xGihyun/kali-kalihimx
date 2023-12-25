<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { goto, invalidate } from '$app/navigation';
	import { MATCH_TYPES } from '$lib';
	import ArnisTable from './arnis-table.svelte';
	import CardBattleTable from './card-battle-table.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ selectedSet, selectedSection, selectedMatchType } = data);

	function getSectionName(id: string): string | undefined {
		if (!data.sections) return;

		const section = data.sections.find((sec) => sec.id === id);

		return section ? section.name : undefined;
	}

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
		}
	}
</script>

<div class="w-full max-w-5xl">
	<div class="flex gap-2">
		{#if data.sections}
			<Select.Root
				selected={{ value: selectedSection, label: getSectionName(`${selectedSection}`) }}
				onSelectedChange={(e) => {
					if (e) {
						selectedSection = `${e.value}`;
						goto(
							`/match-history?set=${selectedSet}&section=${selectedSection}&match_type=${selectedMatchType}`
						);
					}
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Section" class="text-base md:text-lg" />
				</Select.Trigger>
				<Select.Content>
					{#each data.sections as section (section.id)}
						<Select.Item value={section.id} class="text-base md:text-lg">
							{section.name}
						</Select.Item>
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
			<Select.Root
				selected={{ value: selectedSet, label: `Match ${selectedSet}` }}
				onSelectedChange={(e) => {
					if (e) {
						selectedSet = Number(e.value) || 1;
						goto(
							`/match-history?set=${selectedSet}&section=${selectedSection}&match_type=${selectedMatchType}`
						);
					}
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Match Set" class="text-base md:text-lg" />
				</Select.Trigger>
				<Select.Content>
					{#each data.maxSets as maxSet (maxSet.section)}
						{#if maxSet.section === selectedSection}
							{#each Array(maxSet.max_set) as _, idx (idx)}
								<Select.Item value={idx + 1} class="text-base md:text-lg">
									{idx + 1}
								</Select.Item>
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

		<Select.Root
			selected={{ value: selectedMatchType, label: MATCH_TYPES.get(selectedMatchType) }}
			onSelectedChange={(e) => {
				if (e) {
					selectedMatchType = `${e.value}`;
					goto(
						`/match-history?set=${selectedSet}&section=${selectedSection}&match_type=${selectedMatchType}`
					);
				}
			}}
		>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Match Set" class="text-base md:text-lg" />
			</Select.Trigger>
			<Select.Content>
				{#each MATCH_TYPES as [key, value] (key)}
					<Select.Item value={key} class="text-base md:text-lg">
						{value}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		{#if selectedMatchType === 'card_battle'}
			<Button class="text-base md:text-lg" on:click={runCardBattle}>Run Card Battle</Button>
		{/if}
	</div>

	{#if data.matches}
		{#if selectedMatchType === 'arnis'}
			<ArnisTable matches={data.matches} />
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
			<Alert.Description>Failed to fetch matches. Please check your connection.</Alert.Description>
		</Alert.Root>
	{/if}
</div>
