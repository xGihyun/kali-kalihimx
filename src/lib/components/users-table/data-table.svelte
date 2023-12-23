<script lang="ts">
	// @ts-nocheck
	import type { Section, User } from '$lib/types';
	import { addTableFilter, addColumnFilters } from 'svelte-headless-table/plugins';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { get, readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { UserTableSectionCell, UserTableToolbar } from '.';

	export let users: User[];
	export let sections: Section[];

	console.log(sections);

	const table = createTable(readable(users), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		colFilter: addColumnFilters()
	});

	const columns = table.createColumns([
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

	const tableModel = table.createViewModel(columns);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableModel;
</script>

<div class="space-y-4">
	<UserTableToolbar {tableModel} {sections} />

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
				{#each $pageRows as row, idx (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs} class="text-base md:text-lg">
										{#if cell.id === 'Name'}
											<p>
												<span class="text-red-400 font-jost-medium">#{idx + 1}</span>
												<Render of={cell.render()} />
											</p>
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
