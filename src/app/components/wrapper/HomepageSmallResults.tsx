"use client"

import BlocksWrapper from "./BlocksWrapper";
import { PageWrapper } from "./PageWrapper";
import ResultBlock from "../result/ResultBlock";
import ResultsTopBar from "../result/ResultsTopBar";
import ErrorDiv from "../ErrorDiv";
import type { Movie, Paginated, Result, TvShow } from "@/app/tmdb/lib";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";

const COLUMNS = [
  [0, 1],
  [640, 2],
  [768, 3],
  [1024, 4],
  [1280, 5],
  [1536, 6],
] as [number, number][]

function handleResize(containerWidth: number, windowWidth: number) {
  const gap = 8; // gap-2
  const column = COLUMNS.find(width => width[0] > (windowWidth || 1024))?.at(1) || (COLUMNS.at(-1)?.at(1) as number + 1)
  const columns = (column || 2) - 1
  const width = (containerWidth - gap * columns) / columns
  
  return width
}

export default function HomepageSmallResults({ result, href, title }: { result: Result<Paginated<Movie | TvShow>>, href: string, title: string }) {
  const windowSize = useWindowSize(10)
  const containerRef = useRef<HTMLDivElement>(null)
  const [computedWidth, setComputedWidth] = useState(250)

  useEffect(() => {
    if (!containerRef.current || windowSize.width === undefined) return

    const width = handleResize(containerRef.current.clientWidth, windowSize.width)

    if (width !== computedWidth) setComputedWidth(width)
  }, [windowSize.width])

  return (
    <PageWrapper>
      <ResultsTopBar short href={href} title={title} />
      {result.error !== undefined ? 
        <ErrorDiv message={result.error} /> : (
        <div ref={containerRef} className="overflow-x-auto">
            <BlocksWrapper small>
              {result.ok.results.map(item => (
                <div key={item.id} style={{ width: computedWidth, aspectRatio: "2/3" }}>
                  <ResultBlock item={item} />
                </div>
              ))}
            </BlocksWrapper>
        </div>
      )}
    </PageWrapper>
  )
}
