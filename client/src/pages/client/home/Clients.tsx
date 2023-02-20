import QueenOfHeartsVideo from "../../../assets/home/QueenOfHearts.mp4"

interface Props {
  brands: {
    src: any
    name: string
  }[]
}

function Clients({ brands }: Props) {
  return (
    <div className="flex flex-col items-center gap-y-8 px-10 lg:px-36 pb-20 lg:pb-28" id="clients">
      <h1 className="text-5xl text-primary font-grandview-bold">Our Clients</h1>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-y-10 lg:gap-x-16 border-y border-y-[#E7E7E7] w-full py-5">
        {
          brands.map((brand, index) => (
            <img className="object-contain select-none" key={ `brand-${ index }` } src={ brand.src } alt={ brand.name } draggable={ false } />
          ))
        }
      </div>
    </div>
  )
}

export default Clients