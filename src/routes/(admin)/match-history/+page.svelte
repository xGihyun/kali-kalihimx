<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { goto } from '$app/navigation';

	export let data;

	$: ({ selectedSet, selectedSection } = data);

	function getSectionName(id: string): string | undefined {
		if (!data.sections) return;

		const section = data.sections.find((sec) => sec.id === id);

		return section ? section.name : undefined;
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
						goto(`/match-history?set=${selectedSet}&section=${selectedSection}`);
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
						goto(`/match-history?set=${selectedSet}&section=${selectedSection}`);
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
	</div>

	{#if data.matches}
		<Table.Root>
			<Table.Header>
				<Table.Row class="text-base md:text-lg">
					<Table.Head>Player 1</Table.Head>
					<Table.Head>VS</Table.Head>
					<Table.Head>Player 2</Table.Head>
					<Table.Head>Skill</Table.Head>
					<Table.Head>Footwork</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.matches as match (match.id)}
					{@const user1 = `${match.user1_first_name} ${match.user1_last_name}`}
					{@const user2 = `${match.user2_first_name} ${match.user2_last_name}`}

					<Table.Row class="text-base md:text-lg">
						<Table.Cell>
							{user1}
						</Table.Cell>
						<Table.Cell>
							<span class="text-red-400">VS</span>
						</Table.Cell>
						<Table.Cell>{user2}</Table.Cell>
						<Table.Cell>
							{match.arnis_skill}
						</Table.Cell>
						<Table.Cell>
							{match.arnis_footwork}
						</Table.Cell>
						<Table.Cell>
							{match.status}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<Alert.Root variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>Failed to fetch matches. Please check your connection.</Alert.Description>
		</Alert.Root>
	{/if}
</div>
