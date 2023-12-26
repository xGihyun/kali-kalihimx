<script lang="ts">
	import { Sidebar } from '$lib/components';
	import '../app.postcss';

	export let data;
</script>

<div class="flex min-h-[100svh]">
	{#if data.user}
		<Sidebar user={data.user} />
	{/if}

	<main class="flex-1 ml-0 lg:ml-72 px-[5%] py-10">
		<slot />
	</main>
</div>
