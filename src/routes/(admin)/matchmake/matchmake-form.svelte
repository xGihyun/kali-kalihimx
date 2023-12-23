<script lang="ts">
	import { FOOTWORKS, SKILLS } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { arnisMatchSchema, type ArnisMatchSchema } from '$lib/schemas';
	import type { Section } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<ArnisMatchSchema>;
	export let sections: Section[];
</script>

<Form.Root
	{form}
	schema={arnisMatchSchema}
	let:config
	method="POST"
	class="w-full max-w-5xl flex items-center gap-4"
	enhance="true"
>
	<div class="w-full flex items-center gap-2">
		<Form.Field {config} name="section">
			<Form.Item class="space-y-0 flex-[2]">
				<Form.Select>
					<Form.SelectTrigger placeholder="Select a section" class="text-base md:text-lg" />
					<Form.SelectContent>
						{#each sections as section (section.id)}
							<Form.SelectItem value={section.id} class="text-base md:text-lg"
								>{section.name}</Form.SelectItem
							>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="skill">
			<Form.Item class="space-y-0 flex-1">
				<Form.Select>
					<Form.SelectTrigger placeholder="Select a skill" class="text-base md:text-lg" />
					<Form.SelectContent>
						{#each SKILLS as [key, value] (key)}
							<Form.SelectItem value={key} class="text-base md:text-lg">{value}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="footwork">
			<Form.Item class="space-y-0 flex-1">
				<Form.Select>
					<Form.SelectTrigger placeholder="Select a footwork" class="text-base md:text-lg" />
					<Form.SelectContent>
						{#each FOOTWORKS as [key, value] (key)}
							<Form.SelectItem value={key} class="text-base md:text-lg">{value}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Form.Button class="text-base md:text-lg">Matchmake</Form.Button>
</Form.Root>
