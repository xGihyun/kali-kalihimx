<script lang="ts">
	import type { MatchClient } from "$lib/types/matches";
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';

	export let matches: MatchClient[];
</script>


	<Table.Root>
		<Table.Header>
			<Table.Row class="text-sm sm:text-base md:text-lg">
				<Table.Head>Data</Table.Head>
				<Table.Head class="text-primary/80 font-jost-semibold"
					>{data.user?.first_name} {data.user?.last_name} (You)</Table.Head
				>
				<Table.Head>{getOpponent(data.user?.id, data.match).name}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
    
			<Table.Row class="text-sm sm:text-base md:text-lg">
				<Table.Cell class="text-sm sm:text-base md:text-lg font-jost-medium"
					>Received Score</Table.Cell
				>
		</Table.Body>
	</Table.Root>
