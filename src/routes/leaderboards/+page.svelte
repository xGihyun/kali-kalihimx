<script lang="ts">
	import { UserTable } from '$lib/components/users-table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { selectedSections } from '$lib/stores.js';
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let data;

	selectedSections.set(data.filteredSections || '');
</script>

<h1 class="font-jost-bold text-4xl md:text-6xl mb-10">Leaderboards</h1>

{#await data.lazy.foo}
	<div class="grid grid-cols-5 gap-2">
		<Skeleton class="h-10 col-span-2" />
		<Skeleton class="h-10 col-span-2" />
		<Skeleton class="h-10 col-span-1" />
		{#each Array(10) as _}
			<Skeleton class="h-8 col-span-2" />
			<Skeleton class="h-8 col-span-2" />
			<Skeleton class="h-8 col-span-1" />
		{/each}
	</div>
{:then [users, sections, userCount]}
	<UserTable
		form={data.form}
		{users}
		{sections}
		total={userCount}
		skip={data.skip}
		filteredSections={data.filteredSections}
		currentUser={data.user}
	/>
{:catch err}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>
			<p>Failed to fetch sections.</p>
			<p>{err}</p>
		</Alert.Description>
	</Alert.Root>
{/await}
