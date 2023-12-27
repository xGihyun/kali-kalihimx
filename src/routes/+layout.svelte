<script lang="ts">
	import { page } from '$app/stores';
	import { Sidebar } from '$lib/components';
	import '../app.postcss';

	export let data;
</script>

<div class="flex min-h-[100svh]">
	{#if data.user}
		<Sidebar user={data.user} />
	{/if}

	<main
		class="flex-1 ml-0 px-[5%] py-10 {$page.url.pathname === '/login' ||
		$page.url.pathname === 'register'
			? 'lg:ml-0'
			: 'lg:ml-72'}"
	>
		<slot />
	</main>
</div>
