"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/merge";
import { TbMovie } from "react-icons/tb";
import { FaTv } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";

const ICONS = {
  home: AiOutlineHome,
  movie: TbMovie,
  tv: FaTv,
  search: LuSearch, 
}

type IconVariant = keyof typeof ICONS

export function NavLink({ href, icon }: { href: string, icon: IconVariant }) {
  const pathname = usePathname()
  const selected = pathname.startsWith(href)
  const Icon = ICONS[icon]

  return (
    <Link href={href} className={cn("transition-all max-md:border-t-2 md:border-r-2 border-transparent px-3 py-2 hover:bg-secondary", selected && "bg-secondary max-md:border-t-2 md:border-r-2 border-contrast")}>
      <div className="transition-none rounded-lg p-2 bg-secondary"> 
        <Icon size={20} className="" />
      </div>
    </Link>
  )
}
