import { Link } from "react-router-dom"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
   link: string
   label: string
   icon: IconDefinition
}

function CardLink({ link, label, icon }: Props) {
   return (
      <Link className="transition-all ease-in-out duration-300 flex flex-col justify-center items-start gap-y-2.5 shadow-[0_0_10px_#0000002F] border-l-8 border-l-[#DE2B2B] w-full min-h-[150px] p-5 hover:scale-105" to={ link }>
         <FontAwesomeIcon className="text-5xl text-accent" icon={ icon } fixedWidth />
         
         <h1 className="text-2xl text-accent font-grandview-bold">{ label }</h1>
      </Link>
   )
}

export default CardLink