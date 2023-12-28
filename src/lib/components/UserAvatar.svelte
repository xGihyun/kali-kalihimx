<script lang="ts">
	import type { User } from '$lib/types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { snakeCaseToTitleCase } from '$lib';
	import { invalidate } from '$app/navigation';
	import { crop } from '$lib/pkg/my_package';

	export let user: User;
	export let isCurrentUser: boolean = false;

	let selectedAvatar: File | null = null;
	let uploadAvatarEl: HTMLInputElement;
	const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();

	const AVATAR = {
		width: 160,
		height: 160
	};

	async function upload() {
		if (!selectedAvatar) return;

		const ogArrayBuffer = await selectedAvatar.arrayBuffer();
		const bytes = new Uint8Array(ogArrayBuffer);
		const croppedAvatar = crop(bytes, AVATAR.width, AVATAR.height);

		const formData = new FormData();

		formData.append('file', new Blob([croppedAvatar]));
		formData.append('filename', selectedAvatar.name);

		const response = await fetch('/api/avatar/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Updated avatar');
			invalidate('user:images');
		} else {
			console.error('Failed to update avatar');
		}
	}

	function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedAvatar = target.files[0];

		upload();
	}
</script>

{#if isCurrentUser}
	<input
		type="file"
		accept="image/*"
		name="photo"
		on:change={handleSelectedAvatar}
		hidden
		bind:this={uploadAvatarEl}
	/>
{/if}

<div class="border rounded-b-lg bg-card flex h-28 w-full items-center gap-4 px-[5%] lg:h-32">
	{#if isCurrentUser}
		<button
			class="flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end"
			on:click={() => uploadAvatarEl.click()}
		>
			<Avatar.Root class="w-20 h-20 text-3xl lg:text-6xl lg:w-40 lg:h-40">
				<Avatar.Image src={user.avatar_url} alt="Avatar" />
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</button>
	{:else}
		<div
			class="flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end pointer-events-none"
		>
			<Avatar.Root class="w-20 h-20 text-3xl lg:text-6xl lg:w-40 lg:h-40">
				<Avatar.Image src={user.avatar_url} alt="Avatar" />
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{/if}

	<div class="flex h-full flex-col justify-center">
		<span class="text-base lg:text-2xl">
			{user.first_name}
			{user.last_name}
		</span>
		<span class="text-sm lg:text-lg text-muted-foreground">
			St. {snakeCaseToTitleCase(user.section)}
		</span>
	</div>
</div>
