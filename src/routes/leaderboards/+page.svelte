<script lang="ts">
	import { UserTable } from '$lib/components/users-table';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let data;
</script>

<h1 class="font-jost-bold text-4xl md:text-6xl mb-10">Leaderboards</h1>

{#await data.users}
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
{:then users}
	<UserTable
		{users}
		sections={data.sections}
		total={data.total}
		skip={data.skip}
		sectionsQuery={data.filteredSections}
	/>
{/await}
