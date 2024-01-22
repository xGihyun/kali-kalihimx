<script lang="ts">
	import { SectionsTable } from '$lib/components/sections-table';

	export let data;
</script>

<h1 class="text-4xl md:text-6xl font-jost-bold mb-10">Sections</h1>

<SectionsTable sections={data.sections} />
