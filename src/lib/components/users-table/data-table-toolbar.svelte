<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { UserTableFilter, UserTableForm } from '.';
	import { Button } from '$lib/components/ui/button';
	import type { Writable } from 'svelte/store';
	import type { Section, User } from '$lib/types';
	// @ts-expect-error: No types for this library (?)
	import type { AnyPlugins } from 'svelte-headless-table/lib/types/TablePlugin';
	// @ts-expect-error: No types for this library (?)
	import type { TableViewModel } from 'svelte-headless-table/lib/createViewModel';
	import { selectedSections } from '$lib/stores';
	import { ArrowDownWideNarrow, FilterX } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteUsersSchema } from '$lib/schemas';

	export let sections: Section[] = [];
	export let tableModel: TableViewModel<User, AnyPlugins>;
	export let form: SuperValidated<typeof DeleteUsersSchema>;
	export let selectedDataIds: any;
	export let users: User[];
	export let currentUser: User | undefined;

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

	filterValues.set({ section: $selectedSections.split(',') });
	$: showReset = Object.values($filterValues).some((v) => v.length > 0);
	$: isFiltered = window.location.search.includes('section');
</script>

<div class="flex items-start sm:items-center justify-between gap-5 flex-col sm:flex-row">
	<div class="flex flex-1 items-center gap-2">
		<Input
			placeholder="Filter users..."
			class="w-40 lg:w-60 text-sm sm:text-base md:text-lg px-3 py-2 h-auto"
			type="text"
			bind:value={$filterValue}
		/>

		<UserTableFilter bind:filterValues={$filterValues.section} title="Section" options={sections} />

		{#if showReset}
			<Button
				on:click={() => {
					$filterValues.section = [];
					$selectedSections = '';
				}}
				variant="ghost"
				class="h-auto px-3"
			>
				Reset
			</Button>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		{#if currentUser?.role === 'admin'}
			<UserTableForm {form} {selectedDataIds} {users} />
		{/if}

		<Button class="h-auto p-0" disabled={!$selectedSections && !isFiltered}>
			{#if isFiltered && !$selectedSections}
				<a href={`/leaderboards`} class="flex items-center gap-1 px-3 py-2">
					<FilterX class="h-5 w-5" />
					<span class="text-sm sm:text-base md:text-lg"> Remove Filter </span>
				</a>
			{:else}
				<a
					href={`/leaderboards?sections=${$selectedSections}`}
					class="flex items-center gap-1 px-3 py-2"
				>
					<ArrowDownWideNarrow class="h-5 w-5" />
					<span class="text-sm sm:text-base md:text-lg"> Filter </span>
				</a>
			{/if}
		</Button>
	</div>
</div>
