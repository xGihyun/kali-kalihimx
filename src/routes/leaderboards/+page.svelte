<script lang="ts">
	import { UserTable } from '$lib/components/users-table';

	export let data;
</script>

<h1 class="font-jost-bold text-6xl mb-10">Leaderboards</h1>

<UserTable users={data.users} sections={data.sections} />
