<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { UserTableFilter } from '.';
	import { Button } from '$lib/components/ui/button';
	import type { Writable } from 'svelte/store';
	import type { Section, User } from '$lib/types';
	// Idk why there are TypeScript errors
	// @ts-ignore
	import type { AnyPlugins } from 'svelte-headless-table/lib/types/TablePlugin';
	// @ts-ignore
	import type { TableViewModel } from 'svelte-headless-table/lib/createViewModel';

	export let sections: Section[] = [];
	export let tableModel: TableViewModel<User, AnyPlugins>;
	export let sectionsQuery: string | null;

	const { pluginStates } = tableModel;
	const {
		filterValue
	}: {
		filterValue: Writable<string>;
	} = pluginStates.filter;

	const {
		filterValues
	}: {
		filterValues: Writable<{
			section: string[];
		}>;
	} = pluginStates.colFilter;

	$: showReset = Object.values($filterValues).some((v) => v.length > 0);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			placeholder="Filter users..."
			class="w-40 lg:w-60 text-base md:text-lg px-3 py-2"
			type="text"
			bind:value={$filterValue}
		/>

		<UserTableFilter
			bind:filterValues={$filterValues.section}
			title="Section"
			options={sections}
			{sectionsQuery}
		/>

		{#if showReset}
			<Button
				on:click={() => {
					$filterValues.section = [];
				}}
				variant="ghost"
				class="h-8 px-2 lg:px-3"
			>
				Reset
			</Button>
		{/if}
	</div>
</div>
