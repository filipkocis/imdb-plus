import ErrorDiv from "@/app/components/ErrorDiv"
import { redirect, RedirectType } from "next/navigation"
import MediaPage from "../../components/MediaPage"

export default async function MoviePage({ params }: { params: Promise<{ [key: string]: string | string[]}> }) {
  const { id } = await params 
  if (typeof id !== "string") return redirect("/movie", RedirectType.replace)

  const idNum = Number(id)
  if (isNaN(idNum)) return <ErrorDiv message="Movie not found" />

  return <MediaPage type="movie" id={idNum} />
}
