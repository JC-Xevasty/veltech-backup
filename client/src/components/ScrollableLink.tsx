import { useLocation, useNavigate } from "react-router-dom"
import { scroller,  } from "react-scroll"

interface Props {
  label: string
  className?: string
  targetId: string
  targetPath: string
  duration?: number
  offset?: number
}

function ScrollableLink({ label, className, targetId, targetPath, duration, offset, ...rest }: Props) {
  const location = useLocation()

  const navigate = useNavigate()

  const scroll = () => scroller.scrollTo(targetId, {
    smooth: true,
    duration: duration ?? 1000,
    offset: offset ?? 0,
    ignoreCancelEvents: true
  })

  const scrollNavigate = async () => {
    if (location.pathname !== targetPath) {
      await navigate(targetPath)
    }

    setTimeout(() => {
      scroll()
    }, 250)
  }

  return (
    <button className={ className } onClick={ scrollNavigate } type="button" { ...rest }>{ label }</button>
  )
}

export default ScrollableLink