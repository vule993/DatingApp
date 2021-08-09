export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  result: T; //namenjeno za niz Member-a ali ovako je genericki
  pagination: Pagination;
}
