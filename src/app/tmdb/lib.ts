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

  static poster(path: string | null, fallback: string, size: string = "w500") {
    if (!path) return fallback;
    return `https://image.tmdb.org/t/p/${size}${path}`;
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

  static async getCredits(id: number, type: "movie" | "tv"): Promise<Result<Credits>> {
    try {
      const response = await fetch(`${TMDB.BASE}/${type}/${id}/credits`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getMovieDetails(id: number): Promise<Result<MovieDetails>> {
    try {
      const response = await fetch(`${TMDB.BASE}/movie/${id}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getTvDetails(id: number): Promise<Result<TvDetails>> {
    try {
      const response = await fetch(`${TMDB.BASE}/tv/${id}`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getVideos(id: number, type: "movie" | "tv"): Promise<Result<Videos>> {
    try {
      const response = await fetch(`${TMDB.BASE}/${type}/${id}/videos`, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      return Res.ok(json);
    } catch (error: any) {
      return Res.error(error.message);
    }
  }

  static async getTrailer(id: number, type: "movie" | "tv", fullLink: boolean = false): Promise<Result<string>> {
    try {
      const videos = await TMDB.getVideos(id, type);
      if (videos.error !== undefined) return Res.error(videos.error);

      const filtered = videos.ok.results
        .filter(video => video.site === "YouTube")
        .sort((a, b) => {
          if (a.official !== b.official) return b.official as any - (a.official as any);

          if (a.type === "Trailer" && b.type !== "Trailer") return -1;
          if (b.type === "Trailer" && a.type !== "Trailer") return 1;

          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        });

      if (filtered.length) {
        if (fullLink) return Res.ok(`https://www.youtube.com/watch?v=${filtered[0].key}`);
        else return Res.ok(filtered[0].key);
      }
      return Res.error("No trailer found");
    } catch (error: any) {
      return Res.error(error.message)
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

type Genre = {
  id: number
  name: string
}

type ProductionCompany = {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

type Network = ProductionCompany

type ProductionCountry = {
  iso_3166_1: string
  name: string
}

type SpokenLanguage = {
  english_name: string
  iso_639_1: string
  name: string
}

export type MovieDetails = {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: string
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type TvDetails = {
  adult: boolean
  backdrop_path: string | null
  created_by: {
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path: string
  }[]
  episode_run_time: number[]
  first_air_date: string
  genres: Genre[]
  homepage: string
  id: number,
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path: string
  }
  name: string
  next_episode_to_air: string
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    vote_average: number
  }[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
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

export type Credits = {
  id: number
  cast: Cast[]
  crew: Crew[]
}

type PersonBase = {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number 
  profile_path: string | null 
}

export type Person = PersonBase & {
  media_type: "person"
  known_for: (Movie | TvShow)[]
}

export type Cast = PersonBase & {
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export type Crew = PersonBase & {
  credit_id: string
  department: string
  job: string
}

export type Videos = {
  id: number
  results: Video[]
}

export type Video = {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}
