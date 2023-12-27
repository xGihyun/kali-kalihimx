<!-- This could be merged with Avatar into a single function since they're pretty much the same -->
<script lang="ts">
	import type { User } from '$lib/types';
	import { invalidate } from '$app/navigation';
	import { crop } from '$lib/pkg/my_package';
	import { PenSquare } from 'lucide-svelte';

	export let user: User;

	let selectedBanner: File | null = null;
	let uploadBannerEl: HTMLInputElement;

	const BANNER = {
		width: 1360,
		height: 320
	};

	async function upload() {
		if (!selectedBanner) return;

		const ogBannerBuffer = await selectedBanner.arrayBuffer();
		const bytes = new Uint8Array(ogBannerBuffer);
		const croppedAvatar = crop(bytes, BANNER.width, BANNER.height);

		const formData = new FormData();

		formData.append('file', new Blob([croppedAvatar]));
		formData.append('filename', selectedBanner.name);

		const response = await fetch('/api/banner/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Updated banner');
			invalidate('user:images');
		} else {
			console.error('Failed to update banner');
		}
	}

	function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedBanner = target.files[0];

		upload();
	}
</script>

<input
	type="file"
	accept="image/*"
	name="photo"
	on:change={handleSelectedAvatar}
	hidden
	bind:this={uploadBannerEl}
/>

<div class="relative h-40 w-full lg:h-80 rounded-t-lg overflow-hidden">
	{#if user.banner_url}
		<img src={user.banner_url} alt="Banner" class="object-cover w-full h-full" />
	{:else}
		<div class="bg-slate-700 w-full h-full" />
	{/if}

	<button
		class="absolute right-5 bottom-5 bg-background rounded-full p-2"
		on:click|preventDefault={() => uploadBannerEl.click()}
	>
		<PenSquare class="w-5 h-5" />
	</button>
</div>
