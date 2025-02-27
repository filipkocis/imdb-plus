import Image from "next/image";
import { NavLink } from "./Navlink";
import Logo from "@/assets/logo.png"

export default function Navbar() {
  return (
    <div className="z-10 absolute bg-background max-md:bottom-0 flex md:flex-col gap-2 max-md:border-t-2 md:border-r-2 border-secondary max-md:w-full md:h-full">
      <div className="max-md:hidden items-center bg-secondary justify-center flex py-4">
        <Image src={Logo} alt="IMDb+" width={50} />
      </div>
      <div className="flex flex-col grow justify-center">
        <nav className="flex max-md:justify-center md:flex-col gap-2 md:py-4 border-t-2 md:border-b-2 border-secondary">
          <NavLink href="/" icon="home" />
          <NavLink href="/movie" icon="movie" />
          <NavLink href="/tv" icon="tv" />
          <NavLink href="/search" icon="search" />
        </nav>
      </div>
      <div className="max-md:hidden items-center justify-center bg-secondary hidden md:flex py-4">
        <p 
          className="text-center text-contrast text-2xl font-semibold"
          style={{ 
            writingMode: "sideways-lr",
            letterSpacing: "0.1em",
          }}
        >
          IMDb+
        </p>
      </div>
    </div>
  )
}
