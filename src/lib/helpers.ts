import { invalidate } from '$app/navigation';
import { crop } from '$lib/pkg/my_package';
import { error } from '@sveltejs/kit';
import type { Dimensions } from './types';

export async function upload(
	photo: File | null,
	type: 'avatar' | 'banner',
	{ width, height }: Dimensions
) {
	if (!photo) return;

	const ogArrayBuffer = await photo.arrayBuffer();
	const bytes = new Uint8Array(ogArrayBuffer);
	const croppedAvatar = crop(bytes, width, height);

	const formData = new FormData();

	formData.append('file', new Blob([croppedAvatar]));
	formData.append('file_name', `${photo.name.split('.')[0]}.avif`);
	formData.append('type', type);

	const response = await fetch('?/image', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		console.error('Failed to update avatar');
		throw error(500, await response.text());
	}

	await invalidate('user:images');

	console.log('Updated avatar');
}
