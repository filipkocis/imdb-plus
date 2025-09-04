import { env } from "process";
import { FETCH_CACHE_OPTIONS } from "../utils/utils";

export class TMDB {
  private static API = env.TMDB_API;
  private static BASE = 'https://api.themoviedb.org/3'

  private static options(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): RequestInit {
    return {
      method,
      headers: {
        Authorization: `Bearer ${TMDB.API}`,
        Accept: 'application/json',
      },
      ...FETCH_CACHE_OPTIONS
    };
  }

  static async discover(type: "movie" | "tv", sort: string | null, timeWindow: [string, string] | null, genres: string | null, page: number = 1): Promise<Result<Paginated<SearchResult>>> {
    let endpoint = `${TMDB.BASE}/discover/${type}?include_adult=false`
    if (sort) endpoint += `&sort_by=${sort}`;
    if (timeWindow) {
      const param = type === "movie" ? "primary_release_date" : "first_air_date";
      endpoint += `&${param}.gte=${timeWindow[0]}&${param}.lte=${timeWindow[1]}`;
    }
    if (genres) endpoint += `&with_genres=${genres}`;
    if (page) endpoint += `&page=${page}`;

    return TMDB.fetch(endpoint, json => {
      for (const media of json.results) {
        media.media_type = type;
      }
    })
  }

  static async getSeasonDetails(series_id: number, season_number: number): Promise<Result<SeasonDetails>> {
    return TMDB.fetch(`${TMDB.BASE}/tv/${series_id}/season/${season_number}`)
  }

  static async listGenres(type: "movie" | "tv"): Promise<Result<Genres>> {
    return TMDB.fetch(`${TMDB.BASE}/genre/${type}/list`)
  }

  static async listAllGenres(): Promise<Result<Genre[]>> {
    try {
      const movieGenres = await TMDB.listGenres("movie");
      const tvGenres = await TMDB.listGenres("tv");

      if (movieGenres.error !== undefined || tvGenres.error !== undefined) {
        return Res.error(movieGenres.error || tvGenres.error || "An error occurred");
      }
      
      const genres = movieGenres.ok.genres.concat(tvGenres.ok.genres)
        .filter((genre, index, self) => self.findIndex(g => g.id === genre.id) === index); 

      return Res.ok(genres)
    } catch (error) {
      if (error instanceof Error) {
        return Res.error(error.message);
      } else {
        return Res.error("An error occurred");
      }
    }
  }

  static async externalIDs(id: number, type: 'movie' | 'tv'): Promise<Result<TvShowIDs | MovieIDs>> {
    return TMDB.fetch(`${TMDB.BASE}/${type}/${id}/external_ids`)
  }

  static poster(path: string | null, fallback: string, size: string = "w500") {
    if (!path) return fallback;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  static async search(query: string, page: number = 1): Promise<Result<Paginated<SearchResult>>> {
    query = encodeURIComponent(query);
    return TMDB.fetch(`${TMDB.BASE}/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`)
  }

  static async getTrending(type: "movie" | "tv" | "person" | "all", time: "day" | "week", page: number = 1): Promise<Result<Paginated<SearchResult>>> {
    return TMDB.fetch(`${TMDB.BASE}/trending/${type}/${time}?page=${page}`)
  }

  static async getTrendingMovies(time: "day" | "week", page: number = 1): Promise<Result<Paginated<Movie>>> {
    return TMDB.fetch(`${TMDB.BASE}/trending/movie/${time}?page=${page}`)
  }

  static async getTrendingTV(time: "day" | "week", page: number = 1): Promise<Result<Paginated<TvShow>>> {
    return TMDB.fetch(`${TMDB.BASE}/trending/tv/${time}?page=${page}`)
  }

  public static MOVIE_LISTS = ["popularity", "rating", "playing", "upcoming"] as const;
  static async getMovieLists(type: typeof TMDB.MOVIE_LISTS[number], page: number = 1): Promise<Result<Paginated<Movie>>> {
    const endpoint = 
      type === "popularity" ? "popular" :
      type === "rating" ? "top_rated" :
      type === "playing" ? "now_playing" :
      "upcoming";

    return TMDB.fetch(`${TMDB.BASE}/movie/${endpoint}?page=${page}`, json => {
      for (const movie of json.results) {
        movie.media_type = "movie";
      }
    })
  }

  public static TV_LISTS = ["popularity", "rating", "airing", "on_air"] as const;
  static async getTvLists(type: typeof TMDB.TV_LISTS[number], page: number = 1): Promise<Result<Paginated<TvShow>>> {
    const endpoint = 
      type === "popularity" ? "popular" :
      type === "rating" ? "top_rated" :
      type === "airing" ? "airing_today" :
      "on_the_air";

    return TMDB.fetch(`${TMDB.BASE}/tv/${endpoint}?page=${page}`, json => {
      for (const tv of json.results) {
        tv.media_type = "tv";
      }
    })
  }

  static async getCredits(id: number, type: "movie" | "tv"): Promise<Result<Credits>> {
    return TMDB.fetch(`${TMDB.BASE}/${type}/${id}/credits`)
  }

  static async getMovieDetails(id: number): Promise<Result<MovieDetails>> {
    return TMDB.fetch(`${TMDB.BASE}/movie/${id}`)
  }

  static async getTvDetails(id: number): Promise<Result<TvDetails>> {
    return TMDB.fetch(`${TMDB.BASE}/tv/${id}`)
  }

  static async getVideos(id: number, type: "movie" | "tv"): Promise<Result<Videos>> {
    return TMDB.fetch(`${TMDB.BASE}/${type}/${id}/videos`)
  }

  static async getTrailer(id: number, type: "movie" | "tv", fullLink: boolean = false): Promise<Result<{ name: string, link: string}>> {
    try {
      const videos = await TMDB.getVideos(id, type);
      if (videos.error !== undefined) return Res.error(videos.error);

      const filtered = videos.ok.results
        .filter(video => video.site === "YouTube")
        .sort((a, b) => {
          if (a.official !== b.official) return (b.official as unknown as number) - (a.official as unknown as number);

          if (a.type === "Trailer" && b.type !== "Trailer") return -1;
          if (b.type === "Trailer" && a.type !== "Trailer") return 1;

          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        });

      if (filtered.length) {
        const response = { name: filtered[0].name, link: filtered[0].key}
        if (fullLink) {
          response.link = `https://www.youtube.com/watch?v=${filtered[0].key}`
        }
        return Res.ok(response);
      }
      return Res.error("No trailer found");
    } catch (error) {
      if (error instanceof Error) {
        return Res.error(error.message);
      } else {
        return Res.error("An error occurred");
      }
    }
  }

  static async getRecommendations(id: number, type: "movie" | "tv", page: number = 1): Promise<Result<Paginated<Movie | TvShow>>> {
    return TMDB.fetch(`${TMDB.BASE}/${type}/${id}/recommendations?page=${page}`)
  }

  static async getSimilar(id: number, type: "movie" | "tv", page: number = 1): Promise<Result<Paginated<Movie | TvShow>>> {
    return TMDB.fetch(`${TMDB.BASE}/${type}/${id}/similar?page=${page}`, json => {
      for (const media of json.results) {
        media.media_type = type;
      }
    })
  }

  static async fetch<T>(input: string, fn?: (json: T) => void): Promise<Result<T>> {
    try {
      const response = await fetch(input, TMDB.options('GET'))  
      const json = await response.json();
      if (json.success === false) throw new Error(json.status_message);
      if (fn) fn(json);
      return Res.ok(json);
    } catch (error) {
      if (error instanceof Error) {
        return Res.error(error.message);
      } else {
        return Res.error("An error occurred");
      }
    }
  }
}

export type SearchResult = Movie | TvShow | Person | Collection

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

export type Genres = {
  genres: Genre[]
}

export type Genre = {
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
  belongs_to_collection: string | null
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string | null
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
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
  last_air_date: string | null
  last_episode_to_air: EpisodeBase | null
  name: string
  next_episode_to_air: EpisodeBase | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: (SeasonBase & {
    episode_count: number
  })[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

export type SeasonBase = {
  air_date: string
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export type SeasonDetails = SeasonBase & {
  _id: string
  episodes: EpisodeBase[]
}

export type EpisodeBase = {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

export type Episode = EpisodeBase & {
  crew: Crew[]
  guest_stars: GuestStar[]
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

export type Collection = {
  media_type: "collection"
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
};

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

  public static isOk<T>(result: Result<T>): result is Result<T> & { ok: NonNullable<T> } {
    return result.ok !== undefined;
  }

  public static isError<T>(result: Result<T>): result is Result<T> & { error: string } {
    return result.error !== undefined;
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

export type GuestStar = PersonBase & {
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

export type TvShowIDs = {
  id: number
  imdb_id: string | null
  freebase_mid: string | null
  freebase_id: string | null
  tvdb_id: number
  tvrage_id: number
  wikidata_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
}

export type MovieIDs = {
  id: number
  imdb_id: string | null
  wikidata_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
}
