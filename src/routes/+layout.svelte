<script lang="ts">
	import { page } from '$app/stores';
	import { Sidebar } from '$lib/components';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			console.log('Auth state changed.');

			if (_session?.expires_at !== session?.expires_at) {
				invalidateAll();
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="flex min-h-[100svh]">
	{#if data.user}
		<Sidebar user={data.user} />
	{/if}

	<main
		class={`flex-1 ml-0 px-[5%] py-10 ${
			$page.url.pathname === '/login' || $page.url.pathname === '/register' ? 'lg:ml-0' : 'lg:ml-72'
		}`}
	>
		<div
			class={`${
				$page.url.pathname === '/' || $page.route.id === '/leaderboards/[user_id]'
					? 'max-w-none'
					: 'max-w-5xl'
			} mx-auto`}
		>
			<slot />
		</div>
	</main>
</div>
