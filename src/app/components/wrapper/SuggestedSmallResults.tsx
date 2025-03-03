import BlocksWrapper from "./BlocksWrapper";
import { PageWrapper } from "./PageWrapper";
import ResultBlock from "../result/ResultBlock";
import ResultsTopBar from "../result/ResultsTopBar";
import ErrorDiv from "../ErrorDiv";
import type { Movie, Paginated, Result, TvShow } from "@/app/tmdb/lib";

export default function SuggestedSmallResults({ result, href, title }: { result: Result<Paginated<Movie | TvShow>>, href: string, title: string }) {
  return (
    <PageWrapper>
      <ResultsTopBar short href={href} title={title} />
      {result.error !== undefined ? 
        <ErrorDiv message={result.error} /> : (
        <div className="overflow-x-auto">
            <BlocksWrapper small>
              {result.ok.results.map(item => (
                <div key={item.id} className="aspect-[2/3] w-[230px]">
                  <ResultBlock item={item} />
                </div>
              ))}
              {result.ok.results.length === 0 && (
                <p className="text-sm text-neutral-400 p-4">Sorry, couldn{"'"}t find any {title.toLowerCase()}</p>
              )}
            </BlocksWrapper>
        </div>
      )}
    </PageWrapper>
  )
}
