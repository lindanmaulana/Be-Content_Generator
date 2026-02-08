import { PaginationQuery } from '../schemas/pagination.schema';

export const DEFAULT_PAGINATION: { page: number; limit: number } = {
	page: 1,
	limit: 5,
};

export interface Pagination {
	page: number;
	limit: number;
	total_count: number;
	total_page: number;
	current_page: number;
	next_page: number | null;
	prev_page: number | null;
	links: number[];
}

export const calculatePagination = (totalCount: number, { page, limit }: PaginationQuery): Pagination => {
	let totalPage: number = 1;
	let links: number[] = [1];
	let nextPage: number | null = null;
	let prevPage: number | null = null;

	let pageDefault: number = DEFAULT_PAGINATION.page;
	let limitDefault: number = DEFAULT_PAGINATION.limit;

	if (page) pageDefault = Number(page);
	if (limit && limit <= 20) limitDefault = Number(limit);

	const currentPage: number = pageDefault;

	totalPage = Math.ceil(totalCount / limitDefault);
	nextPage = pageDefault > 0 && pageDefault < totalPage ? pageDefault + 1 : null;
	prevPage = pageDefault > 1 ? pageDefault - 1 : null;
	links = Array.from({ length: totalPage }, (_, index) => index + 1);

	return {
		page: pageDefault,
		limit: limitDefault,
		total_count: totalCount,
		total_page: totalPage,
		current_page: currentPage,
		next_page: nextPage,
		prev_page: prevPage,
		links: links,
	};
};
