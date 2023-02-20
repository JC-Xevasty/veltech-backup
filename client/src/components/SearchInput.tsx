import { forwardRef, HTMLAttributes, ForwardedRef } from "react"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SearchBar = forwardRef(({ ...props }: HTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
   return (
      <div className="relative">
         <input className="text-accent rounded-sm border-2 border-[#F1F1F1] bg-[#F1F1F1] w-[300px] pl-10 pr-2.5 py-0.5 placeholder:text-accent focus:outline-none focus:border-2 focus:border-accent" type="text" ref={ ref } { ...props } />

         <FontAwesomeIcon className="absolute top-2 left-2.5 text-accent" icon={ faSearch } fixedWidth />
      </div>
   )
})

export default SearchBar