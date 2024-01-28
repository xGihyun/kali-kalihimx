import { invalidate } from '$app/navigation';
import { crop } from '$lib/pkg/my_package';
import type { Dimensions, Result } from './types';

export async function upload(
	photo: File | null,
	type: 'avatar' | 'banner',
	{ width, height }: Dimensions
) {
	if (!photo) {
		return {
			success: false,
			message: 'File not found.',
			code: 404
		};
	}

	const ogArrayBuffer = await photo.arrayBuffer();
	const bytes = new Uint8Array(ogArrayBuffer);
	const croppedAvatar = crop(bytes, width, height);

	const formData = new FormData();

	formData.append('file', new Blob([croppedAvatar]));
	formData.append('file_name', `${photo.name.split('.')[0]}.avif`);
	formData.append('type', type);

	console.log(formData);

	const response = await fetch('?/image', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		console.error('Failed to update image.');

		return {
			success: false,
			message: 'Failed to update image.',
			code: response.status
		};
	}

	await invalidate('user:images');

	console.log('Successfully updated image.');

	return {
		success: true,
		message: 'Successfully updated image.',
		code: response.status
	};
}

export function isResult(obj: any): obj is Result {
	return obj && typeof obj === 'object' && 'success' in obj;
}
