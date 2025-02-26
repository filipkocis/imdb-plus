export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Button href="/movie" label="Search Movies" />
      <Button href="/tv" label="Search TV Shows" />
    </div>
  );
}

function Button({ href, label }: { href: string, label: string }) {
  return (
    <button className="flex bg-black border-2 rounded-lg transition-all hover:bg-orange-400">
      <a className="p-4" href={href}>{label}</a>
    </button>
  )
}
