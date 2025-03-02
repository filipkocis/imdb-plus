import Link from "next/link"
import PaginationComponent from "./Pagination"
import ResultTopBarButton from "./ResultTopBarButton"
import Subheading from "./Subheading"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type Button = {
  label: string
  onClick?: () => void
  setParam?: [string, string]
}

type Props = {
  totalPages?: number
  title: string
  buttons: (Button | React.ReactNode)[]
} | {
  short: true
  href: string
  title: string
}

export default function ResultsTopBar({ title, ...props }: Props) {
  const short = 'short' in props

  return (
    <div className="flex gap-3 items-center flex-wrap">
      <Subheading>{title}</Subheading>
      <div className="flex gap-2 grow flex-wrap">
        {!short && props.buttons.map((args, i) => {
          if (args && typeof args === 'object' && 'label' in args) {
            return <ResultTopBarButton key={i} {...args} />
          }
          return args
        })}
        {short && (
          <Link href={props.href ?? '#'}>
            <Button variant="ghost" size="default" className="text-contrast hover:bg-secondary">
              View all
              <ChevronRight size={12} />
            </Button>
          </Link>
        )}
      </div>
      {!short && <PaginationComponent totalPages={props.totalPages ?? 0} />}
    </div>
  )
}
