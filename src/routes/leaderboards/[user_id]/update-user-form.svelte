<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { UpdateUserSchema } from '$lib/schemas';
	import type { RequestStatus, Section, User } from '$lib/types';
	import { enhance } from '$app/forms';
	import { CheckCircled, CrossCircled, Reload } from 'radix-icons-svelte';
	import { snakeCaseToTitleCase } from '$lib';

	export let form: SuperValidated<typeof UpdateUserSchema>;
	export let sections: Section[];
	export let currentUserData: User;

	let requestStatus: RequestStatus = {
		type: 'none'
	};
</script>

<Form.Root {form} schema={UpdateUserSchema} let:attrs let:config>
	<form
		method="POST"
		class="space-y-4"
		action="?/update_user"
		use:enhance={() => {
			console.log('Updating...');
			requestStatus = {
				type: 'pending'
			};

			return async ({ result, update }) => {
				await update();

				if (result.type === 'success' || result.type === 'redirect') {
					console.log('Successfully updated user data.');
					requestStatus = {
						type: 'success',
						code: result.status,
						message: result.data.message
					};
				} else {
					console.error('Failed to update user data.');
					requestStatus = {
						type: 'error',
						code: result.status,
						message: result.data.message
					};
				}
			};
		}}
		{...attrs}
	>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Email</Form.Label>
				<Form.Input
					type="email"
					placeholder="name@example.com"
					class="text-base md:text-lg h-auto"
					value={currentUserData.email}
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="first_name">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">First Name</Form.Label>
				<Form.Input
					type="text"
					placeholder="Ayaka"
					class="text-base md:text-lg h-auto"
					value={currentUserData.first_name}
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="last_name">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Last Name</Form.Label>
				<Form.Input
					type="text"
					placeholder="Kamisato"
					class="text-base md:text-lg h-auto"
					value={currentUserData.last_name}
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="age">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Age</Form.Label>
				<Form.Input type="number" class="text-base md:text-lg h-auto" value={currentUserData.age} />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="contact_number">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Contact Number</Form.Label>
				<Form.Input
					type="text"
					class="text-base md:text-lg h-auto"
					value={currentUserData.contact_number}
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="score">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Score</Form.Label>
				<Form.Input
					type="number"
					class="text-base md:text-lg h-auto"
					value={currentUserData.score}
				/>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="role">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Role</Form.Label>
				<Form.Select
					selected={{
						value: currentUserData.role,
						label: snakeCaseToTitleCase(currentUserData.role)
					}}
				>
					<Form.SelectTrigger placeholder="Select a role" class="text-base md:text-lg h-auto" />
					<Form.SelectContent>
						<Form.SelectItem value="user" class="text-base md:text-lg h-auto">User</Form.SelectItem>
						<Form.SelectItem value="admin" class="text-base md:text-lg h-auto"
							>Admin</Form.SelectItem
						>
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="sex">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Sex</Form.Label>
				<Form.Select
					selected={{
						value: currentUserData.sex,
						label: currentUserData.sex <= 0 ? 'Male' : 'Female'
					}}
				>
					<Form.SelectTrigger placeholder="Select a sex" class="text-base md:text-lg h-auto" />
					<Form.SelectContent>
						<Form.SelectItem value={0} class="text-base md:text-lg h-auto">Male</Form.SelectItem>
						<Form.SelectItem value={1} class="text-base md:text-lg h-auto">Female</Form.SelectItem>
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="section">
			<Form.Item>
				<Form.Label class="text-base md:text-lg">Section</Form.Label>
				<Form.Select
					selected={{
						value: currentUserData.section,
						label: snakeCaseToTitleCase(currentUserData.section)
					}}
				>
					<Form.SelectTrigger placeholder="Select a section" class="text-base md:text-lg h-auto" />
					<Form.SelectContent>
						{#each sections as section (section.id)}
							<Form.SelectItem value={section.id} class="text-base md:text-lg h-auto"
								>{section.name}</Form.SelectItem
							>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<div class="flex justify-end w-full mt-10">
			<Form.Button
				class={`text-base md:text-lg h-auto w-full ${
					requestStatus.type === 'success'
						? 'bg-green-500 pointer-events-none'
						: requestStatus.type === 'error'
							? 'bg-red-500 hover:bg-red-600'
							: requestStatus.type === 'pending'
								? 'bg-yellow-500 pointer-events-none'
								: 'bg-primary'
				}`}
			>
				<div class="flex items-center gap-1">
					{#if requestStatus.type === 'pending'}
						<Reload class="h-5 w-5 animate-spin" />
						<span class="text-base md:text-lg">Updating...</span>
					{:else if requestStatus.type === 'success'}
						<CheckCircled class="h-5 w-5 " />
						<span class="text-base md:text-lg">Success</span>
					{:else if requestStatus.type === 'error'}
						<CrossCircled class="h-5 w-5 " />
						<span class="text-base md:text-lg">
							{requestStatus.message}
						</span>
					{:else}
						<span class="text-base md:text-lg">Update</span>
					{/if}
				</div>
			</Form.Button>
		</div>
	</form>
</Form.Root>
