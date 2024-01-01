<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { LoginSchema } from '$lib/schemas';
	import type { RequestStatus } from '$lib/types';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActionData } from './$types';
	import { enhance as formEnhance } from '$app/forms';
	import { LogIn } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';

	export let form: SuperValidated<typeof LoginSchema>;
	export let formAction: ActionData;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root {form} asChild schema={LoginSchema} let:config let:enhance>
	<form
		method="POST"
		action="?/login"
		class="space-y-4"
		use:formEnhance={() => {
			console.log('Logging in...');
			requestStatus = {
				type: 'pending'
			};

			return async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully registered.');
					requestStatus.type = 'success';
					invalidateAll();
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
						<span class="text-base md:text-lg">Logging in...</span>
					{:else if requestStatus.type === 'success'}
						<CheckCircled class="h-5 w-5" />
						<span class="text-base md:text-lg">Success</span>
					{:else if requestStatus.type === 'error'}
						<CrossCircled class="h-5 w-5" />
						<span class="text-base md:text-lg">
							{formAction?.message}
						</span>
					{:else}
						<LogIn class="h-5 w-5" />
						<span class="text-base md:text-lg">Log in</span>
					{/if}
				</div>
			</Form.Button>

			<p class="mt-4 text-center">
				Don't have an account yet?

				<a href="/register" class="hover:underline font-jost-semibold text-primary"> Register. </a>
			</p>
			<p class="mt-4 text-center">
				<a href="/recover" class="hover:underline font-jost-medium text-primary">
					I forgot my password.
				</a>
			</p>
		</div>
	</form>
</Form.Root>
