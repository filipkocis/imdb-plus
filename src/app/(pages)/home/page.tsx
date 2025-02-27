import { redirect, RedirectType } from "next/navigation";

export default function HomePage() {
  return redirect("/", RedirectType.replace);
}
