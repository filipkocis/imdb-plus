import { PageWrapper } from "./components/wrapper/PageWrapper";
import TrendingSmallResults from "./components/wrapper/TrendingSmallResults";
import { TMDB } from "./tmdb/lib";

export default async function Home() {
  const movieResult = await TMDB.getTrendingMovies("week", 1);
  const tvResult = await TMDB.getTrendingTV("week", 1);

  return (
    <PageWrapper className="grid-rows-[auto] gap-20">
      <TrendingSmallResults result={movieResult} href="/trending/?t=movie" title="Trending Movies" /> 
      <TrendingSmallResults result={tvResult} href="/trending/?t=tv" title="Trending TV Shows" /> 
    </PageWrapper>
  );
}


