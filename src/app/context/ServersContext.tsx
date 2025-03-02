"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getServerList } from "../utils/server";

export type ServerList = Server[];
export class Server {
  constructor(
    public name: string, 
    public url: string, 
    public moviePath: (id: string) => string,
    public tvPath: (id: string, season: number, episode: number) => string,
  ) {}

  getMovie = (id: string) => `${this.url}/${this.moviePath(id)}`
  getTv = (id: string, season: number, episode: number) => `${this.url}/${this.tvPath(id, season, episode)}`
}

function evaluateTemplateSafe(templateStr: string, variables: Record<string, any>) {
  return templateStr.replace(/\${(.*?)}/g, (_, key) => variables[key] || "");
}

type ServerLike = {
  name: string,
  url: string,
  moviePath: string,
  tvPath: string,
}
function parseServer(server: ServerLike): Server {
  return new Server(
    server.name,
    server.url,
    (id) => evaluateTemplateSafe(server.moviePath, { id }),
    (id, season, episode) => evaluateTemplateSafe(server.tvPath, { id, s: season, e: episode }),
  )
}

const bamboozleServer = new Server(
  "Bamboozle",
  "https://www.youtube.com",
  () => "/embed/xvFZjo5PgG0?autoplay=1",
  () => "/embed/xvFZjo5PgG0?autoplay=1",
)

export const ServerListContext = createContext<ServerList>([bamboozleServer])

export default function ServerListProvider({ children }: { children: React.ReactNode }) {
  const [serverList, setServerList] = useState<ServerList>([bamboozleServer])

  useEffect(() => {
    const fetchServerList = async () => {
      try {
        const list = await getServerList()
        if (!list.length) throw new Error("You are not a wizard, Harry.")
        else setServerList(list.map(parseServer))
      } catch (error) {
        console.error(error)
      }
    }

    fetchServerList()
  }, [])

  return (
    <ServerListContext.Provider value={serverList}>
      {children}
    </ServerListContext.Provider>
  )
}

export function useServerList() {
  return useContext(ServerListContext)
}
