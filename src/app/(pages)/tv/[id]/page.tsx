import ErrorDiv from "@/app/components/ErrorDiv"
import { redirect, RedirectType } from "next/navigation"
import MediaPage from "../../components/MediaPage"

export default async function TvPage({ params, searchParams }: { 
  params: Promise<{ [key: string]: string | string[]}> 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params 
  const { s } = await searchParams
  const season = s || "1"
  if (typeof id !== "string" || typeof season !== "string") return redirect("/tv", RedirectType.replace)

  const idNum = Number(id)
  const seasonNum = Number(season)
  if (isNaN(idNum)) return <ErrorDiv message="TV Show not found" />
  if (isNaN(seasonNum)) return <ErrorDiv message="TV Season not found" />

  return <MediaPage currentSeason={seasonNum} type="tv" id={idNum} />
}
