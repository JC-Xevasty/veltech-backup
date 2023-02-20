interface Props {
  label: string
  value: string | number
}

function InputGroup({ label, value, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-y-1.5">
        <label className="text-md text-[#133061] font-grandview-bold">{ label }</label>
        <label className="font-grandview">{ value }</label>
    </div>
  )
}

export default InputGroup