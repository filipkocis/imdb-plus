"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams } from "next/navigation";
import { cn } from "../../utils/merge";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

function getPageNumbers(currentPage: number, totalPages: number, maxButtons = 5): number[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const MAX_BUTTONS = 5;
export default function PaginationComponent({ totalPages }: { totalPages: number }) {
  if (totalPages < 1) return null;

  const params = useSearchParams()
  const page = parseInt(params.get("p") || "1") || 1
  const pageNumbers = getPageNumbers(page, totalPages, MAX_BUTTONS);

  const pageHref = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages

    const url = new URLSearchParams(params)
    url.set("p", page.toString())
    return "?" + url.toString()
  }

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent className="gap-2 flex-wrap">
        {pageNumbers[0] > 1 && (
          <PaginationItem>
            <PaginationLink
              aria-label="Go to first page"
              size="default"
              href={pageHref(0)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}

        {page > 1 && ( 
          <PaginationItem>
            <PaginationPrevious href={pageHref(page - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((v, i) => (
          <PaginationItem key={i}>
            <PaginationLink href={pageHref(v)} isActive={v === page}>{v}</PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem className={cn(page >= totalPages && "cursor-not-allowed opacity-50")}>
          <PaginationNext href={pageHref(page + 1)} className={cn(page >= totalPages && "pointer-events-none")} />
        </PaginationItem>

        {(pageNumbers.at(-1) ?? totalPages) < totalPages && (
          <PaginationItem className={cn(page >= totalPages && "cursor-not-allowed opacity-50")}>
            <PaginationLink
              aria-label="Go to last page"
              size="default"
              className={cn(page >= totalPages && "pointer-events-none")}
              href={pageHref(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
