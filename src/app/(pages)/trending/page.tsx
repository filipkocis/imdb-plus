import BlocksWrapper from "@/app/components/wrapper/BlocksWrapper";
import ErrorDiv from "@/app/components/ErrorDiv";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import ResultBlock from "@/app/components/result/ResultBlock";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import { Res, TMDB } from "@/app/tmdb/lib";
import PageSelect from "../components/PageSelect";

function getType(type?: string | string[]) {
  type = type + "";
  switch (type) {
    case 'movie': return 'movie';
    case 'tv': return 'tv';
    case 'person': return 'person';
    default: return 'all';
  }
}

function getTime(time?: string | string[]) {
  if (time + "" === 'day') return 'day'
  else return 'week'
}

const BUTTONS = [
  <PageSelect key={0} label="Type" searchParam="t" defaultValue="all" values={[
    { id: 0, name: 'All', value: 'all' },
    { id: 1, name: 'Movies', value: 'movie' },
    { id: 2, name: 'TV Shows', value: 'tv' },
    { id: 3, name: 'People', value: 'person' },
  ]} />,
  <PageSelect key={1} label="Time" searchParam="f" defaultValue="week" values={[
    { id: 0, name: 'Week', value: 'week' },
    { id: 1, name: 'Day', value: 'day' },
  ]} />,
];

export default async function TrendingPage({ searchParams }: { searchParams: Promise<{ [key: string]: undefined | string | string[]}> }) {
  const { 
    p: page,
    t: type,
    f: filter
  } = await searchParams;
  
  const result = await TMDB.getTrending(getType(type), getTime(filter), parseInt(page + "") || 1);

  if (Res.isError(result)) {
    return <ErrorDiv message={result.error} />
  }

  return (
    <PageWrapper>
      <ResultsTopBar totalPages={Math.min(result.ok.total_pages, 500)} title="Trending" buttons={BUTTONS} />
      <BlocksWrapper>
        {result.ok.results.map(item => {
          return <ResultBlock key={item.id} item={item}/>
        })} 
      </BlocksWrapper>     
    </PageWrapper>
  ) 
}
