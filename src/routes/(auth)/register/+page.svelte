<script lang="ts">
	import RegisterForm from './register-form.svelte';

	export let data;
</script>

<div class="flex w-full h-full">
	<div class="max-w-sm w-full mx-auto">
		<RegisterForm form={data.form} sections={data.sections} />
	</div>
</div>
