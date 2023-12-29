<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { LoginSchema } from '$lib/schemas';
	import type { RequestStatus } from '$lib/types';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<typeof LoginSchema>;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root {form} schema={LoginSchema} let:config let:attrs>
	<form
		method="POST"
		action="/login"
		class="space-y-4"
		use:enhance={() => {
			console.log('Logging in...');
			requestStatus = {
				type: 'pending'
			};

			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully logged in.');
					requestStatus = {
						type: 'success'
					};
					invalidate('supabase:auth');
				} else {
					console.error('Failed to log in.');
					requestStatus = {
						type: 'error',
						code: result.status
					};
				}
			};
		}}
		{...attrs}
	>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Email</Form.Label>
				<Form.Input
					type="email"
					placeholder="name@example.com"
					class="text-base md:text-lg h-auto"
					required
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Password</Form.Label>
				<Form.Input type="password" class="text-base md:text-lg h-auto" required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<div class="flex flex-col w-full mt-10">
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
						<span class="text-base md:text-lg">Activating...</span>
					{:else if requestStatus.type === 'success'}
						<CheckCircled class="h-5 w-5 " />
						<span class="text-base md:text-lg">Success</span>
					{:else if requestStatus.type === 'error'}
						<CrossCircled class="h-5 w-5 " />
						<span class="text-base md:text-lg">
							{#if requestStatus.code === 400}
								Invalid credentials
							{:else}
								Server error. Please try again.
							{/if}
						</span>
					{:else}
						<span class="text-base md:text-lg">Log in</span>
					{/if}
				</div>
			</Form.Button>

			<p class="mt-4 text-center">
				Don't have an account yet?

				<a href="/register" class="hover:underline font-jost-semibold text-primary"> Register. </a>
			</p>
		</div>
	</form>
</Form.Root>
