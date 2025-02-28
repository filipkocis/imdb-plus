"use server"

import { TMDB } from "@/app/tmdb/lib"

export async function getExternalTvShowIDs(id: string) {
  return TMDB.externalTvShowIDs(id)
}
