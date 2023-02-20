import { useCallback, useLayoutEffect, useState ,useEffect, Fragment} from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { baseApi } from "../../features/api/_base"
import { useDeauthenticateUserMutation, useFetchAuthenticatedQuery} from "../../features/api/user"
import { deauthenticateUser as deauthenticateUserRedux } from "../../features/auth/auth"
import { faArrowRightLong, faBars, faBarsStaggered, faBell, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useFetchNotificationsQuery } from "../../features/api/notification.api"

import ScrollableLink from "../ScrollableLink"
import type { ReduxState, User } from "../../types"
import TextLogo from "../../assets/Veltech-Text-Logo.png"
import { selectApp } from "../../features/app/app"

function Navbar() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const {data: userDetails} = useFetchAuthenticatedQuery()

  const [fetchedData, setFetchedData] = useState<User>();

  const { data: notifications } = useFetchNotificationsQuery({
    userId: user?.id
  })

  useEffect(() => {
    if(userDetails){
      setFetchedData(userDetails)
    }
  },[userDetails])

  const [isToggled, setToggled] = useState<boolean>(window.innerWidth >= 1024)

  const toggle = () => setToggled(toggled => !toggled)

  const resize = useCallback((evt: any) => {
    if (evt.target!.innerWidth >= 1024) setToggled(true)
    
    else {
      setToggled(false)
      setDropdownVisible(false)
      setNotificationVisible(false)
    }
  }, [])

  useLayoutEffect(() => {
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [resize])

  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false)

  const [isNotificationVisible, setNotificationVisible] = useState<boolean>(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()
  
  const [deauthenticateUserMutation] = useDeauthenticateUserMutation()

  const handleLogOut = async () => {
    baseApi.util.resetApiState()
    await deauthenticateUserMutation()
    dispatch(deauthenticateUserRedux({}))
    navigate("/login", { replace: true })
  }

  return (
    <div className="sticky top-0 bg-white z-[1000]">
      <div className={ `border-b-2 border-b-[#E7E7E7] py-2.5 px-5 ${ user ? "block" : "hidden" }` }>
        <p className="text-xs text-center"><span className="font-grandview-bold">Need Help</span>: Providing Innovative and Sustainable Solutions for your Business, Call { app?.companyContactNumber }</p>
      </div>

      <nav className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-8 border-b-primary w-full min-h-[75px]">
        <div className="flex flex-col lg:flex-row justify-between lg:justify-center items-start lg:items-center w-full">
          <div className="flex justify-between bg-primary min-w-full lg:min-w-[325px] px-8 py-2.5">
            <img className="object-contain select-none h-[50px]" src={ `${process.env.REACT_APP_API_URL}/assets/logo-white.png` } alt="Veltech Text Logo" draggable={ false } />
            
            <button className="lg:hidden" onClick={ toggle }>
              <FontAwesomeIcon className="text-white" icon={ isToggled ? faBarsStaggered : faBars } size="2x" fixedWidth />
            </button>
          </div>
          
          <div className={ `${ isToggled ? "flex flex-col lg:flex-row items-start gap-x-0 lg:gap-x-8 gap-y-2.5 lg:gap-y-0 bg-white w-full lg:mx-10 pt-5 pb-3 lg:py-0" : "hidden" }` }>
            <ScrollableLink className="text-accent hover:text-primary font-grandview-bold px-10 lg:px-0" label="Home" targetId="banner" targetPath="/" offset={ -150 } />
            <ScrollableLink className="text-accent hover:text-primary font-grandview-bold px-10 lg:px-0" label="Our Services" targetId="services" targetPath="/" offset={ -75 } />
            {/* <ScrollableLink className="text-accent hover:text-primary font-grandview-bold px-10 lg:px-0" label="Our Clients" targetId="clients" targetPath="/" offset={ -150 } /> */}
            <ScrollableLink className="text-accent hover:text-primary font-grandview-bold px-10 lg:px-0" label="Our Team" targetId="team" targetPath="/" offset={ -150 } />
            <ScrollableLink className="text-accent hover:text-primary font-grandview-bold px-10 lg:px-0" label="Contact Us" targetId="contact" targetPath="/" offset={ -100 } />
          </div>
        </div>

        <div className={ `${ isToggled ? "flex flex-col lg:flex-row items-start lg:items-center gap-x-0 lg:gap-x-10 gap-y-2.5 lg:gap-y-0 mx-10 mb-5 lg:mb-0" : "hidden" }` }>
          {
            user && (
              <Fragment>
                <div className={ `${ isToggled ? "flex flex-col lg:flex-row items-start gap-x-0 gap-y-2.5 bg-white w-full py-5 lg:hidden" : "hidden" }` }>
                  <button className="text-accent hover:text-primary font-grandview-bold lg:px-0" type="button" onClick={ () => { window.scrollTo(0, 0); navigate("/notification") } }>Notifications</button>
                  <button className="text-accent hover:text-primary font-grandview-bold lg:px-0" type="button" onClick={ () => { window.scrollTo(0, 0); navigate("/account") } }>Account</button>
                  <button className="text-accent hover:text-primary font-grandview-bold lg:px-0" type="button" onClick={ handleLogOut }>Log Out</button>
                </div>

                <div className="hidden lg:flex lg:flex-row lg:justify-end lg:items-center lg:gap-x-5">
                  <div className="relative">
                    <button className="text-accent" type="button" onClick={ () => setNotificationVisible((isVisible) => !isVisible) } onBlur={ () => setTimeout(() => setNotificationVisible(false), 200) }>
                      <FontAwesomeIcon icon={ faBell } size="lg" fixedWidth />
                    </button>

                    <div className={ `absolute top-8 rounded-sm bg-white shadow-lg -translate-x-1/2 w-[350px] h-fit p-2.5 ${ isNotificationVisible ? "block" : "hidden" }` }>
                      <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
                        <span className="text-sm text-accent px-2">Recently Received Notifications</span>
                      
                        {
                          notifications?.length ? notifications?.slice(0, 5).map(notification => (
                            <Link className="flex flex-col justify-start items-start px-2 py-1.5 border-b" to={ notification.origin === "QUOTATION" ? `/my-quotations/view/id=${ notification.quotationId }` : `/my-projects/view/id=${ notification.projectId }` }>
                              <span className="text-accent font-grandview-bold leading-snug">{ notification.title }</span>

                              <span className="text-[0.67rem] leading-tight">{ notification.body }</span>
                            </Link>
                          )) : (
                            <div className="flex flex-col justify-start items-start px-2 py-1.5 border-b">
                              <span className="text-[0.67rem] leading-tight">You have no new notifications.</span>
                            </div>
                          )
                        }

                        <button className="text-[0.67rem] w-full" type="button" onClick={ () => { window.scrollTo(0, 0); navigate("/notification") } }>View All</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-r-[1px] border-r-accent h-[40px]" />

                  <span className="whitespace-nowrap text-ellipsis max-w-[25ch]">Hello, { user.firstName }</span>

                  <div className="flex flex-row justify-start items-center gap-x-3">
                    <div className="rounded-full border-2 border-[#EFEFEF] bg-[#EFEFEF] overflow-hidden w-[40px] h-[40px]">
                      <img className="object-cover object-top w-full h-full" src={ user?.image ? `${ process.env.REACT_APP_API_URL }/uploads/${user.image}` : `${process.env.REACT_APP_API_URL}/assets/user-profile-placeholder.jpg` } alt={ `${ user.firstName } Profile` } />
                    </div>

                    <div className="relative">
                      <button className="text-accent" type="button" onClick={ () => setDropdownVisible((isVisible) => !isVisible) } onBlur={ () => setTimeout(() => setDropdownVisible(false), 200) }>
                        <FontAwesomeIcon icon={ faChevronDown } size="xs" fixedWidth />
                      </button>

                      <div className={ `absolute top-8 rounded-sm bg-white shadow-lg -translate-x-full w-[200px] h-fit ${ isDropdownVisible ? "block" : "hidden" }` }>
                        <ul className="list-none">
                          <li>
                            <button className="transition-all ease-in-out duration-300 text-start text-sm w-full h-full px-2.5 py-2.5 hover:text-white hover:indent-3 hover:bg-accent" type="button" onClick={ () => { window.scrollTo(0, 0); navigate("/account") } }>
                              My Account
                            </button>
                          </li>

                          <li>
                            <button className="transition-all ease-in-out duration-300 text-start text-sm w-full h-full px-2.5 py-2.5 hover:text-white hover:indent-3 hover:bg-accent" type="button" onClick={ () => { window.scrollTo(0, 0); navigate("/quotation") } }>
                              Request Quote
                            </button>
                          </li>

                          <li>
                            <button className="transition-all ease-in-out duration-300 text-start text-sm w-full h-fullp px-2.5 py-2.5 hover:text-white hover:indent-3 hover:bg-accent" type="button" onClick={ handleLogOut }>
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          }
          
          {
            !user && (
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-0 lg:gap-x-2.5 gap-y-2.5 lg:gap-y-0">
                <Link className="whitespace-nowrap" to="/login" onClick={ () => window.scrollTo(0, 0) }>Log In</Link>
                
                <span className="hidden select-none lg:block">|</span>
                
                <Link className="whitespace-nowrap" to="/registration" onClick={ () => window.scrollTo(0, 0) }>Sign Up</Link>
                
                <Link className="transition-all ease-in-out duration-300 flex items-center gap-x-2.5 rounded text-white bg-accent hover:scale-105 ml-0 lg:ml-5 px-5 py-2.5" to="/quotation" onClick={ () => window.scrollTo(0, 0) }>
                  <span className=" font-grandview-bold whitespace-nowrap">Request A Quote</span>
                  
                  <FontAwesomeIcon icon={ faArrowRightLong } size="lg" fixedWidth />
                </Link>
              </div>
            )
          }
        </div>
      </nav>
    </div>
  )
}

export default Navbar