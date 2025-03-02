import BlocksWrapper from "@/app/components/wrapper/BlocksWrapper";
import ErrorDiv from "@/app/components/ErrorDiv";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import ResultBlock from "@/app/components/result/ResultBlock";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import { Genre, Res, TMDB } from "@/app/tmdb/lib";
import PageSelect from "../components/PageSelect";

function getTimeWindow(timeWindow?: string | string[]): [string, string] | null {
  if (!timeWindow || !timeWindow.length) return null;
  timeWindow = timeWindow + "";
  
  const parts = timeWindow.split('--');
  if (parts.length !== 2) return null;

  return [parts[0], parts[1]]
}

function getSorting(sort?: string | string[]) {
  if (!sort || !sort.length) return null;

  sort = sort + "";
  if (!sort) sort = "popularity";
  else if (sort === "release") sort = "primary_release_date";
  else if (sort === "rating") sort = "vote_average"; 
  else if (sort === "votes") sort = "vote_count"; 

  if (!sort.includes('.')) sort += '.desc';
  return sort;
}

function getType(type?: string | string[]) {
  if (!type || !type.length) return 'movie';
  if (type === 'movie') return 'movie'
  else return 'tv'
}

function getGenres(genres?: string | string[]) {
  if (!genres || !genres.length) return null;
  return genres + ""; 
}

const BUTTONS = (type: "movie" | "tv", sort: string, timeWindow: string, genres: string, genresList: Genre[]) => [
  <PageSelect key={0} label="Type" searchParam="t" defaultValue={type} values={[
    { id: 0, name: 'Movies', value: 'movie' },
    { id: 1, name: 'TV Shows', value: 'tv' },
  ]} />,
  <PageSelect key={1} label="Sort" searchParam="s" defaultValue={sort} values={[
    { id: 0, name: 'Popularity', value: 'popularity' },
    { id: 1, name: 'Rating', value: 'rating' },
    { id: 2, name: 'Votes', value: 'votes' },
    { id: 3, name: 'Release', value: 'release' },
    { id: 4, name: 'Revenue', value: 'revenue' },
  ]} />,
  <PageSelect key={2} label="Genre" searchParam="g" defaultValue={genres} values={genresList.map(genre => (
    { id: genre.id, name: genre.name, value: genre.id + "" }
  ))} />,
  <PageSelect key={3} label="Release" searchParam="w" defaultValue={timeWindow} values={Array.from({ length: 17 }).map((_, i) => {
    const year = i * 10 + 1870;
    return { id: i, name: `${year}s`, value: `${year}-01-01--${year + 9}-12-31` }
  }).reverse()} />,

]

export default async function TrendingPage({ searchParams }: { searchParams: Promise<{ [key: string]: undefined | string | string[]}> }) {
  const { 
    p: page,
    w: timeWindow,
    t: type,
    s: sort,
    g: genres,
  } = await searchParams;
  
  const genresList = await TMDB.listAllGenres()

  const pType = getType(type);
  const pSort = getSorting(sort);
  const pTimeWindow = getTimeWindow(timeWindow);
  const pGenres = getGenres(genres);

  const result = await TMDB.discover(pType, pSort, pTimeWindow, pGenres, parseInt(page + "") || 1);

  if (Res.isError(result)) {
    return <ErrorDiv message={result.error} />
  }

  return (
    <PageWrapper>
      <ResultsTopBar 
        totalPages={result.ok.total_pages} 
        title="Filter" 
        buttons={BUTTONS(
          pType, 
          (!sort || !sort.length) ? "popularity" : sort.toString(), 
          (!timeWindow || !timeWindow.length) ? "2020-01-01--2029-12-31" : timeWindow.toString(), 
          pGenres || "", 
          genresList.ok || []
        )} 
      />
      <BlocksWrapper>
        {result.ok.results.map(item => {
          return <ResultBlock key={item.id} item={item}/>
        })} 
      </BlocksWrapper>     
    </PageWrapper>
  ) 
}
