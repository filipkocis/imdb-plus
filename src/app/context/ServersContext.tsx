"use client"

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { getServerList } from "../utils/server";
import { toast } from "sonner";

export type ServerList = Server[];
export class Server {
  constructor(
    public name: string, 
    public url: string, 
    public moviePath: (id: number) => string,
    public tvPath: (id: number, season: number, episode: number) => string,
  ) {}

  getMovie = (id: number) => `${this.url}/${this.moviePath(id)}`
  getTv = (id: number, season: number, episode: number) => `${this.url}/${this.tvPath(id, season, episode)}`
}

function evaluateTemplateSafe(templateStr: string, variables: Record<string, number>) {
  return templateStr.replace(/\${(.*?)}/g, (_, key) => variables[key].toString() || "");
}

type ServerLike = {
  name: string,
  url: string,
  moviePath: string,
  tvPath: string,
}
export function parseServer(server: ServerLike): Server {
  return new Server(
    server.name,
    server.url,
    (id) => evaluateTemplateSafe(server.moviePath, { id }),
    (id, season, episode) => evaluateTemplateSafe(server.tvPath, { id, s: season, e: episode }),
  )
}

export const bamboozleServer = new Server(
  "Bamboozle",
  "https://www.youtube.com",
  () => "/embed/xvFZjo5PgG0?autoplay=1",
  () => "/embed/xvFZjo5PgG0?autoplay=1",
)

type ServersProviderValue = {
  serverList: ServerList
  setServerList: Dispatch<SetStateAction<ServerList>>
}

export const ServerListContext = createContext<ServersProviderValue>({
  serverList: [bamboozleServer],
  setServerList: () => {},
})

export default function ServerListProvider({ children }: { children: React.ReactNode }) {
  const [serverList, setServerList] = useState<ServerList>([bamboozleServer])

  useEffect(() => {
    const fetchServerList = async () => {
      try {
        const list = await getServerList()
        if (!list.length) throw new Error("You are not a wizard, Harry.")
        else setServerList(list.map(parseServer))
      } catch (error) {
        toast.error((error as Error)?.message || "Uh oh!")
      }
    }

    fetchServerList()
  }, [])

  return (
    <ServerListContext.Provider value={{ serverList, setServerList }}>
      {children}
    </ServerListContext.Provider>
  )
}

export function useServerList() {
  return useContext(ServerListContext)
}
