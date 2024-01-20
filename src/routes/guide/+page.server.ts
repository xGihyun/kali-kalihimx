import type { PageServerLoad } from './$types';

// export const prerender = true;
export const csr = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'max-age=3600' });
};
