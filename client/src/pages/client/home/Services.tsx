import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { faScrewdriverWrench, faToolbox, faArrowRight, faTruck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Services() {
  const [activeService, setActiveService] = useState<string>("installation")

  const navigate = useNavigate()

  return (
    <div className="bg-[url('./assets/home/Services-Gradient.png')] bg-no-repeat bg-cover flex flex-col items-center gap-y-5 px-10 lg:px-36 py-20 lg:pt-28 lg:pb-28" id="services">
      <div className="bg-primary rounded-full w-[18px] h-[18px]" />
      <h1 className="text-5xl text-primary text-center font-grandview-bold">Our Services</h1>
      <h1 className="text-4xl text-accent text-center font-inter-bold">What can we do for you?</h1>

      <div className="flex flex-col lg:flex-row items-center lg:gap-x-40 gap-y-16 mt-5">
        <div className="flex flex-col gap-y-5 justify-center">
          <button className="flex flex-col items-center gap-y-5" onClick={ () => setActiveService("installation") }>
            <FontAwesomeIcon className={ `${ activeService === "installation" ? "text-primary" : "text-accent" }` } icon={ faScrewdriverWrench } size="5x" />
            <div className={ `transition-all ease-in-out duration-300 bg-primary ${ activeService === "installation" ? "w-[60px] h-[5px]" : "w-0 h-0" }` }></div>
          </button>
          
          <span className={ `text-2xl font-grandview-bold ${ activeService === "installation" ? "block" : "hidden" }` }>Installation</span>
        </div>

        <div className="flex flex-col gap-y-5 justify-center">
          <button className="flex flex-col items-center gap-y-5" onClick={ () => setActiveService("maintenance") }>
            <FontAwesomeIcon className={ `${ activeService === "maintenance" ? "text-primary" : "text-accent" }` } icon={ faToolbox } size="5x" />
            <div className={ `transition-all ease-in-out duration-300 bg-primary ${ activeService === "maintenance" ? "w-[60px] h-[5px]" : "w-0 h-0" }` }></div>
          </button>
          
          <span className={ `text-2xl font-grandview-bold ${ activeService === "maintenance" ? "block" : "hidden" }` }>Maintenance</span>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-8 lg:gap-x-16 gap-y-5 px-10 lg:px-36 pt-5">
        <div className="lg:col-start-1 lg:col-end-6 text-accent">
          <p>All buildings whether publicly or privately owned have a legal requirement for a minimum level of fire protection and JCW can ensure that you fulfil your legal obligation by having the necessary level of protection for you building.</p><br />
          <p>We can provide a full project management service for your installation from the initial Fire Risk Assessment through to the installation or replacement of fire alarm equipment. We will ensure that new and existing buildings comply with Fire Regulations and maintain structural fire integrity in a cost effective and efficient manner.</p>
        </div>

        <div className="lg:col-start-6 lg:col-end-9 text-accent">
          <h3 className="font-grandview-bold text-lg">Service Inclusion:</h3>

          <div className="flex flex-col">
            {
              (activeService === "installation" || activeService === "maintenance") && (
                ["Automatic Fire Sprinkler System", "Wet and Dry Fire Hydrant System", "Kitchen Hood Fire Suppression System", "Carbon Dioxide Fire Suppression System", "Flooding System"].map((inclusion, index) => (
                  <span key={`inclusion-${index + 1}`}>{index + 1}. {inclusion}</span>
                ))
              )
            }
          </div>

          <p className="mt-5">This service has its <Link to="/terms-and-conditions" className="font-grandview-bold text-primary">Terms and Conditions</Link>.</p>

          <button className="flex items-center gap-x-2.5 rounded text-white bg-accent hover:scale-105 w-fit mt-5 px-3 py-2" onClick={ () => { navigate("/quotation"); window.scrollTo(0, 0) } }>
            <span className=" font-grandview-bold whitespace-nowrap">Request A Quote</span>
            <FontAwesomeIcon icon={ faArrowRight } size="lg" fixedWidth />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Services