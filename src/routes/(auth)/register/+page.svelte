<script lang="ts">
	import RegisterForm from './register-form.svelte';

	export let data;
</script>

<div class="max-w-sm m-auto">
	<RegisterForm form={data.form} sections={data.sections} />
</div>
