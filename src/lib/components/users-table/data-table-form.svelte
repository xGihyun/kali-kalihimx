<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { enhance as enhancer } from '$app/forms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RequestStatus, User } from '$lib/types';
	import { DeleteSectionsSchema } from '$lib/schemas';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	export let form: SuperValidated<typeof DeleteSectionsSchema>;
	export let selectedDataIds: any;
	export let users: User[];

	let checked = false;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root {form} asChild schema={DeleteSectionsSchema}>
	<form
		method="POST"
		action="?/delete"
		class="space-y-4"
		use:enhancer={({ formData }) => {
			console.log('Deleting...');
			requestStatus = {
				type: 'pending'
			};

			const indices = Object.keys($selectedDataIds);

			let usersToDelete = [];

			indices.forEach((idx) => {
				const i = Number(idx);

				usersToDelete.push(users[i].id);
			});

			// Should be 'users'
			if (usersToDelete.length > 0) {
				console.log(checked);
				formData.append('sections', usersToDelete);
				formData.append('force', checked.toString());
			}

			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully registered.');
					requestStatus.type = 'success';
				} else {
					console.error('Error');
					requestStatus = {
						type: 'error',
						code: result.status
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
			disabled={Object.keys($selectedDataIds).length < 1}
			variant="destructive"
			class={`text-base md:text-lg h-auto  ${
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
					<span class="text-base md:text-lg">Deleting...</span>
				{:else if requestStatus.type === 'success'}
					<CheckCircled class="h-5 w-5" />
					<span class="text-base md:text-lg">Success</span>
				{:else if requestStatus.type === 'error'}
					<CrossCircled class="h-5 w-5" />
					<span class="text-base md:text-lg"> Error </span>
				{:else}
					<Trash2 class="h-5 w-5" />
					<span class="text-base md:text-lg">Delete</span>
				{/if}
			</div>
		</Form.Button>
	</form>
</Form.Root>
