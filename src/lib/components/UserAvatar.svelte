<script lang="ts">
	import type { User } from '$lib/types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { snakeCaseToTitleCase } from '$lib';

	export let user: User;

	const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();
</script>

<div class="border rounded-b-lg bg-card flex h-28 w-full items-center gap-4 px-[5%] lg:h-32">
	<div class="flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end">
		<Avatar.Root class="w-20 h-20 text-3xl lg:text-6xl lg:w-40 lg:h-40">
			<Avatar.Image src={user.avatar_url} alt="Avatar" />
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
	</div>

	<div class="flex h-full flex-col justify-center">
		<span class="text-base lg:text-2xl">
			{user.first_name}
			{user.last_name}
		</span>
		<span class="text-sm lg:text-lg">
			St. {snakeCaseToTitleCase(user.section)}
		</span>
	</div>
</div>
