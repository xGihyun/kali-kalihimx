<script lang="ts">
	import { Banner, PowerCards, Rank, UserAvatar } from '$lib/components';
	import * as Dialog from '$lib/components/ui/dialog';
	import UpdateUserForm from './update-user-form.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { PenSquare } from 'lucide-svelte';

	export let data;

	$: ({ currentUserId } = data);
</script>

{#await data.userOnPage}
	<Skeleton class="h-96" />
{:then user}
	{#if user}
		<Banner {user} isCurrentUser={user.id === currentUserId} />
		<UserAvatar {user} isCurrentUser={user.id === currentUserId} />

		<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
			<Rank {user} />

			{#await data.powerCards}
				<Skeleton class="min-h-20" />
			{:then powerCards}
				{#if powerCards}
					<PowerCards {powerCards} {user} isCurrentUser={user.id === currentUserId} />
				{/if}
			{/await}
		</div>

		<Dialog.Root closeOnOutsideClick={false}>
			<Dialog.Trigger
				class={`fixed bottom-10 right-[5%] shadow-dark flex items-center gap-1 h-auto ${buttonVariants(
					{
						variant: 'default'
					}
				)}`}
			>
				<PenSquare class="h-5 w-5" />
				<span class="text-base md:text-lg"> Edit </span>
			</Dialog.Trigger>
			<Dialog.Content class="max-h-[90svh] overflow-y-auto">
				<Dialog.Header>
					<Dialog.Title>Edit user information</Dialog.Title>
					<Dialog.Description>
						Input the new values you wish to update, leave it blank otherwise.
					</Dialog.Description>
				</Dialog.Header>

				{#await data.sections}
					Loading...
				{:then sections}
					<UpdateUserForm form={data.form} {sections} currentUserData={user} />
				{/await}
			</Dialog.Content>
		</Dialog.Root>
	{/if}
{/await}
