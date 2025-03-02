import { PageWrapper } from "./components/wrapper/PageWrapper";
import { Res, TMDB } from "./tmdb/lib";
import Slider from "./components/home/Slider";
import HomepageSmallResults from "./components/wrapper/HomepageSmallResults";

export default async function Home() {
  const genresResult = await TMDB.listGenres("movie");
  const popularResult = await TMDB.getMovieLists("popularity");
  if (Res.isError(genresResult) || Res.isError(popularResult)) return null;

  const trendingMovieResult = await TMDB.getTrendingMovies("week");
  const trendingTvResult = await TMDB.getTrendingTV("week");

  const topMovieResult = await TMDB.getMovieLists("rating");
  const topTvResult = await TMDB.getTvLists("rating");

  return (
    <PageWrapper className="grid-rows-[auto] gap-20">
      <div className="flex flex-col gap-16 lg:grid lg:grid-cols-3 lg:gap-8">
        <Slider movies={popularResult.ok.results} genres={genresResult.ok.genres} className="col-start-1 col-end-3 aspect-video">

        </Slider>
        <div className="rounded-xl bg-secondary min-h-[300px]">

        </div>
      </div>

      <HomepageSmallResults result={trendingMovieResult} href="/trending/?t=movie" title="Trending Movies" /> 
      <HomepageSmallResults result={trendingTvResult} href="/trending/?t=tv" title="Trending TV Shows" /> 
      <HomepageSmallResults result={topMovieResult} href="/movie/?f=rating" title="Top Rated Movies" /> 
      <HomepageSmallResults result={topTvResult} href="/tv/?f=rating" title="Top Rated Series" /> 
    </PageWrapper>
  );
}


