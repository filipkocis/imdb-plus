"use client"

import BlocksWrapper from "./BlocksWrapper";
import { PageWrapper } from "./PageWrapper";
import ResultBlock from "./ResultBlock";
import ResultsTopBar from "./ResultsTopBar";
import ErrorDiv from "./ErrorDiv";
import type { Movie, Paginated, Result, TvShow } from "../tmdb/lib";


export default function TrendingSmallResults({ result, href, title }: { result: Result<Paginated<Movie | TvShow>>, href: string, title: string }) {
  return (
    <PageWrapper>
      <ResultsTopBar short href={href} title={title} />
      {result.error !== undefined ? 
        <ErrorDiv message={result.error} /> : (
        <BlocksWrapper small>
          {result.ok.results.map(item => {
            return <ResultBlock key={item.id} item={item}/>
          })}
        </BlocksWrapper>
      )}
    </PageWrapper>
  )
}
