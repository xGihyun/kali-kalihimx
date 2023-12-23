<script lang="ts">
	import { Sidebar } from '$lib/components';
	import '../app.postcss';

	export let data;
</script>

<div class="flex h-screen">
	{#if data.user}
		<Sidebar user={data.user} />
	{/if}

	<main class="flex-1">
		<slot />
	</main>
</div>
