"use server"

import { FETCH_CACHE_OPTIONS } from "@/app/utils/utils";
import * as cheerio from "cheerio";

export async function getImdbRating(id: string) {
  try {
    // const response = await fetch(`https://corsproxy.io/?url=https://www.imdb.com/title/${id}/ratings/`)
    const response = await fetch(`https://www.imdb.com/title/${id}/ratings/`, FETCH_CACHE_OPTIONS)
    const htmlText = await response.text()

    const $ = cheerio.load(htmlText);  
    const rating = $('main > div > section > div > section > div > div:first > section:first > div:eq(1) > div:eq(1) > div:first > div:eq(1) > div:eq(1) > div:first > span:first').text();

    if (!rating.length) return null;
    const value = Number(rating)
    if (isNaN(value)) return null;

    return value
  } catch (error) {
    console.error(error)
    return null
  }
}
