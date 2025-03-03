import ErrorDiv from "@/app/components/ErrorDiv";
import ResultBlock from "@/app/components/result/ResultBlock";
import ResultsTopBar from "@/app/components/result/ResultsTopBar";
import BlocksWrapper from "@/app/components/wrapper/BlocksWrapper";
import { PageWrapper } from "@/app/components/wrapper/PageWrapper";
import { Res, TMDB } from "@/app/tmdb/lib";
import { notFound } from "next/navigation";

export default async function RecommendedPage(
  { params, searchParams }: 
  { params: Promise<{ type: string, id: string }>, searchParams: Promise<{ [key: string]: undefined | string | string[] }> }
) {
  const { p: page } = await searchParams;
  const { type, id } = await params;

  const parsedType = (type === 'tv' || type === 'movie') ? type : null;
  if (!parsedType) return notFound();

  const mediaId = parseInt(id) || 0;
  const result = await TMDB.getRecommendations(mediaId, parsedType, parseInt(page + "") || 1);

  if (Res.isError(result)) {
    return <ErrorDiv message={result.error} />
  }

  let name;
  if (type === 'tv') {
    const details = await TMDB.getTvDetails(mediaId);
    if (Res.isError(details)) return <ErrorDiv message={details.error} />
    else name = details.ok.name;
  } else {
    const details = await TMDB.getMovieDetails(mediaId);
    if (Res.isError(details)) return <ErrorDiv message={details.error} />
    else name = details.ok.title;
  }

  return (
    <PageWrapper>
      <ResultsTopBar totalPages={Math.min(result.ok.total_pages, 500)} title={`Recommendations for "${name}"`} buttons={[]} />
      <BlocksWrapper>
        {result.ok.results.map(item => {
          return <ResultBlock key={item.id} item={item}/>
        })} 
      </BlocksWrapper>     
    </PageWrapper>
  ) 
}
