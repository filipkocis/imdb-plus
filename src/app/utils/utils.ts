export const FETCH_CACHE_OPTIONS: RequestInit = {
  next: {
    revalidate: 60 * 60 * 24 // 24 hours 
  }
}
