import WatchButton from "@/app/components/WatchButton"
import { redirect, RedirectType } from "next/navigation"

export default async function TvPage({ params }: { params: Promise<{ [key: string]: string | string[]}> }) {
  const { id } = await params 

  if (typeof id !== "string") return redirect("/tv", RedirectType.replace)

  return (
    <div className="">
      <WatchButton type="tv" id={id} episode={1} season={1} />
    </div>
  )
}
