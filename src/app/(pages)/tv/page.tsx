import BlocksWrapper from "@/app/components/BlocksWrapper";
import ErrorDiv from "@/app/components/ErrorDiv";
import { PageWrapper } from "@/app/components/PageWrapper";
import ResultBlock from "@/app/components/ResultBlock";
import ResultsTopBar from "@/app/components/ResultsTopBar";
import { TMDB } from "@/app/tmdb/lib";

function getType(type?: string | string[]) {
  let index = TMDB.TV_LISTS.indexOf(type + "" as any);
  if (index === -1) index = 0;
  return TMDB.TV_LISTS[index];
}

const BUTTONS = [
  { label: 'Popular', setParam: ['f', 'popularity'] },
  { label: 'Top Rated', setParam: ['f', 'rating'] },
  { label: 'On Air', setParam: ['f', 'on_air'] },
  { label: 'Airing Today', setParam: ['f', 'airing'] },
] as { label: string, setParam: [string, string] }[]

export default async function TvPage({ searchParams }: { searchParams: Promise<{ [key: string]: undefined | string | string[]}> }) {
  const { 
    p: page,
    f: filter
  } = await searchParams;
  
  const result = await TMDB.getTvLists(getType(filter), parseInt(page + "") || 1);

  if (result.error !== undefined) {
    return <ErrorDiv message={result.error} />
  }

  return (
    <PageWrapper>
      <ResultsTopBar totalPages={Math.min(result.ok.total_pages, 500)} title="Browse TV Shows" buttons={BUTTONS} />
      <BlocksWrapper>
        {result.ok.results.map(item => {
          return <ResultBlock key={item.id} item={item}/>
        })} 
      </BlocksWrapper>     
    </PageWrapper>
  ) 
}
