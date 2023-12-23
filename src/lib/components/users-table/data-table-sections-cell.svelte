<script lang="ts">
	import type { Section } from '$lib/types';

	export let sections: Section[] = [];
	export let value: string;

	const section = sections.find((section) => section.id === value);
	// const Icon = section?.icon;
</script>

{#if section}
	<div class="flex w-[100px] items-center">
		<!-- {#if Icon} -->
		<!-- 	<Icon class="mr-2 h-4 w-4 text-muted-foreground" /> -->
		<!-- {/if} -->
		<span>{section.name}</span>
	</div>
{/if}
