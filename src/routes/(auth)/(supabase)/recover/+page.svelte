<script lang="ts">
	import ResetPasswordForm from './reset-password-form.svelte';

	export let data;
</script>

<div class="max-w-sm mx-auto">
	<ResetPasswordForm form={data.form} />
</div>
