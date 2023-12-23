<script lang="ts">
	import { UserTable } from '$lib/components/users-table';

	export let data;
</script>

<h1 class="font-jost-bold text-6xl">Leaderboards</h1>

<div class="w-full max-w-5xl">
	<UserTable users={data.users} sections={data.sections} />
</div>
