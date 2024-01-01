<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { ResetPasswordSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActionData } from './$types';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import type { RequestStatus } from '$lib/types';

	export let form: SuperValidated<typeof ResetPasswordSchema>;
	export let actionData: ActionData;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={ResetPasswordSchema}
	let:config
	on:submit={() => (requestStatus.type = 'pending')}
>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Email</Form.Label>
			<Form.Input class="text-base md:text-lg h-auto" type="email" />
			<Form.Description>Please enter your email to receive a confirmation link.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button
		class={`h-auto w-full space-x-1 ${
			actionData?.success
				? 'bg-green-500 pointer-events-none'
				: requestStatus.type === 'pending'
					? 'bg-yellow-500 pointer-events-none'
					: !actionData?.success && requestStatus.type !== 'none'
						? 'bg-red-500 hover:bg-red-600'
						: 'bg-primary'
		}`}
	>
		{#if actionData?.success}
			<CheckCircled class="w-5 h-5" />
			<span class="text-base md:text-lg">{actionData?.message}</span>
		{:else if requestStatus.type === 'pending'}
			<Reload class="w-5 h-5 animate-spin" />
			<span class="text-base md:text-lg">Submitting...</span>
		{:else if !actionData?.success && requestStatus.type !== 'none'}
			<CrossCircled class="w-5 h-5" />
			<span class="text-base md:text-lg">{actionData?.message}</span>
		{:else}
			<span class="text-base md:text-lg">Submit</span>
		{/if}
	</Form.Button>
</Form.Root>
