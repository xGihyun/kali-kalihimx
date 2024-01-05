<script lang="ts">
	import type { Dimensions, User } from '$lib/types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { snakeCaseToTitleCase } from '$lib';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { upload } from '$lib/helpers';
	import { error } from '@sveltejs/kit';

	export let user: User;
	export let isCurrentUser: boolean = false;

	let selectedAvatar: File | null = null;
	let uploadAvatarEl: HTMLInputElement;
	let isPrivate = user.is_private;
	const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();

	const AVATAR: Dimensions = {
		width: 160,
		height: 160
	};

	async function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) {
			console.log('File not found.');
			return;
		}

		selectedAvatar = target.files[0];

		await upload(selectedAvatar, 'avatar', AVATAR);
	}

	async function togglePrivateStatus() {
		isPrivate = !isPrivate;

		console.log('Updating private status...');

		const response = await fetch('/api/users', {
			method: 'PATCH',
			body: JSON.stringify({
				is_private: isPrivate
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error('Failed to update private status.');
			throw error(500, await response.text());
		}

		console.log('Successfully updated private status.');
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
	<div class="flex w-full items-center gap-4 h-full">
		{#if isCurrentUser}
			<button
				class="flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end shadow-light"
				on:click={() => uploadAvatarEl.click()}
			>
				<Avatar.Root class="text-xl  lg:text-6xl w-full h-full">
					<Avatar.Image src={user.avatar_url} alt="Avatar" />
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>
			</button>
		{:else}
			<div
				class="flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end pointer-events-none shadow-light"
			>
				<Avatar.Root class="text-xl  lg:text-6xl w-full h-full">
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

	{#if isCurrentUser}
		<div class="flex gap-2 items-center">
			<Label for="private-mode" class="text-muted-foreground">Private</Label>
			<Switch id="private-mode" checked={user.is_private} onCheckedChange={togglePrivateStatus} />
		</div>
	{/if}
</div>
