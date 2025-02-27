export default function ErrorDiv({ message }: { message: string }) {
  return (
    <div className="justify-self-center align-middle items-center justify-center self-center text-center">
      <h2 className="text-2xl font-semibold text-white">Error :(</h2>
      <p className="text-xl text-white">{message}</p>
    </div>
  )
}
