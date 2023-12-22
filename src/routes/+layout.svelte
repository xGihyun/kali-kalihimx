<script lang="ts">
	import { Sidebar } from '$lib/components';
	import '../app.postcss';

	export let data;
</script>

<div class="flex h-screen">
	<Sidebar user={data.user} />

	<main class="flex-1">
		<slot />
	</main>
</div>
