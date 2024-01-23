<script lang="ts">
	import VerifyEmailForm from './verify-email-form.svelte';

	export let data;
</script>

<div class="max-w-sm mx-auto">
	<VerifyEmailForm form={data.form} />

	<p class="mt-4 text-center">
		<a href="/" class="hover:underline font-jost-medium text-primary"> Log in </a>
	</p>
</div>
