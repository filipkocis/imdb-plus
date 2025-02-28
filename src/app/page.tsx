import { Button } from "@/components/ui/button";
import { PageWrapper } from "./components/wrapper/PageWrapper";
import TrendingSmallResults from "./components/wrapper/TrendingSmallResults";
import { Res, TMDB } from "./tmdb/lib";
import Slider from "./components/home/Slider";

export default async function Home() {
  const genresResult = await TMDB.listGenres("movie");
  const popularResult = await TMDB.getMovieLists("popularity");
  if (Res.isError(genresResult) || Res.isError(popularResult)) return null;

  const movieResult = await TMDB.getTrendingMovies("week");
  const tvResult = await TMDB.getTrendingTV("week");

  return (
    <PageWrapper className="grid-rows-[auto] gap-20">
      <div className="grid grid-cols-3 gap-8">
        <Slider movies={popularResult.ok.results} genres={genresResult.ok} className="col-start-1 col-end-3 aspect-video">

        </Slider>
        <div className="rounded-xl bg-secondary">

        </div>
      </div>

      <TrendingSmallResults result={movieResult} href="/trending/?t=movie" title="Trending Movies" /> 
      <TrendingSmallResults result={tvResult} href="/trending/?t=tv" title="Trending TV Shows" /> 
    </PageWrapper>
  );
}


