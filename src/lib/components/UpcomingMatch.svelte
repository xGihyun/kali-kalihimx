<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getRankTitle, snakeCaseToTitleCase } from '$lib';
	import type { MatchClient, Opponent } from '$lib/types/matches';

	export let matches: MatchClient[];
	export let opponent: Opponent | undefined;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl md:text-4xl font-normal font-jost-bold">Upcoming Match</Card.Title>
	</Card.Header>

	{#if matches.length > 0 && opponent && matches[0].status.toLowerCase() === 'pending'}
		{@const initials = (opponent.first_name[0] + opponent.last_name[0]).toUpperCase()}

		<Card.Content class="px-0 flex flex-col w-full relative ">
			<div class="relative px-6 py-6 flex-1">
				{#if opponent.banner_url}
					<img
						src={opponent.banner_url}
						alt="Banner"
						class="absolute left-0 top-0 object-cover w-full h-full brightness-[.25]"
					/>
				{:else}
					<div class="absolute left-0 top-0 w-full h-full bg-slate-900"></div>
				{/if}

				<div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-card"></div>

				<div class="flex items-center gap-4 justify-between">
					<div class="relative flex items-center gap-4 z-20">
						<Avatar.Root class="text-xl md:text-2xl w-16 h-16 lg:w-20 lg:h-20 shadow-light">
							<Avatar.Image src={opponent.avatar_url} alt="Avatar" />
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar.Root>

						<div>
							<a
								href={`/leaderboards/${opponent.id}`}
								class="text-xl font-jost-semibold line-clamp-1 hover:underline"
								>{opponent.first_name} {opponent.last_name}</a
							>
							<div class="text-base text-muted-foreground">
								{getRankTitle(opponent.score)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 px-6 py-6 gap-2">
				<Card.Root class="px-3 py-2 bg-background flex items-center border-border/75">
					<Card.Content class="p-0">
						<h4 class="text-muted-foreground text-sm md:text-base">Skill</h4>
						<span class="text-base sm:text-xl md:text-2xl font-jost-medium"
							>{snakeCaseToTitleCase(matches[0].arnis_skill)}</span
						>
					</Card.Content>
				</Card.Root>
			</div>
		</Card.Content>
	{:else}
		<Card.Content>
			<p class="text-muted-foreground italic">
				No upcoming match yet, please wait for the admin to queue.
			</p>
		</Card.Content>
	{/if}
</Card.Root>
