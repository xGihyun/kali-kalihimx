<script lang="ts">
	import UpdatePasswordForm from './update-password-form.svelte';

	export let data;
	export let form;
</script>

<div class="max-w-sm mx-auto">
	<UpdatePasswordForm form={data.form} actionData={form} />

	<p class="mt-4 text-center">
		<a href="/" class="hover:underline font-jost-medium text-primary"> Log in </a>
	</p>
</div>
