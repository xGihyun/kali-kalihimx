<script lang="ts">
	import { PlusCircled, Check } from 'radix-icons-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import type { Section } from '$lib/types';
	import { snakeCaseToTitleCase } from '$lib';
	import { selectedSections } from '$lib/stores';

	export let filterValues: string[] = $selectedSections.split(',');
	export let title: string;
	export let options: Section[] = [];

	let open = false;

	const handleSelect = (currentValue: string) => {
		if (filterValues.includes(currentValue)) {
			// Remove the value if it already exists in the array
			filterValues = filterValues.filter((v) => v !== currentValue);
		} else {
			console.log(filterValues);
			// Add the value if it does not exist in the array
			filterValues = [...filterValues, currentValue];
			console.log(filterValues);
		}

		$selectedSections = filterValues.join(',');
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			class="border-dashed text-base md:text-lg px-3 py-2 h-auto"
		>
			<PlusCircled class="mr-2 w-4 h-4" />
			{title}

			{#if filterValues.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden text-sm">
					{filterValues.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#if filterValues.length > 2}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal text-sm ">
							{filterValues.length} Selected
						</Badge>
					{:else}
						{#each filterValues as option}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal text-sm ">
								{snakeCaseToTitleCase(option)}
							</Badge>
						{/each}
					{/if}
				</div>
			{/if}
		</Button>
	</Popover.Trigger>

	<Popover.Content class="w-[200px] p-0" align="start" side="bottom">
		<Command.Root>
			<Command.Input placeholder={title} class="text-base md:text-lg" />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							value={option.id}
							onSelect={(currentValue) => {
								handleSelect(currentValue);
							}}
						>
							<div
								class={cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									$selectedSections.includes(option.id)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class="w-4 h-4" />
							</div>
							<span class="text-base md:text-lg">
								{option.name}
							</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if filterValues.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center text-base md:text-lg"
						onSelect={() => {
							filterValues = [];
							$selectedSections = '';
						}}
					>
						Clear filters
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
