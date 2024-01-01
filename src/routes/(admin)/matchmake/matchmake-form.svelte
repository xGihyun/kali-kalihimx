<script lang="ts">
	import { FOOTWORKS, SKILLS } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { arnisMatchSchema, type ArnisMatchSchema } from '$lib/schemas';
	import type { RequestStatus, Section } from '$lib/types';
	import { Swords } from 'lucide-svelte';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActionData } from './$types';

	export let form: SuperValidated<ArnisMatchSchema>;
	export let sections: Section[];
	export let formAction: ActionData;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root
	{form}
	schema={arnisMatchSchema}
	let:config
	asChild
	let:attrs
	let:enhance
	on:submit={() => (requestStatus.type = 'pending')}
>
	<form class="w-full max-w-5xl flex items-center gap-2" method="post" {...attrs} use:enhance>
		<Form.Field {config} name="section">
			<Form.Item class="space-y-0 flex-[2]">
				<Form.Select>
					<Form.SelectTrigger placeholder="Select a section" class="text-base md:text-lg h-auto" />
					<Form.SelectContent>
						{#each sections as section (section.id)}
							<Form.SelectItem value={section.id} class="text-base md:text-lg h-auto"
								>{section.name}</Form.SelectItem
							>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<!-- <Form.Field {config} name="skill"> -->
		<!-- 	<Form.Item class="space-y-0 flex-1"> -->
		<!-- 		<Form.Select> -->
		<!-- 			<Form.SelectTrigger placeholder="Select a skill" class="text-base md:text-lg h-auto" /> -->
		<!-- 			<Form.SelectContent> -->
		<!-- 				{#each SKILLS as [key, value] (key)} -->
		<!-- 					<Form.SelectItem value={key} class="text-base md:text-lg h-auto" -->
		<!-- 						>{value}</Form.SelectItem -->
		<!-- 					> -->
		<!-- 				{/each} -->
		<!-- 			</Form.SelectContent> -->
		<!-- 		</Form.Select> -->
		<!-- 		<Form.Validation /> -->
		<!-- 	</Form.Item> -->
		<!-- </Form.Field> -->

		<Form.Field {config} name="footwork">
			<Form.Item class="space-y-0 flex-1">
				<Form.Select>
					<Form.SelectTrigger placeholder="Select a footwork" class="text-base md:text-lg h-auto" />
					<Form.SelectContent>
						{#each FOOTWORKS as [key, value] (key)}
							<Form.SelectItem value={key} class="text-base md:text-lg h-auto"
								>{value}</Form.SelectItem
							>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Button
			on:click={() => (requestStatus.type = 'pending')}
			class={`text-base md:text-lg h-auto ${
				formAction?.success
					? 'bg-green-500'
					: requestStatus.type === 'error'
						? 'bg-red-500 hover:bg-red-600'
						: requestStatus.type === 'pending'
							? 'bg-yellow-500 pointer-events-none'
							: 'bg-primary'
			}`}
			disabled={requestStatus.type === 'pending' && !formAction?.success}
		>
			<div class="flex items-center gap-1">
				{#if formAction?.success}
					<CheckCircled class="h-5 w-5" />
				{:else if requestStatus.type === 'pending'}
					<Reload class="h-5 w-5 animate-spin" />
				{:else if requestStatus.type === 'error'}
					<CrossCircled class="h-5 w-5" />
				{:else}
					<Swords class="h-5 w-5" />
				{/if}

				<span class="text-base md:text-lg">Matchmake</span>
			</div>
		</Form.Button>
	</form>
</Form.Root>
