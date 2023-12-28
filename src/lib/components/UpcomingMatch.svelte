<script lang="ts">
	import type { LatestOpponent, Matchmake } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getRankTitle, snakeCaseToTitleCase } from '$lib';

	export let match: Matchmake | undefined;
	export let userId: string;
	export let opponentDetails: LatestOpponent;

	function getOpponent(match: Matchmake | undefined): {
		id: string | undefined;
		name: string | undefined;
	} {
		if (!match)
			return {
				id: undefined,
				name: undefined
			};

		if (userId === match.user1_id) {
			return {
				id: match.user2_id,
				name: `${match.user2_first_name} ${match.user2_last_name}`
			};
		}

		return {
			id: match.user1_id,
			name: `${match.user1_first_name} ${match.user1_last_name}`
		};
	}

	const initials = (opponentDetails.first_name[0] + opponentDetails.last_name[0]).toUpperCase();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-4xl font-normal font-jost-bold">Upcoming Match</Card.Title>
	</Card.Header>

	{#if match}
		<Card.Content class="px-0 flex flex-col sm:flex-row w-full relative flex-wrap">
			<div class="relative px-6 py-6 flex-1">
				<img
					src={opponentDetails.banner_url}
					alt="Banner"
					class="absolute left-0 top-0 object-cover w-full h-full brightness-[.25]"
				/>

				<div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-card"></div>

				<div class="flex items-center gap-4 justify-between">
					<div class="relative flex items-center gap-4 z-20">
						<Avatar.Root class="text-xl lg:text-2xl w-16 h-16 lg:w-20 lg:h-20">
							<Avatar.Image src={opponentDetails.avatar_url} alt="Avatar" />
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar.Root>

						<div>
							<a
								href={`/leaderboards/${getOpponent(match).id}`}
								class="text-xl font-jost-semibold line-clamp-1 hover:underline"
								>{getOpponent(match).name}</a
							>
							<div class="text-base text-muted-foreground">
								{getRankTitle(opponentDetails.score)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="px-6 py-6 flex-1 flex items-center relative z-20">
				<div class="flex items-center gap-10">
					<div class="flex flex-col">
						<h4 class="text-muted-foreground text-sm md:text-base">Skill</h4>
						<span class="text-2xl font-jost-medium">{snakeCaseToTitleCase(match.arnis_skill)}</span>
					</div>

					<div class="flex flex-col">
						<h4 class="text-muted-foreground text-sm md:text-base">Footwork</h4>
						<span class="text-2xl font-jost-medium"
							>{snakeCaseToTitleCase(match.arnis_footwork)}</span
						>
					</div>

					<!-- <div class="flex items-center gap-2"> -->
					<!-- 	<Sword class="w-8 h-8 opacity-50" /> -->
					<!-- 	<span class="text-lg font-jost-medium"> -->
					<!-- 		{snakeCaseToTitleCase(match.arnis_skill)} -->
					<!-- 	</span> -->
					<!-- </div> -->

					<!-- <div class="flex items-center gap-2"> -->
					<!-- 	<Footprints class="w-8 h-8 opacity-50" /> -->
					<!-- 	<span class="text-lg font-jost-medium"> -->
					<!-- 		{snakeCaseToTitleCase(match.arnis_footwork)} -->
					<!-- 	</span> -->
					<!-- </div> -->
				</div>
			</div>
		</Card.Content>
	{:else}
		<Card.Content>No match</Card.Content>
	{/if}
</Card.Root>
