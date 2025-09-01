import "server-only";
import { Adapter, Low } from "lowdb";
import { gzipSync, gunzipSync } from "zlib";
import fs, { PathLike } from "fs";

export type Wizard = {
  id: number;
  name: string;
  sigil: string;
  bond: string;
  watchlist: Entry[];
  played: Entry[];
  finished: Entry[];
};

export type Entry = {
  id: number;
  imdbId: string | null;
  name: string;
  date: number;
} & (
  | { type: "movie" }
  | {
      type: "tv";
      seasons: EntrySeason[];
    }
);

type EntrySeason = { season: number; episodes: EntryEpisode[] };
type EntryEpisode = { episode: number; date: number };

async function saveCompressed(path: PathLike, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const compressed = gzipSync(json);
  await fs.promises.writeFile(path, compressed);
}

async function loadCompressed<T>(path: PathLike): Promise<T | null> {
  const compressed = await fs.promises.readFile(path);
  if (compressed.length === 0) return null;
  const json = gunzipSync(compressed).toString();
  return JSON.parse(json);
}

export class GzipAdapter<T> implements Adapter<T> {
  #filename: PathLike;
  #defaultData: T;
  constructor(filename: PathLike, defaultData: T) {
    this.#filename = filename;
    this.#defaultData = defaultData;
  }

  async read(): Promise<T> {
    try {
      const json = await loadCompressed<T>(this.#filename);
      return json || this.#defaultData;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT")
        return this.#defaultData;
      console.error("Error reading database:", e);
      throw "Error reading database";
    }
  }

  async write(data: T) {
    try {
      await saveCompressed(this.#filename, data);
    } catch (e) {
      console.error("Error writing to database:", e);
    }
  }
}

const adapter = new GzipAdapter<Wizard[]>("db.json.gz", []);
export const db = new Low<Wizard[]>(adapter, []);
