import { env } from "process";

export class TMDB {
  private static API = env.TMDB_API;
  private static BASE = 'https://api.themoviedb.org/3'

  private static options(method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
    return {
      method,
      headers: {
        Authorization: `Bearer ${TMDB.API}`,
        Accept: 'application/json',
      },
    };
  }

  static poster(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  static async search(query: string, page: number = 1): Promise<Result<Paginated<SearchResult>>> {
    try {
      query = encodeURIComponent(query);
      const response = await fetch(`${TMDB.BASE}/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`, TMDB.options('GET'));
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);

      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getTrendingMovies(time: "day" | "week", page: number = 1): Promise<Result<Paginated<Movie>>> {
    try {
      const response = await fetch(`${TMDB.BASE}/trending/movie/${time}?page=${page}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);

      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getTrendingTV(time: "day" | "week", page: number = 1): Promise<Result<Paginated<TvShow>>> {
    try {
      const response = await fetch(`${TMDB.BASE}/trending/tv/${time}?page=${page}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);

      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  public static MOVIE_LISTS = ["popularity", "rating", "playing", "upcoming"] as const;
  static async getMovieLists(type: typeof TMDB.MOVIE_LISTS[number], page: number = 1): Promise<Result<Paginated<Movie>>> {
    const endpoint = 
      type === "popularity" ? "popular" :
      type === "rating" ? "top_rated" :
      type === "playing" ? "now_playing" :
      "upcoming";

    try {
      const response = await fetch(`${TMDB.BASE}/movie/${endpoint}?page=${page}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);

      for (const movie of json.results) {
        movie.media_type = "movie";
      }

      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  public static TV_LISTS = ["popularity", "rating", "airing", "on_air"] as const;
  static async getTvLists(type: typeof TMDB.TV_LISTS[number], page: number = 1): Promise<Result<Paginated<TvShow>>> {
    const endpoint = 
      type === "popularity" ? "popular" :
      type === "rating" ? "top_rated" :
      type === "airing" ? "airing_today" :
      "on_the_air";

    try {
      const response = await fetch(`${TMDB.BASE}/tv/${endpoint}?page=${page}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      
      for (const tv of json.results) {
        tv.media_type = "tv";
      }

      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }
}

export type SearchResult = Movie | TvShow | Person

export type Movie = {
  media_type: "movie"
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type TvShow = {
  media_type: "tv"
  adult: boolean
  backdrop_path: string | null
  first_air_date: string
  genre_ids: number[]
  id: number
  name: string
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  vote_average: number
  vote_count: number
}

export type Person = {
  adult: boolean
  gender: number
  id: number
  known_for: (Movie | TvShow)[]
  known_for_department: string
  media_type: "person"
  name: string
  original_name: string
  popularity: number 
  profile_path: string | null 
}

export type Paginated<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export class Res {
  static ok<T>(ok: NonNullable<T>): Result<T> {
    return { ok, error: undefined };
  }

  static error(error: string) {
    return { ok: undefined, error };
  }
}

export type Result<T> = {
  ok: NonNullable<T>
  error: undefined
} | {
  ok: undefined
  error: string
}
