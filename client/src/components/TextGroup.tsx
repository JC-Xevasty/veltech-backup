import { forwardRef, ForwardedRef, HTMLAttributes } from "react"
import { FieldError } from "react-hook-form"
import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { v4 } from "uuid"

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  label: string
  rows?: number
  error?: FieldError
  readOnly?: boolean
}

function InputGroup({ label, error, readOnly = false, rows = 5, ...rest }: Props, ref: ForwardedRef<HTMLTextAreaElement>) {
  const id = v4()

  return (
    <div className="flex flex-col items-start gap-y-2.5">
      <label className={ `font-grandview-bold` } htmlFor={ id }>{ label }</label>

      <textarea className={ `rounded-sm border border-accent resize-none focus-within:outline-none w-full px-2.5 py-1` } rows={ rows } id={ id } ref={ ref } readOnly={ readOnly } { ...rest }></textarea>

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

export default forwardRef(InputGroup)