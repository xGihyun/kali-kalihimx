<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { EmailSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RequestStatus } from '$lib/types';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { enhance } from '$app/forms';

	export let form: SuperValidated<typeof EmailSchema>;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root {form} schema={EmailSchema} let:config>
	<form
		method="POST"
		use:enhance={() => {
			console.log('Logging in...');

			requestStatus = {
				type: 'pending'
			};

			return async ({ result, update }) => {
				await update();

				console.log(result);

				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully registered.');
					requestStatus = {
						type: 'success',
						code: result.status,
						message: result.data.message
					};
				} else {
					console.error('Error');
					requestStatus = {
						type: 'error',
						code: result.status,
						message: result.data.message
					};
				}
			};
		}}
	>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Email</Form.Label>
				<Form.Input
					class="text-base md:text-lg h-auto"
					type="email"
					placeholder="Enter email (e.g. pangalan@gmail.com)"
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Button
			class={`text-base md:text-lg h-auto w-full ${
				requestStatus.type === 'success'
					? 'bg-green-500 pointer-events-none'
					: requestStatus.type === 'error'
						? 'bg-red-500 hover:bg-red-600'
						: requestStatus.type === 'pending'
							? 'bg-yellow-500 pointer-events-none'
							: 'bg-primary'
			}`}
		>
			<div class="flex items-center gap-1">
				{#if requestStatus.type === 'pending'}
					<Reload class="h-5 w-5 animate-spin" />
					<span class="text-base md:text-lg">Verifying...</span>
				{:else if requestStatus.type === 'success'}
					<CheckCircled class="h-5 w-5 " />
					<span class="text-base md:text-lg">Success! Please check your email.</span>
				{:else if requestStatus.type === 'error'}
					<CrossCircled class="h-5 w-5 " />
					<span class="text-base md:text-lg">
						{requestStatus.message}
					</span>
				{:else}
					<span class="text-base md:text-lg">Verify</span>
				{/if}
			</div>
		</Form.Button>
	</form>
</Form.Root>
