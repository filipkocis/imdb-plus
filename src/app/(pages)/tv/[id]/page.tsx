import ErrorDiv from "@/app/components/ErrorDiv"
import { redirect, RedirectType } from "next/navigation"
import MediaPage from "../../components/MediaPage"

export default async function TvPage({ params }: { params: Promise<{ [key: string]: string | string[]}> }) {
  const { id } = await params 
  if (typeof id !== "string") return redirect("/tv", RedirectType.replace)

  const idNum = Number(id)
  if (isNaN(idNum)) return <ErrorDiv message="TV Show not found" />

  return <MediaPage type="tv" id={idNum} />
}
