"use server"

import { cookies } from "next/headers"

function Server(name: string, url: string, moviePath: string, tvPath: string) {
  return { name, url, moviePath, tvPath }
}

const SERVERS: ReturnType<typeof Server>[] = [
  // You won't be able to access these servers unless you're a wizard, so stop lurking around :P
]

export async function getServerList() {
  const cookieStore = await cookies()
  const wizard = cookieStore.get("magic-book")
  if (!wizard) return [];

  const isWizard = wizard.value === process.env.MAGIC_BOOK;

  if (isWizard) {
    return SERVERS;
  }
  else {
    cookieStore.delete("magic-book")
    return []
  }
}

class Requests {
  private requests: number = 0
  private last: number = 0

  constructor(public max: number, public timeframe: number) {}
  
  canRequest() {
    if (this.last + this.timeframe < Date.now()) this.requests = 0;
    this.last = Date.now();
    this.requests++;
    return this.requests <= this.max;
  }
}
const requests = new Requests(5, 1000 * 60 * 5)

export async function verifyWizardness(magicSpell: string) {
  if (!requests.canRequest()) return false;

  const cookieStore = await cookies()
  const isWizard = magicSpell === process.env.MAGIC_SPELL;
  if (!isWizard) {
    if (cookieStore.get("magic-book")) cookieStore.delete("magic-book")
    return false
  }

  const MAGIC_BOOK = process.env.MAGIC_BOOK;
  if (!MAGIC_BOOK) return false;

  cookieStore.set("magic-book", MAGIC_BOOK, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  }) 

  return SERVERS;
}
