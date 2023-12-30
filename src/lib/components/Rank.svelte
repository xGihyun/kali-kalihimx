<script lang="ts">
	import { getRankTitle } from '$lib';
	import type { User } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { RankLogo } from '.';

	export let user: User;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl md:text-4xl font-normal font-jost-bold">Performance</Card.Title>
	</Card.Header>
	<Card.Content class="flex px-0 relative flex-wrap">
		<div class="flex flex-1 items-center gap-6 relative px-6 pl-9 pr-6 h-32">
			<div
				class="absolute left-0 top-0 w-full h-full transform-gpu animate-gradient-x bg-gradient-to-r from-blue-950 to-rose-950 bg-[size:200%]"
			/>

			<div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-card"></div>
			<RankLogo
				title={getRankTitle(user.score)}
				width="lg:h-14 h-12"
				containerWidth="lg:h-14 h-12"
				showContainer={true}
				zIndex="z-20"
			/>

			<span class="font-jost-semibold text-xl md:text-3xl uppercase flex-1 relative z-20"
				>{getRankTitle(user.score)}</span
			>
		</div>

		<div class="flex-1 flex gap-8 items-center px-6 py-6">
			<div class="flex flex-col">
				<h4 class="text-muted-foreground text-sm md:text-base">Score</h4>
				<span class="text-xl md:text-2xl font-jost-medium">{user.score}</span>
			</div>

			<div class="flex flex-col">
				<h4 class="text-muted-foreground text-sm md:text-base">Overall</h4>
				<span class="text-xl md:text-2xl font-jost-medium">#{user.rank_overall}</span>
			</div>

			<div class="flex flex-col">
				<h4 class="text-muted-foreground text-sm md:text-base">Section</h4>
				<span class="text-xl md:text-2xl font-jost-medium">#{user.rank_section}</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>
