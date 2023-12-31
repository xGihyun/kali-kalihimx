import type { PageLoad } from './$types';

export const load: PageLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': `max-age=0, s-maxage=${60 * 60 * 24 * 7}` });
};
