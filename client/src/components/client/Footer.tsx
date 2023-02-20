import { Link } from "react-router-dom"
import { faEnvelope, faPhone, faClock } from "@fortawesome/free-solid-svg-icons"
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ScrollableLink from "../ScrollableLink"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function Footer() {
  const app = useSelector(selectApp)

  return (
    <div className="flex flex-col gap-y-10 bg-accent px-10 lg:px-36 pt-10 pb-5">
      <div className="flex flex-col items-center lg:items-start lg:grid lg:grid-cols-10 lg:gap-x-16 text-white">
        <div className="col-start-1 col-end-5 flex flex-col items-center lg:items-start gap-y-5">
          <img className="object-contain select-none h-[50px]" src={ `${process.env.REACT_APP_API_URL}/assets/logo-white.png` } alt="Veltech Text Logo" draggable={ false } />

          <p className="text-sm text-center lg:text-start">We generate excellent outcomes from our ever-expanding industrial and manufacturing estates, and we have formed a corporate mandate to uphold strong core principles.</p>
        </div>

        <div className="col-start-5 col-end-9 flex flex-col items-center lg:items-start gap-y-5 mt-10 lg:mt-0">
          <h6 className="font-grandview-bold">Quick Contact</h6>

          <p className="text-sm text-center lg:text-start">If you have any questions orneed help, feel free to contact our company.</p>

          <div className="flex items-center gap-x-5">
            <FontAwesomeIcon className="text-primary" icon={ faPhone } size="lg" fixedWidth />
            <p className="text-[#B1C2DE] font-grandview-bold text-lg">{ app?.companyContactNumber }</p>
          </div>

          <p className="text-sm text-center lg:text-start">Jhocson St. Sampaloc, Manila</p>

          <div className="flex items-center gap-x-1.5">
            <a href="https://www.facebook.com/profile.php?id=100086709789324" target="_blank" rel="noreferrer" onClick={ () => window.scrollTo(0, 0) }>
              <FontAwesomeIcon className="text-primary hover:scale-105" icon={ faFacebookSquare } size="lg" fixedWidth />
            </a>
          </div>
        </div>

        <div className="col-start-9 col-end-11 flex flex-col items-center lg:items-start gap-y-5 mt-10 lg:mt-0">
          <h6 className="font-grandview-bold">Company</h6>

          <div className="flex flex-col items-center lg:items-start gap-y-2 5">
            <ScrollableLink className="hover:underline" label="Home" targetId="banner" targetPath="/" offset={ -150 } />
            <ScrollableLink className="hover:underline" label="Our Services" targetId="services" targetPath="/" offset={ -75 } />
            <ScrollableLink className="hover:underline" label="Our Team" targetId="team" targetPath="/" offset={ -150 } />
            <ScrollableLink className="hover:underline" label="Contact Us" targetId="contact" targetPath="/" offset={ -100 } />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="hidden lg:grid grid-cols-3 bg-white rounded w-full">
          <div className="col-span-1 flex justify-center items-center h-[125px]">
            <div className="flex items-center gap-x-4">
              <FontAwesomeIcon className="text-primary" icon={ faPhone } fixedWidth />

              <div className="flex flex-col text-accent">
                <span>CALL US:</span>
                <span className="font-grandview-bold">{ app?.companyContactNumber }</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex justify-center items-center border-x h-[125px]">
            <div className="flex items-center gap-x-4">
              <FontAwesomeIcon className="text-primary" icon={ faEnvelope } fixedWidth />

              <div className="flex flex-col text-accent">
                <span>EMAIL US:</span>
                <a href={`mailto:${ app?.companyEmailAddress }`} className="font-grandview-bold">{ app?.companyEmailAddress }</a>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex justify-center items-center h-[125px]">
            <div className="flex items-center gap-x-4">
              <FontAwesomeIcon className="text-primary" icon={ faClock } fixedWidth />

              <div className="flex flex-col text-accent">
                <span>OPENING HOURS:</span>
                <span className="font-grandview-bold">Mon-Fri: 8 AM - 5 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-2.5 lg:gap-y-0 lg:flex-row items-center justify-between text-xs text-[#B1C2DE]">
          <span>© 2022 { app?.appName }, All rights reserved.</span>
          
          <p><Link to="terms-and-conditions" onClick={ () => window.scrollTo(0, 0) }>Terms and Conditions</Link> & <Link to="privacy-policy" onClick={ () => window.scrollTo(0, 0) }>Privacy Policy</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Footer