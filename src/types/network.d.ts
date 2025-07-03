export interface Pagination {
  page?: number
  limit?: number
}

export interface List<T> {
  total: number
  list: T[]
}
