<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<input type="email" name="email" required />
	<input type="password" name="password" required />

	<button type="submit">Submit</button>
</form>
