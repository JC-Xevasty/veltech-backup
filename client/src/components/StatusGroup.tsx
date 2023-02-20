interface StatusProps {
   text: string
   color: string
}

const StatusGroup = ({ text, color }: StatusProps) => {
   return (
      <div className="flex flex-row justify-start items-center gap-x-3">
         <div className={ `rounded-full w-[8px] h-[8px] ${ color }` } />

         <span>{ text }</span>
      </div>
   )
}

export default StatusGroup