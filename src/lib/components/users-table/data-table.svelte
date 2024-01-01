<script lang="ts">
	// @ts-nocheck
	import type { Section, User } from '$lib/types';
	import { addTableFilter, addColumnFilters, addSelectedRows } from 'svelte-headless-table/plugins';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { get, readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { UserTableSectionCell, UserTableToolbar, UserTableCheckbox } from '.';
	import { Button } from '$lib/components/ui/button';
	import { DeleteSectionsSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let users: User[];
	export let sections: Section[];
	export let total: number;
	export let skip: number;
	export let filteredSections: string | null;
	export let form: SuperValidated<typeof DeleteSectionsSchema>;
	export let currentUser: User | undefined;

	$: pageSize = 5;
	$: currentPage = skip / pageSize;
	$: totalPages = Math.ceil(total / pageSize);
	$: hasPreviousPage = pageSize * currentPage < 1;
	$: hasNextPage = currentPage + 1 >= totalPages;

	const table = createTable(readable(users), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		colFilter: addColumnFilters(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(UserTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(UserTableCheckbox, {
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
			accessor: ({ first_name, last_name }) => `${first_name} ${last_name}`,
			header: 'Name',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'section',
			header: 'Section',
			cell: ({ value }) => {
				return createRender(UserTableSectionCell, {
					sections,
					value
				});
			},
			plugins: {
				colFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					}
				}
			}
		}),
		table.column({
			accessor: 'score',
			header: 'Rating',
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const tableModel = table.createViewModel(
		currentUser.role === 'admin' ? columns : columns.slice(1)
	);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } = tableModel;
	const selectedDataIds = currentUser.role === 'admin' ? pluginStates.select.selectedDataIds : null;
</script>

<div class="space-y-4">
	<UserTableToolbar {tableModel} {sections} {form} {selectedDataIds} {users} {currentUser} />

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
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								{@const user = cell.row.original}

								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs} class="text-base md:text-lg">
										{#if cell.id === 'Name'}
											<span class="text-red-500 font-jost-medium">#{user.rank_overall}</span>
											<a href={`/leaderboards/${user.id}`} class="hover:underline">
												<Render of={cell.render()} />
											</a>
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

	<div class="flex items-center justify-between">
		{#if currentUser.role === 'admin'}
			<div class="flex-1 text-sm text-muted-foreground">
				{Object.keys($selectedDataIds).length} of{' '}
				{$rows.length} row(s) selected.
			</div>
		{/if}
		<div
			class={`flex items-center justify-end space-x-2 py-4 ${
				currentUser.role !== 'admin' ? 'w-full' : 'w-auto'
			}`}
		>
			<Button
				variant="outline"
				size="sm"
				on:click={() => {
					currentPage -= 1;
				}}
				disabled={hasPreviousPage || filteredSections}
			>
				<a href={`/leaderboards?limit=${pageSize}&skip=${pageSize * currentPage}`}>Previous</a>
			</Button>
			<Button
				variant="outline"
				size="sm"
				disabled={hasNextPage || filteredSections}
				on:click={() => {
					currentPage += 1;
				}}
			>
				<a href={`/leaderboards?limit=${pageSize}&skip=${pageSize * currentPage}`}>Next</a>
			</Button>
		</div>
	</div>
</div>
