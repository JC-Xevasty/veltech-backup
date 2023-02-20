import { MouseEventHandler } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  text: string
  icon?: IconDefinition
  textIsBold?: boolean
  textColorClass: string
  textHoverColorClass: string
  borderColorClass: string
  borderHoverFillClass: string
  widthClass?: string
  type: "button" | "submit" | "reset"
  fixedWidth?: boolean
  onClick?: MouseEventHandler
}

function ButtonOutline({ type, icon, text, textIsBold, textColorClass, textHoverColorClass, borderColorClass, borderHoverFillClass, widthClass, fixedWidth, ...rest }: Props) {
  return (
    <button className={`transition-all ease-in-out duration-300 flex justify-center items-center gap-x-3 ${ textIsBold ? "font-bold" : undefined } ${textColorClass} ${textHoverColorClass} tracking-wide rounded bg-transparent border-2 ${borderColorClass} ${borderHoverFillClass} ${ widthClass } ${ fixedWidth ? "w-[150px]" : undefined } px-2.5 py-1.5`} {...rest}>
      { icon && <FontAwesomeIcon icon={ icon } size="lg" fixedWidth /> }
      <span>{ text }</span>
    </button>
  )
}

export default ButtonOutline
