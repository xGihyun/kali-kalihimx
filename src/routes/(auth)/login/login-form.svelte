<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { LoginSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<typeof LoginSchema>;
</script>

<Form.Root method="POST" {form} schema={LoginSchema} let:config>
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

	<Form.Button class="text-base md:text-lg">Submit</Form.Button>
</Form.Root>
