<script lang="ts">
	import type { User } from '$lib/types';
	import { PenSquare } from 'lucide-svelte';
	import { upload } from '$lib/helpers';

	export let user: User;
	export let isCurrentUser: boolean = false;

	let selectedBanner: File | null = null;
	let uploadBannerEl: HTMLInputElement;

	const BANNER = {
		width: 1360,
		height: 320
	};

	async function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedBanner = target.files[0];

		await upload(selectedBanner, 'banner', BANNER);
	}
</script>

{#if isCurrentUser}
	<input
		type="file"
		accept="image/*"
		name="photo"
		on:change={handleSelectedAvatar}
		hidden
		bind:this={uploadBannerEl}
	/>
{/if}

<div class="relative h-40 w-full lg:h-80 rounded-t-lg overflow-hidden">
	{#if user.banner_url}
		<img src={user.banner_url} alt="Banner" class="object-cover w-full h-full" />
	{:else}
		<div class="bg-slate-700 w-full h-full" />
	{/if}

	{#if isCurrentUser}
		<button
			class="absolute right-5 bottom-5 bg-background rounded-full p-2"
			on:click|preventDefault={() => uploadBannerEl.click()}
		>
			<PenSquare class="w-5 h-5" />
		</button>
	{/if}
</div>
