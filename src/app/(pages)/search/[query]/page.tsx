import BlocksWrapper from "@/app/components/wrapper/BlocksWrapper";
import ErrorDiv from "@/app/components/ErrorDiv";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import ResultBlock from "@/app/components/result/ResultBlock";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import { TMDB } from "@/app/tmdb/lib";

export default async function SearchPage({ params, searchParams }: { 
  params: Promise<{ [key: string]: string | string[]}> 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { query } = await params;
  const { p: page } = await searchParams;
  const result = await TMDB.search(query.toString(), parseInt(page + "") || 1);

  if (result.error !== undefined) {
    return <ErrorDiv message={result.error} />
  }

  return (
    <PageWrapper>
      <ResultsTopBar totalPages={result.ok.total_pages} title={`Results for "${decodeURI(query.toString())}"`} buttons={[]} />
      <BlocksWrapper>
        {result.ok.results.map(item => {
          return <ResultBlock key={item.id} item={item}/>
        })} 
      </BlocksWrapper>
    </PageWrapper>
  )
}
