<script lang="ts">
	import { UserTable } from '$lib/components/users-table';

	export let data;
</script>

<h1 class="font-jost-bold text-4xl md:text-6xl mb-10">Leaderboards</h1>

{#await data.users}
	Loading...
{:then users}
	<UserTable {users} sections={data.sections} />
{/await}
