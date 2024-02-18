<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { toHttpResult } from '$lib/helpers';
	import { rubricSchema } from '$lib/schemas';
	import type { RequestStatus2, RubricSchema } from '$lib/types';
	import type { ActionResult } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { undefined } from 'zod';

	export let form: SuperValidated<RubricSchema>;
	export let isDialogOpen: Writable<boolean>;

	let requestStatus: RequestStatus2 = {
		type: 'none',
		message: 'N/A'
	};

	function processResult(result: ActionResult<Record<string, any>, Record<string, any>>) {
		requestStatus.type = 'pending';

		switch (result.type) {
			case 'success':
			case 'failure':
				{
					const resultSchema = toHttpResult(undefined());
					const resultData = resultSchema.parse(result.data?.result);

					requestStatus = {
						type: result.type,
						message: resultData.message || 'Result message not found.'
					};

					if (result.type === 'success') {
						toast.success(requestStatus.message);
						$isDialogOpen = false;

						return;
					}
				}

				break;
			case 'error':
				requestStatus = {
					type: 'failure',
					message: result.error.message || 'Result message not found.'
				};

				break;
			default:
				requestStatus = {
					type: 'unknown',
					message: 'Unknown request status.'
				};

				break;
		}

		toast.error(requestStatus.message);
	}
</script>

<Form.Root
	method="POST"
	action="?/create"
	{form}
	schema={rubricSchema}
	let:config
	options={{
		clearOnSubmit: 'none',
		onSubmit: () => {
			toast.info(`Creating new rubric...`);
		},
		onResult: ({ result }) => {
			processResult(result);
		}
	}}
>
	<Form.Field {config} name="title">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Title</Form.Label>
			<Form.Textarea class="text-base md:text-lg" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Description</Form.Label>
			<Form.Textarea class="text-base md:text-lg" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="max_score">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Max Score</Form.Label>
			<Form.Input type="number" class="text-base md:text-lg h-auto" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button class="text-base md:text-lg h-auto w-full mt-4">Submit</Form.Button>
</Form.Root>
