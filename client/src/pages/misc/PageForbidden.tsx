import React from 'react'
import { Helmet } from "react-helmet-async"
import { faArrowLeftLong, faStop,  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { useCallback, useLayoutEffect, useState } from "react"
import { useNavigate,} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { baseApi } from "../../features/api/_base"
import { useDeauthenticateUserMutation } from "../../features/api/user"
import { deauthenticateUser as deauthenticateUserRedux } from "../../features/auth/auth"
import { faArrowRightLong, faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons"
import type { ReduxState, User } from "../../types"
import TextLogo from "../../assets/Veltech-Text-Logo.png"


function PageForbidden() {
  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const [isToggled, setToggled] = useState<boolean>(window.innerWidth >= 1024)

  const toggle = () => setToggled(toggled => !toggled)

  const resize = useCallback((evt: any) => {
    if (evt.target!.innerWidth >= 1024) setToggled(true)
    else setToggled(false)
  }, [])

  useLayoutEffect(() => {
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [resize])

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
    <>
    <Helmet>
    <title>{ process.env.REACT_APP_NAME } | 401 - Forbidden</title>
  </Helmet>

    {/*PageError Navbar */}
    <div className="sticky top-0 bg-white z-[1000]">

      <nav className="flex flex-col lg:flex-row justify-between items-start lg:items-left border-b-8 border-b-primary w-full min-h-[75px]">
        <div className="flex flex-col lg:flex-row justify-between lg:justify-left items-start lg:items-center w-full">
          <div className="flex justify-between bg-primary min-w-full lg:min-w-[325px] px-8 py-2.5">
            <img className="object-contain select-none h-[50px]" src={ TextLogo } alt="Veltech Text Logo" draggable={ false } />
            
            <button className="lg:hidden" onClick={ toggle }>
              <FontAwesomeIcon className="text-white" icon={ isToggled ? faBarsStaggered : faBars } size="2x" fixedWidth />
            </button>
          </div>
          
        </div>
      </nav>
    </div>
    {/* end of PageError Nav */}

    <div className="relative flex flex-col justify-between min-h-screen">
    <div className="mx-10 lg:mx-36 my-10 lg:my-15">
    <div className="flex flex-col gap-y-5 w-full lg:w-3/4 mt-5 lg:mt-20">
            <h1 className="text-[5rem] text-[#0B2653] leading-none font-grandview-bold">Forbidden <FontAwesomeIcon icon={ faStop }/> </h1> 
            <h5 className="text-[2.25rem] text-[#5A5A5A] font-grandview-light pb-5">Access to this resource server on the server
            <br/>is denied.</h5>
            <h1 className="text-[2.65rem] text-[#0B2653] pb-5 leading-none font-grandview-bold">403 - FORBIDDEN</h1>
            <button className='text-[#0B2653] font-grandview-bold' onClick={ () => navigate(-1) }>
            <FontAwesomeIcon icon={ faArrowLeftLong } fixedWidth />
            Back
            </button>
          </div>
        </div>
    </div>

    {/* Error Pages Footer */}
    <div className="flex flex-col gap-y-10 bg-[#fffff] px-10 lg:px-36 pt-5 pb-5 border-t-2 ">
      <div className="flex flex-col gap-y-5 ">
        <div className="flex flex-col gap-y-2.5 lg:gap-y-0 lg:flex-row items-center justify-between text-xs text-[#2D2D2D]">
          <span>Veltech © 2022</span>
          <Link to="" onClick={ () => window.scrollTo(0, 0) }>Need Help? Email us veltech@help.com</Link>
        </div>
      </div>
    </div>
    {/* End Error Pages Footer */}
  </>
  )
}

export default PageForbidden