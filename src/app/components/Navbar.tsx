import Image from "next/image";
import { NavLink } from "./Navlink";
import Logo from "@/assets/logo.png";
import { hasWizardBond } from "@/app/db/lib";

export default async function Navbar() {
  const isWizard = await hasWizardBond();

  return (
    <div className="fixed z-30 sm:left-0 bg-background max-sm:bottom-0 flex sm:flex-col gap-2 max-sm:border-t-2 sm:border-r-2 border-secondary max-sm:w-full sm:h-[100dvh] overflow-x-hidden">
      <div className="max-sm:hidden items-center bg-secondary justify-center flex py-4">
        <Image src={Logo} alt="IMDb+" width={50} className="max-md:!w-[40px]" />
      </div>
      <div className="flex flex-col grow justify-center">
        <nav className="flex max-sm:justify-center sm:flex-col gap-2 sm:py-4 sm:border-t-2 sm:border-b-2 border-secondary">
          <NavLink href="/" icon="home" />
          <NavLink href="/movie" icon="movie" />
          <NavLink href="/tv" icon="tv" />
          <NavLink href="/trending" icon="trending" />
          <NavLink href="/search" icon="search" />
          {isWizard && <NavLink href="/vault" icon="vault" />}
        </nav>
      </div>
      <div className="max-sm:hidden items-center justify-center bg-secondary hidden sm:flex py-4">
        <p
          className="text-center -rotate-180 text-contrast text-xl md:text-2xl font-semibold"
          style={{
            writingMode: "vertical-lr",
            letterSpacing: "0.1em",
          }}
        >
          IMDb+
        </p>
      </div>
    </div>
  );
}
