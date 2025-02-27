import Link from "next/link"
import PaginationComponent from "./Pagination"
import ResultTopBarButton from "./ResultTopBarButton"
import Subheading from "./Subheading"
import { Button } from "@/components/ui/button"

type Button = {
  label: string
  onClick?: () => void
  setParam?: [string, string]
}

type Props = {
  title: string
  buttons?: Button[]
  short?: boolean
  href?: string
  totalPages?: number
}

export default function ResultsTopBar({ title, buttons = [], ...props }: Props) {
  return (
    <div className="flex gap-3 items-center flex-wrap">
      <Subheading>{title}</Subheading>
      <div className="flex gap-2 grow flex-wrap">
        {buttons.map((args, i) => (
          <ResultTopBarButton key={i} {...args} />
        ))}
        {props.short && (
          <Link href={props.href ?? '#'}>
            <Button variant="ghost" size="default" className="text-contrast hover:bg-secondary">
              View all
            </Button>
          </Link>
        )}
      </div>
      {!props.short && <PaginationComponent totalPages={props.totalPages ?? 0} />}
    </div>
  )
}
