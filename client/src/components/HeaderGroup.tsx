import { HTMLAttributes } from "react"
import { Link } from "react-router-dom"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props extends HTMLAttributes<HTMLButtonElement> {
   text: string
   link?: string
}

const HeaderGroup = ({ text, link }: Props) => {
   return (
      <div className="flex flex-row justify-start items-center gap-x-5">
         {
            link && (
               <Link to={ link }>
                  <FontAwesomeIcon className="text-2xl text-accent" icon={ faChevronLeft } fixedWidth />
               </Link>
            )
         }

         <h1 className="text-3xl text-accent font-grandview-bold">{ text }</h1>
      </div>
   )
}

export default HeaderGroup