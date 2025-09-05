"use server";

import { Res, Result } from "@/app/tmdb/lib";
import { hasMagicBook } from "./server";

export type MovieResponse = {
  status: string;
  status_message: string;
  data: {
    movie: Movie;
  };
};

export type Movie = {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  like_count: number;
  description_intro: string;
  description_full: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  torrents: Torrent[];
  date_uploaded: string;
  date_uploaded_unix: number;
};

export type Torrent = {
  magnet: string;
  url: string;
  hash: string;
  quality: string;
  type: string;
  is_repack: string;
  video_codec: string;
  bit_depth: string;
  audio_channels: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
};

const API_URL = "";
const TRACKERS: string[] = [
  // What did you expect? These trackers are hidden from muggles ;)
];

function encodedTrackers() {
  return TRACKERS.map((tracker) => `tr=${encodeURIComponent(tracker)}`).join(
    "&",
  );
}

export async function getMovie(id: string): Promise<Result<Movie>> {
  if (!(await hasMagicBook())) return Res.error("Wizardry is required");

  try {
    const result = await fetch(`${API_URL}/movie_details.json?imdb_id=${id}`);
    const json: MovieResponse = await result.json();
    if (
      !json?.data?.movie ||
      json.status !== "ok" ||
      json.data.movie.imdb_code !== id
    ) {
      return Res.error("Movie not found");
    }
    const movie: Movie = json.data.movie;
    movie.torrents = movie.torrents.map((torrent) => {
      const trackers = encodedTrackers();
      const magnet = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(movie.title)}&${trackers}&xl=${torrent.size_bytes}`;
      return { ...torrent, magnet };
    });
    return Res.ok(movie);
  } catch {
    return Res.error("Failed to fetch movie data");
  }
}
