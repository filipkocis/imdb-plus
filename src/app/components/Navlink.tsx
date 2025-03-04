"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/merge";
import { TbMovie } from "react-icons/tb";
import { FaTv } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { SlFire } from "react-icons/sl";

const ICONS = {
  home: AiOutlineHome,
  movie: TbMovie,
  tv: FaTv,
  trending: SlFire,
  search: LuSearch, 
}

type IconVariant = keyof typeof ICONS

export function NavLink({ href, icon }: { href: string, icon: IconVariant }) {
  const pathname = usePathname()
  const selected = href === '/' ? pathname === href : pathname.startsWith(href)
  const Icon = ICONS[icon]

  return (
    <Link href={href} className={cn("text-white/60 hover:text-white transition-all max-sm:border-t-2 sm:border-r-2 border-transparent px-2 md:px3 py-1.5 md:py-2 hover:bg-secondary", selected && "text-white bg-secondary max-sm:border-t-2 sm:border-r-2 border-contrast")}>
      <div className="transition-none rounded-lg p-2 bg-secondary"> 
        <Icon size={20} className="max-md:!w-[16px]" />
      </div>
    </Link>
  )
}
