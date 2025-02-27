import WatchButton from "@/app/components/WatchButton"
import { redirect, RedirectType } from "next/navigation"

export default async function MoviePage({ params }: { params: Promise<{ [key: string]: string | string[]}> }) {
  const { id } = await params 

  if (typeof id !== "string") return redirect("/movie", RedirectType.replace)

  return (
    <div className="">
      <WatchButton type="movie" id={id} />
    </div>
  )
}
