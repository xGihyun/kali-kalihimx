<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { SubmitScoreSchema } from '$lib/schemas';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	// import type { ActionData } from './$types';

	export let formAction: boolean = false;
	export let form: SuperValidated<typeof SubmitScoreSchema>;
	export let user1_id: string;
	export let user2_id: string;
	export let user1_name: string = 'N/A';
	export let user2_name: string = 'N/A';

	let loadingStatus = 'none' as 'none' | 'pending' | 'success' | 'error';

	$: if (formAction) {
		loadingStatus = 'none';
	}
</script>

<Form.Root
	method="POST"
	action="/match-history?/submit_score"
	{form}
	schema={SubmitScoreSchema}
	let:config
	on:submit={() => {
		console.log('Submitting...');
		formAction = false;
		loadingStatus = 'pending';
	}}
>
	<input type="text" name="user1_id" value={user1_id} hidden required />
	<input type="text" name="user2_id" value={user2_id} hidden required />

	<Form.Field {config} name="user1_score">
		<Form.Item class="text-base md:text-lg">
			<Form.Label class="text-base md:text-lg">{user1_name}</Form.Label>
			<Form.Input type="number" class="text-base md:text-lg" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="user2_score">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">{user2_name}</Form.Label>
			<Form.Input type="number" class="text-base md:text-lg" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="flex w-full justify-between items-center mt-4">
		<div class="flex items-center gap-1">
			{#if loadingStatus === 'pending' && !formAction}
				<Reload class="h-5 w-5 text-yellow-500 animate-spin" />
				<span class="text-base md:text-lg text-yellow-500">Submitting...</span>
			{:else if formAction}
				<CheckCircled class="h-5 w-5 text-green-500" />
				<span class="text-base md:text-lg text-green-500">Success</span>
			{:else if loadingStatus === 'error'}
				<CrossCircled class="h-5 w-5 text-red-500" />
				<span class="text-base md:text-lg text-red-500">Failed to submit</span>
			{/if}
		</div>
		<Form.Button class="text-base md:text-lg">Submit</Form.Button>
	</div>
</Form.Root>
