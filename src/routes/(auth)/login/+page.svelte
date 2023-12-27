<script lang="ts">
	import LoginForm from './login-form.svelte';

	export let data;
</script>

<div class="max-w-sm m-auto">
	<LoginForm form={data.form} />
</div>
