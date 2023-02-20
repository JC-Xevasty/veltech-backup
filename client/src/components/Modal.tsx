import { ForwardedRef, forwardRef, MutableRefObject, useImperativeHandle, useRef } from "react"

interface Props{
    children: any,
    padless?: boolean
}
interface HTMLDialogElement{
    show: () => void
    close: () => void
}

function Modal({ children, padless }:Props, ref: ForwardedRef<HTMLDialogElement>) {
   const innerRef = useRef<HTMLDialogElement>()
   
    useImperativeHandle(ref, () => ({
        show() {
            innerRef.current!.show()
        },
        close() {
            innerRef.current!.close()
        }
    }))

    return (
        <dialog className="rounded-lg fixed shadow-2xl top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden min-w-[400px] p-0" ref={ ( elem ) => { innerRef.current = elem!; if (typeof ref === "function") { ref(elem) } else { ref!.current = elem } } }>
            <div className={ padless ? "p-0" : "p-5" }>
                { children }
            </div>
        </dialog>
    )
}

export default forwardRef(Modal)