<script lang="ts">
	import { Banner, PowerCards, Rank, UserAvatar } from '$lib/components';
	import * as Dialog from '$lib/components/ui/dialog';
	import UpdateUserForm from './update-user-form.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { buttonVariants } from '$lib/components/ui/button';
	import { AlertCircle, PenSquare } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';

	export let data;

	$: ({ currentUserId } = data);
</script>

{#await data.lazy.userData}
	<Skeleton class="h-96" />
	<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
		<Skeleton class="h-80" />
		<Skeleton class="h-80" />
	</div>
{:then userData}
	{#if userData[0]}
		<Banner user={userData[0]} isCurrentUser={userData[0].id === currentUserId} />
		<UserAvatar user={userData[0]} isCurrentUser={userData[0].id === currentUserId} />

		<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
			<Rank user={userData[0]} />

			{#if userData[1]}
				<PowerCards
					powerCards={userData[1]}
					user={userData[0]}
					isCurrentUser={userData[0].id === currentUserId}
				/>
			{/if}
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

			<Dialog.Overlay class="z-[70]" />
			<Dialog.Content class="max-h-[90svh] overflow-y-auto z-[100]">
				<Dialog.Header>
					<Dialog.Title>Edit user information</Dialog.Title>
					<Dialog.Description>
						Input the new values you wish to update, leave it blank otherwise.
					</Dialog.Description>
				</Dialog.Header>

				{#await data.sections}
					Loading...
				{:then sections}
					<UpdateUserForm form={data.form} {sections} currentUserData={userData[0]} />
				{:catch err}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							<p>Failed to fetch sections.</p>
							<p>{err}</p>
						</Alert.Description>
					</Alert.Root>
				{/await}
			</Dialog.Content>
		</Dialog.Root>
	{/if}
{:catch err}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>
			<p>Failed to fetch user data.</p>
			<p>{err}</p>
		</Alert.Description>
	</Alert.Root>
{/await}
