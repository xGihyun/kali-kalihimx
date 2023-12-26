<script lang="ts">
	import type { User } from '$lib/types';

	export let user: User;
</script>

<div class="relative h-40 w-full lg:h-80 bg-slate-700 rounded-t-lg">
	<img src={user.banner_url} alt="Banner" class="object-cover" />
</div>
