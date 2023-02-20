import { Link } from "react-router-dom"
import OpportunitiesImage from "../../../assets/home/Opportunities-Image.png"
import ScrollableLink from "../../../components/ScrollableLink"

function Opportunities() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 h-full">
      <div className="hidden lg:block lg:col-start-1 lg:col-end-4">
        <img className="object-cover object-left-bottom w-full h-full" src={ OpportunitiesImage } alt="Opportunities" draggable={ false } />
      </div>

      <div className="lg:col-start-4 lg:col-end-6 bg-[url('./assets/home/Opportunities-Gradient.png')] bg-no-repeat bg-cover text-white bg-primary p-10">
        <div className="flex flex-col items-start gap-y-10">
          <h1 className="text-5xl leading-tight font-grandview-bold">Providing full range of High Quality Services & Solutions worldwide.</h1>
        
          <div className="grid grid-cols-2 gap-x-10">
            <div className="col-start-1 flex flex-col gap-y-1.5">
              <span className="text-start text-[1.15rem] font-grandview-bold">Environmental Sensitivity</span>
              <span>The world of multinational supply chains is fraught with unknown threats and difficult rules.</span>
            </div>

            <div className="col-start-2 flex flex-col gap-y-1.5">
              <span className="text-start text-[1.15rem] font-grandview-bold">Tailored-fit Solutions</span>
              <span>Our services are accredited to the highest international standard and meet stringent security criteria.</span>
            </div>
          </div>

          <ScrollableLink className="transition-all ease-in-out duration-300 text-white hover:text-primary font-grandview-bold tracking-wide rounded border-2 border-white bg-transparent hover:bg-white hover:scale-105 px-3 py-2" label="Schedule Appointments" targetId="contact" targetPath="/" offset={ -100 }  />
        </div>
      </div>
    </div>
  )
}

export default Opportunities