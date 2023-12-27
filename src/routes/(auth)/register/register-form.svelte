<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { RegisterSchema } from '$lib/schemas';
	import type { Section } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<typeof RegisterSchema>;
	export let sections: Section[];
</script>

<Form.Root method="POST" {form} schema={RegisterSchema} let:config>
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

	<Form.Field {config} name="first_name">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">First Name</Form.Label>
			<Form.Input type="text" placeholder="Ayaka" class="text-base md:text-lg h-auto" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="last_name">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Last Name</Form.Label>
			<Form.Input type="text" placeholder="Kamisato" class="text-base md:text-lg h-auto" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="age">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Age</Form.Label>
			<Form.Input type="number" class="text-base md:text-lg h-auto" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="contact_number">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Contact Number</Form.Label>
			<Form.Input type="number" class="text-base md:text-lg h-auto" required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="sex">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Sex</Form.Label>
			<Form.Select required>
				<Form.SelectTrigger placeholder="Select your sex" class="text-base md:text-lg h-auto" />
				<Form.SelectContent>
					<Form.SelectItem value={0} class="text-base md:text-lg h-auto">Male</Form.SelectItem>
					<Form.SelectItem value={1} class="text-base md:text-lg h-auto">Female</Form.SelectItem>
				</Form.SelectContent>
			</Form.Select>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="section">
		<Form.Item>
			<Form.Label class="text-base md:text-lg">Section</Form.Label>
			<Form.Select required>
				<Form.SelectTrigger placeholder="Select your section" class="text-base md:text-lg h-auto" />
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

	<Form.Button class="text-base md:text-lg h-auto">Submit</Form.Button>
</Form.Root>
