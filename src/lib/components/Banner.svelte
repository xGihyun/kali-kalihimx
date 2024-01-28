<script lang="ts">
	import type { RequestStatus, Result, User } from '$lib/types';
	import { PenSquare } from 'lucide-svelte';
	import { isResult, upload } from '$lib/helpers';
	import { CrossCircled, Reload } from 'radix-icons-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let user: User | Result;
	export let isCurrentUser: boolean = false;

	let selectedBanner: File | null = null;
	let uploadBannerEl: HTMLInputElement;
	let requestStatus: RequestStatus = {
		type: 'none'
	};

	const BANNER = {
		width: 1360,
		height: 320
	};

	async function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) {
			console.error('File not found.');
			return;
		}

		requestStatus.type = 'pending';

		selectedBanner = target.files[0];

		const uploadImage = await upload(selectedBanner, 'banner', BANNER);

		if (!uploadImage.success) {
			requestStatus = {
				code: uploadImage.code,
				message: uploadImage.message,
				type: 'error'
			};

			return;
		}

		requestStatus = {
			code: uploadImage.code,
			message: uploadImage.message,
			type: 'success'
		};

		console.log(requestStatus);
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
	{#if isResult(user)}
		<Alert.Root variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>
				<p>Failed to fetch user.</p>
				<p>{user.message}</p>
			</Alert.Description>
		</Alert.Root>
	{:else}
		{#if user.banner_url}
			<img
				src={user.banner_url}
				alt="Banner"
				class={`object-cover w-full h-full ${
					requestStatus.type === 'pending' || requestStatus.type === 'error'
						? 'brightness-[.25]'
						: ''
				}`}
			/>

			{#if requestStatus.type === 'pending'}
				<div
					class="w-10 h-10 lg:w-20 lg:h-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<Reload class="w-full h-full animate-spin" />
				</div>
			{:else if requestStatus.type === 'error'}
				<div
					class="w-10 h-10 lg:w-20 lg:h-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<CrossCircled class="w-full h-full text-red-600" />
				</div>
			{/if}
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
	{/if}
</div>
