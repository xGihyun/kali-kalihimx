<script lang="ts">
	import { RANK_LOGO_COLORS } from '$lib';

	export let title: string | null;
	export let width: string;
	export let absolute: boolean = false;
	export let borderWidth: string = 'border-[6px]';
	export let showContainer: boolean = false;
	export let containerWidth: string = 'h-20 lg:h-28';
</script>

{#if absolute}
	{#if showContainer}
		<div class="absolute -top-[14.5%] left-1/2 -translate-x-1/2 lg:-top-[13.5%] z-50">
			<div class={`bg-background aspect-square  border-l-[1px] border-t-[1px] ${containerWidth}`} />
		</div>
	{/if}
	<div class={`absolute -top-[11%] left-1/2 -translate-x-1/2 lg:-top-[11.5%] z-50`}>
		<div
			class={`aspect-square  z-[70] animate-gradient-x bg-[size:200%] ${borderWidth} ${width} ${
				title ? RANK_LOGO_COLORS.get(title) : 'bg-background'
			}`}
		/>
		{title}
	</div>
{:else}
	<div
		class={`aspect-square  z-[70] animate-gradient-x bg-[size:200%] ${borderWidth} ${width} ${
			title ? RANK_LOGO_COLORS.get(title) : 'bg-background'
		}`}
	/>
{/if}
