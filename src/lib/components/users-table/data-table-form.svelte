<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { enhance } from '$app/forms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RequestStatus, User } from '$lib/types';
	import { DeleteUsersSchema } from '$lib/schemas';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { Trash2 } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	export let form: SuperValidated<typeof DeleteUsersSchema>;
	export let selectedDataIds: any;
	export let users: User[];

	let checked = false;

	let requestStatus: RequestStatus = {
		type: 'none'
	};

	function usersToDelete(selectedDataIds: any): string[] {
		const indices = Object.keys(selectedDataIds);

		let usersToDelete: string[] = [];

		indices.forEach((idx) => {
			const i = Number(idx);

			usersToDelete.push(users[i].id);
		});

		return usersToDelete;
	}
</script>

<Form.Root {form} asChild schema={DeleteUsersSchema}>
	<form
		method="POST"
		action="?/delete"
		class="flex items-center gap-5"
		use:enhance={({ formData }) => {
			console.log('Deleting...');

			requestStatus = {
				type: 'pending'
			};

			const users = usersToDelete($selectedDataIds);

			if (users.length > 0) {
				console.log(checked);
				console.log(users);
				formData.append('users', users.toString());
				formData.append('force', checked.toString());
			}

			return async ({ result, update }) => {
				await update();

				console.log(result);

				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully submitted score.');

					requestStatus = {
						type: 'success',
						code: result.status,
						message: result.data.message
					};
				} else {
					console.error('Failed to submit score.');
					requestStatus = {
						type: 'error',
						code: result.status,
						message: result.data.message
					};
				}
			};
		}}
	>
		<div class="flex items-center space-x-2">
			<Checkbox id="forced" bind:checked aria-labelledby="force-delete" />
			<Label
				id="terms-label"
				for="forced"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Force delete
			</Label>
		</div>

		<Form.Button
			disabled={Object.keys($selectedDataIds).length < 1 || requestStatus.type === 'pending'}
			variant="destructive"
			class={`text-sm sm:text-base md:text-lg h-auto  ${
				requestStatus.type === 'success'
					? 'bg-green-500 pointer-events-none text-primary-foreground'
					: requestStatus.type === 'error'
						? 'bg-red-500 hover:bg-red-600 text-primary-foreground'
						: requestStatus.type === 'pending'
							? 'bg-yellow-500 pointer-events-none text-primary-foreground'
							: 'bg-destructive'
			}`}
		>
			<div class="flex items-center gap-1">
				{#if requestStatus.type === 'pending'}
					<Reload class="h-5 w-5 animate-spin" />
					<span class="text-sm sm:text-base md:text-lg">Deleting...</span>
				{:else if requestStatus.type === 'success'}
					<CheckCircled class="h-5 w-5" />
					<span class="text-sm sm:text-base md:text-lg">Success</span>
				{:else if requestStatus.type === 'error'}
					{#if requestStatus.code === 409}
						<CrossCircled class="h-5 w-5" />
						<span class="text-sm sm:text-base md:text-lg"> Failure </span>
					{:else}
						<CrossCircled class="h-5 w-5" />
						<span class="text-sm sm:text-base md:text-lg"> Error </span>
					{/if}
				{:else}
					<Trash2 class="h-5 w-5" />
					<span class="text-sm sm:text-base md:text-lg">Delete</span>
				{/if}
			</div>
		</Form.Button>
	</form>
</Form.Root>
