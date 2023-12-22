<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<form method="post" use:enhance>
	<input type="email" name="email" required />
	<input type="password" name="password" required />
	<input type="text" name="first_name" required />
	<input type="text" name="last_name" required />
	<input type="text" name="age" required />

	<select value={0} name="sex" required>
		<option value={0}>Male</option>
		<option value={1}>Female</option>
	</select>

	<select name="section" required>
		{#each data.sections as section (section.id)}
			<option value={section.id}>{section.name}</option>
		{/each}
	</select>

	<input type="tel" placeholder="eg. 09123456789" name="contact_number" required />

	<button type="submit">Submit</button>
</form>
