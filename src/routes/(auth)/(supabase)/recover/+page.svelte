<script lang="ts">
	import ResetPasswordForm from './reset-password-form.svelte';

	export let data;
	export let form;
</script>

<div class="max-w-sm mx-auto">
	<ResetPasswordForm form={data.form} actionData={form} />
</div>
