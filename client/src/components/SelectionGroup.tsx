import { forwardRef, ForwardedRef } from "react"
import { FieldError } from "react-hook-form"
import { v4 } from "uuid"
import { faChevronDown, faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  options: string[]
  values?: string[]
  label: string
  error?: FieldError
}

function SelectionGroup({ options, values, label, error, ...rest }: Props, ref: ForwardedRef<HTMLSelectElement>) {
  const id = v4()
  return (
    <div className="flex flex-col items-start gap-y-2.5">
      <label className={ `font-grandview-bold` } htmlFor={ id }>{ label }</label>

      <div className="relative w-full">
        <select className={ `rounded-sm border border-accent appearance-none focus-within:outline-none w-full px-2.5 py-1` } id={ id } ref={ ref } { ...rest }>
          <option value=""></option>

          {
            options.map((option, index) => (
                <option key={ option } value={ values![index] != null ? values![index] : option }>{ option }</option>
            ))
          }
        </select>

        <FontAwesomeIcon className="text-accent absolute top-2 right-2" icon={ faChevronDown } fixedWidth />
      </div>

      {
        error && (
            <div className="flex flex-row justify-start items-center gap-x-3">
              <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={ faWarning } fixedWidth />

              <span className="text-xs text-[#DE2B2B]">{ error.message }</span>
            </div>
        )
      }
    </div>
  )
}

export default forwardRef(SelectionGroup)