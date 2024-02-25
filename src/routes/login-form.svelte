<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { loginSchema } from '$lib/schemas';
	import { type LoginSchema } from '$lib/types/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { processActionResult } from '$lib/helpers';

	export let data: SuperValidated<Infer<LoginSchema>>;

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		onResult: ({ result }) => {
			console.log(result);
			processActionResult(result);
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="mb-5">
	<h1 class="text-2xl font-jost-bold text-center">Welcome back!</h1>
	<p class="text-sm sm:text-base text-center text-muted-foreground">
		Enter your email and password below.
	</p>
</div>

<form method="POST" action="?/login" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full">Log in</Form.Button>
</form>
