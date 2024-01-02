<script lang="ts">
	// @ts-nocheck
	import type { Section, User } from '$lib/types';
	import {
		addTableFilter,
		addColumnFilters,
		addSelectedRows,
		addSortBy
	} from 'svelte-headless-table/plugins';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { get, readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { UserTableSectionCell, UserTableToolbar, UserTableCheckbox } from '.';
	import { Button } from '$lib/components/ui/button';
	import { DeleteSectionsSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-svelte';

	export let users: User[];
	export let sections: Section[];
	export let total: number;
	export let skip: number;
	export let filteredSections: string | null;
	export let form: SuperValidated<typeof DeleteSectionsSchema>;
	export let currentUser: User | undefined;

	$: pageSize = 50;
	$: currentPage = skip / pageSize;
	$: totalPages = Math.ceil(total / pageSize);
	$: hasPreviousPage = pageSize * currentPage < 1;
	$: hasNextPage = currentPage + 1 >= totalPages;

	$: table = createTable(readable(users), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		colFilter: addColumnFilters(),
		select: addSelectedRows(),
		sort: addSortBy()
	});

	$: columns = table.createColumns([
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
				},
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'first_name',
			header: 'First Name'
		}),
		table.column({
			accessor: 'last_name',
			header: 'Last Name'
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
				},
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'score',
			header: 'Rating',
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		})
	]);

	$: tableModel = table.createViewModel(currentUser.role === 'admin' ? columns : columns.slice(1));
	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } = tableModel);
	$: selectedDataIds = currentUser.role === 'admin' ? pluginStates.select.selectedDataIds : null;

	$: lastNameSort = 0;
</script>

<div class="space-y-4">
	<UserTableToolbar {tableModel} {sections} {form} {selectedDataIds} {users} {currentUser} />

	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2">
			<div class={`w-4 h-4 rounded-full ml-1 bg-blue-500`}></div>
			<span>Male</span>
		</div>
		<div class="flex items-center gap-2">
			<div class={`w-4 h-4 rounded-full ml-1 bg-pink-500`}></div>
			<span>Female</span>
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-sm sm:text-base md:text-lg">
										{#if cell.id === 'last_name'}
											<Button
												variant="ghost"
												on:click={(e) => {
													props.sort.toggle(e);

													if (lastNameSort + 1 === 3) {
														lastNameSort = 0;
													} else {
														lastNameSort += 1;
													}
												}}
												class="text-sm sm:text-base md:text-lg"
											>
												<Render of={cell.render()} />
												{#if lastNameSort === 0}
													<ArrowUpDown class={'ml-2 h-5 w-5'} />
												{:else if lastNameSort % 2 !== 0}
													<ArrowUp class={'ml-2 h-5 w-5'} />
												{:else}
													<ArrowDown class={'ml-2 h-5 w-5'} />
												{/if}
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
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
									<Table.Cell {...attrs} class="text-sm sm:text-base md:text-lg">
										{#if cell.id === 'first_name'}
											<div class="flex items-center gap-1">
												<!-- <span class="text-red-500 font-jost-medium">#{user.rank_overall}</span> -->
												<span
													class={`${
														user.sex === 0 ? 'text-blue-500' : 'text-pink-500'
													} font-jost-medium`}>#{user.rank_overall}</span
												>
												<a href={`/leaderboards/${user.id}`} class="hover:underline">
													<Render of={cell.render()} />
												</a>
												<!-- <div -->
												<!-- 	class={`w-2 h-2 rounded-full ml-1 ${ -->
												<!-- 		user.sex === 0 ? 'bg-blue-500' : 'bg-pink-500' -->
												<!-- 	}`} -->
												<!-- ></div> -->
											</div>
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
