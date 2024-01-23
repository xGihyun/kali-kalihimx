<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { LoginSchema } from '$lib/schemas';
	import type { RequestStatus } from '$lib/types';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { LogIn } from 'lucide-svelte';

	export let form: SuperValidated<typeof LoginSchema>;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<div class="mb-5">
	<h1 class="text-2xl font-jost-bold text-center">Welcome back!</h1>
	<p class="text-sm sm:text-base text-center text-muted-foreground">
		Enter your email and password below.
	</p>
</div>

<Form.Root {form} asChild schema={LoginSchema} let:config>
	<form
		method="POST"
		action="?/login"
		class="space-y-4"
		use:enhance={() => {
			console.log('Logging in...');

			requestStatus = {
				type: 'pending'
			};

			return async ({ result, update }) => {
				await update();

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
					type="email"
					placeholder="Enter your email (e.g. pangalan@gmail.com)"
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
						<span class="text-base md:text-lg">Success! Redirecting...</span>
					{:else if requestStatus.type === 'error'}
						<CrossCircled class="h-5 w-5" />
						<span class="text-base md:text-lg">
							{requestStatus.message}
						</span>
					{:else}
						<LogIn class="h-5 w-5" />
						<span class="text-base md:text-lg">Log in</span>
					{/if}
				</div>
			</Form.Button>

			<div class="flex flex-col justify-center gap-2 mt-10">
				<div class="grid grid-cols-2 gap-4">
					<p class="col-span-1 text-end">New user?</p>
					<a href="/register" class="hover:underline font-jost-semibold text-primary"> Register </a>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<p class="col-span-1 text-end">Unverified account?</p>
					<a href="/verify" class="hover:underline font-jost-semibold text-primary">
						Verify Email
					</a>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<p class="col-span-1 text-end">Forgot password?</p>
					<a href="/recover" class="hover:underline font-jost-medium text-primary">
						Reset Password
					</a>
				</div>
			</div>
		</div>
	</form>
</Form.Root>
