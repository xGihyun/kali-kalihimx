<script lang="ts">
	import { ADMIN_ROUTES, USER_ROUTES } from '$lib';
	import { Arnis } from '$lib/assets/icons';
	import type { User } from '$lib/types';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from 'radix-icons-svelte';

	export let user: User;

	const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();

	let isOpen = false;
</script>

<aside
	class={`w-72 bg-background h-full text-base md:text-lg fixed top-0 left-0 z-[500] transition-transform duration-300 lg:translate-x-0 ease-in-out ${
		isOpen ? 'translate-x-0' : '-translate-x-72'
	}`}
>
	<div class="relative flex flex-col justify-between h-full p-4">
		<button
			class="fixed top-1/2 -translate-y-1/2 -right-8 w-10 h-10 bg-primary flex items-center justify-center rounded-r-full"
			on:click={() => (isOpen = !isOpen)}
		>
			<ChevronRight
				class={`w-8 h-8 text-primary-foreground transition-transform duration-300 ease-in-out ${
					isOpen ? 'rotate-180' : 'rotate-0'
				}`}
			/>
		</button>
		<div class="flex flex-col">
			<a href="/" class="py-4 px-2 flex gap-2 items-center">
				<Arnis styles="w-10 h-10 text-red-500" />
				<h1 class="font-jost-medium text-2xl md:text-3xl">Kali Kalihim</h1>
			</a>

			{#each USER_ROUTES as route, idx (idx)}
				<a href={route.path} class="w-full flex gap-2 items-center p-4">
					<svelte:component this={route.icon} styles="w-6 h-6" />
					<span>{route.name}</span>
				</a>
			{/each}

			{#if user.role === 'admin'}
				{#each ADMIN_ROUTES as route, idx (idx)}
					<a href={route.path} class="w-full flex gap-2 items-center p-4">
						<svelte:component this={route.icon} styles="w-6 h-6" />
						<span>{route.name}</span>
					</a>
				{/each}
			{/if}
		</div>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost" class="hover:bg-slate-900 h-auto p-0">
					<div class="flex items-center gap-4 w-full p-4">
						<Avatar.Root class="w-10 h-10">
							<Avatar.Image src={user.avatar_url} alt="Avatar" />
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar.Root>
						<span class="text-base md:text-lg">{user.first_name} {user.last_name}</span>
					</div>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-64">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<form action="/logout" method="post" class="w-full">
							<button class="w-full text-left text-base md:text-lg" type="submit">Log out</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<!-- <button> -->
	<!-- </button> -->
</aside>
