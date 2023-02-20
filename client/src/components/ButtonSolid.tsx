import { MouseEventHandler } from 'react'
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  text: string
  textFirst?: boolean
  textColorClassName: string
  icon?: IconDefinition
  textIsBold?: boolean
  backgroundColorClassName: string
  widthClassName?: string
  type: "button" | "submit" | "reset"
  onClick?: MouseEventHandler
}

function ButtonSolid({ text, icon, textFirst, textColorClassName, textIsBold, type, backgroundColorClassName, widthClassName, ...rest }: Props) {
  return (
    <button className={ `transition-all ease-in-out duration-300 flex justify-center items-center gap-x-3 ${ !textFirst ? "flex-row-reverse" : undefined } ${ textIsBold ? "font-grandview-bold" : undefined } ${ textColorClassName } hover:contrast-[85%] tracking-wide rounded bg-transparent ${ backgroundColorClassName } ${ widthClassName } ${ widthClassName || "w-[300px]" } px-2.5 py-1.5` } {...rest}>
      { icon && <FontAwesomeIcon icon={ icon } size="lg" fixedWidth /> }
      <span className="tracking-wide">{ text }</span>
    </button>
  )
}

export default ButtonSolid