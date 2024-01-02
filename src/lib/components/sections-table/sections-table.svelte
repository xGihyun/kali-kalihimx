<script lang="ts">
	import type { RequestStatus, Section } from '$lib/types';
	import { readable } from 'svelte/store';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import { SectionsTableCheckbox } from '.';
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { addTableFilter, addSelectedRows } from 'svelte-headless-table/plugins';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { PlusCircle, Trash2 } from 'lucide-svelte';
	import { invalidate } from '$app/navigation';
	import { titleCaseToSnakeCase } from '$lib';

	export let sections: Section[];

	$: table = createTable(readable(sections), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(SectionsTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(SectionsTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Section'
		}),
		table.column({
			accessor: 'user_count',
			header: 'Current Count'
		}),
		table.column({
			accessor: 'user_limit',
			header: 'Max Users'
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } =
		table.createViewModel(columns));
	$: ({ filterValue } = pluginStates.filter);
	$: ({ selectedDataIds } = pluginStates.select);

	// For new sections
	let sectionName: string;
	let userLimit: number;

	let addStatus: RequestStatus = {
		type: 'none'
	};

	let deleteStatus: RequestStatus = {
		type: 'none'
	};

	async function addSection() {
		addStatus.type = 'pending';

		const response = await fetch('/api/sections', {
			method: 'POST',
			body: JSON.stringify({
				name: sectionName,
				user_limit: userLimit
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			addStatus.type = 'error';
			console.error('Failed to add section: ', response.statusText);

			return;
		}

		sections.push({
			id: titleCaseToSnakeCase(sectionName) || '',
			name: sectionName,
			user_limit: userLimit,
			user_count: 0
		});

		sections = sections;

		addStatus.type = 'success';

		console.log('Successfully added section.');
	}

	async function deleteSections() {
		deleteStatus.type = 'pending';

		const indices: string[] = Object.keys($selectedDataIds);

		let sectionsToDelete: string[] = [];

		indices.forEach((idx) => {
			const i = Number(idx);

			sectionsToDelete.push(sections[i].id);
		});

		// const q = sectionsToDelete.join(',');
		//
		// console.log(q);

		const response = await fetch('/api/sections', {
			method: 'DELETE',
			body: JSON.stringify(sectionsToDelete),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			deleteStatus.type = 'error';
			console.error('Failed to remove section: ', response.statusText);

			return;
		}

		sections.filter((section) => !sectionsToDelete.includes(section.id));
		sections = sections;

		console.log(sectionsToDelete);
		console.log(sections);

		invalidate('sections:table');

		deleteStatus.type = 'success';

		console.log('Successfully deleted section.');
	}
</script>

<div>
	<div class="flex items-center py-4 justify-between">
		<Input
			class="max-w-sm h-auto text-base md:text-lg"
			placeholder="Filter sections..."
			type="text"
			bind:value={$filterValue}
		/>

		<div class="flex items-center gap-2">
			<Button
				disabled={Object.keys($selectedDataIds).length < 1 || deleteStatus.type === 'pending'}
				on:click={deleteSections}
				variant="destructive"
				class={` h-auto ${
					deleteStatus.type === 'success' && Object.keys($selectedDataIds).length < 1
						? 'bg-green-500 pointer-events-none'
						: deleteStatus.type === 'error'
							? 'bg-red-500 hover:bg-red-600'
							: deleteStatus.type === 'pending'
								? 'bg-yellow-500 pointer-events-none'
								: 'bg-destructive'
				}`}
			>
				<div class="flex items-center gap-1">
					{#if deleteStatus.type === 'pending'}
						<Reload class="h-5 w-5 animate-spin text-primary-foreground" />
						<span class="text-base md:text-lg">Deleting...</span>
					{:else if deleteStatus.type === 'success' && Object.keys($selectedDataIds).length < 1}
						<CheckCircled class="h-5 w-5 text-primary-foreground" />
						<span class="text-base md:text-lg text-primary-foreground">Success</span>
					{:else if deleteStatus.type === 'error'}
						<CrossCircled class="h-5 w-5 text-primary-foreground" />
						<span class="text-base md:text-lg text-primary-foreground"> Error </span>
					{:else}
						<Trash2 class="h-5 w-5" />
						<span class="text-base md:text-lg">Delete</span>
					{/if}
				</div>
			</Button>

			<Popover.Root>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} class="h-auto flex gap-1 items-center">
						<PlusCircle class="w-5 h-5" />
						<span class="text-base md:text-lg">New</span>
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-80">
					<div class="grid gap-4">
						<div class="space-y-2">
							<h4 class="font-medium leading-none">Sections</h4>
							<p class="text-sm text-muted-foreground">Add a new section and set a user limit.</p>
						</div>
						<form on:submit={addSection} class="contents">
							<div class="grid gap-2">
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="name">Name</Label>
									<Input
										id="name"
										class="col-span-2 h-8"
										placeholder="e.g. Agatha of Sicily"
										type="text"
										bind:value={sectionName}
										required
									/>
								</div>
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="user_limit">Max Users</Label>
									<Input
										id="user_limit"
										class="col-span-2 h-8"
										type="number"
										bind:value={userLimit}
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={addStatus.type === 'pending'}
								class={` h-auto ${
									addStatus.type === 'success'
										? 'bg-green-500 pointer-events-none'
										: addStatus.type === 'error'
											? 'bg-red-500 hover:bg-red-600'
											: addStatus.type === 'pending'
												? 'bg-yellow-500 pointer-events-none'
												: 'bg-primary'
								}`}
							>
								<div class="flex items-center gap-1">
									{#if addStatus.type === 'pending'}
										<Reload class="h-5 w-5 animate-spin" />
										<span class="text-base md:text-lg">Adding...</span>
									{:else if addStatus.type === 'success'}
										<CheckCircled class="h-5 w-5" />
										<span class="text-base md:text-lg">Success</span>
									{:else if addStatus.type === 'error'}
										<CrossCircled class="h-5 w-5" />
										<span class="text-base md:text-lg"> Error </span>
									{:else}
										<PlusCircle class="h-5 w-5" />
										<span class="text-base md:text-lg">Add</span>
									{/if}
								</div>
							</Button>
						</form>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs} class="text-base md:text-lg">
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} class="text-base md:text-lg">
							{#each row.cells as cell (cell.id)}
								{@const section = cell.row.original}

								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'user_count'}
											<span
												class={section.user_count > section.user_limit
													? 'text-red-500 font-jost-medium'
													: ''}
											>
												<Render of={cell.render()} />
											</span>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<div class="flex-1 text-sm text-muted-foreground mt-5">
	{Object.keys($selectedDataIds).length} of{' '}
	{$rows.length} row(s) selected.
</div>
