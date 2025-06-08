// src/core/interfaces/pagination.interface.ts
/**
 * Interface for a paginated result from a database query.
 */
export interface IPaginatedResult<T> {
	data: T[];
	meta: {
	  total: number;
	  lastPage: number;
	  currentPage: number;
	  perPage: number;
	};
  }