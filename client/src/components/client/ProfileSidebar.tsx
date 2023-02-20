import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { useFetchAuthenticatedQuery } from "../../features/api/user"
import { useEffect, useState } from "react"
import { User } from "../../types"

import LoadingScreen from "../../pages/misc/LoadingScreen"
import PageError from "../../pages/misc/PageError"


function ProfileSidebar(){
    const {isLoading,isError,data: userDetails} = useFetchAuthenticatedQuery()

    const [fetchedData,setFetchedData] = useState<User>();

    useEffect(() => {
        if(userDetails){
          setFetchedData(userDetails)
        }
      },[userDetails])
    
    return(
      isLoading ? <LoadingScreen/> :
      isError ? <PageError /> :
        <div>
            <div className="flex items-center gap-x-10 gap-y-5">
                <div className="flex items-center gap-x-4">
                    <img className="w-[100px] h-[100px] rounded-full ring-[5px] ring-gray-300" src={fetchedData?.image ? `${process.env.REACT_APP_API_URL}/uploads/${fetchedData.image}` : `${process.env.REACT_APP_API_URL}/assets/user-profile-placeholder.jpg`} alt={fetchedData?.firstName} />
                </div>
                <div className="flex flex-col text-accent">
                    <span className="font-grandview-bold">@{fetchedData?.username}</span>
                    <NavLink to="/account/edit" className="flex items-center gap-x-2 ">
                        <FontAwesomeIcon className="text-accent hover:text-primary" icon={faPencil} fixedWidth />
                        <p className="text-accent hover:text-primary">Edit Profile</p>
                    </NavLink>
                </div>
            </div>
            <div className="flex flex-col mt-5 pl-0 lg:pl-36 text-accent ">
                <NavLink to="" className="font-grandview-bold block py-2 w-full cursor-pointer hover:text-primary  focus:text-primary">
                    <span>User Account</span>
                </NavLink>
                <NavLink to="/account" className={ ({ isActive }) => `block py-2 w-full pl-10 cursor-pointer hover:text-primary  focus:text-primary ${ isActive ? 'text-primary' : undefined }` }>
                    <span>Profile</span>
                </NavLink>
                <NavLink to="/account/change-password" className="block py-2 w-full pl-10 cursor-pointer hover:text-primary  focus:text-primary">
                    <span>Change Password</span>
                </NavLink>
                <NavLink to="/notification" className={ ({ isActive }) => `px-3 font-grandview-bold block py-2 w-full cursor-pointer hover:text-primary focus:text-primary ${ isActive ? 'border-l-4 border-l-[#0B2653]' : undefined }` }>
                    <span>Notifications</span>
                </NavLink>
                <NavLink to="/my-quotations" className={ ({ isActive }) => `px-3 font-grandview-bold block py-2 w-full cursor-pointer hover:text-primary focus:text-primary ${ isActive ? 'border-l-4 border-l-[#0B2653]' : undefined }` }>
                    <span>Quotation</span>
                </NavLink>
                <NavLink to="/my-projects" className={ ({ isActive }) => `px-3 font-grandview-bold block py-2 w-full cursor-pointer hover:text-primary focus:text-primary ${ isActive ? 'border-l-4 border-l-[#0B2653]' : undefined }` }>
                    <span>Projects</span>
                </NavLink>
            </div>
        </div>
    )
}

export default ProfileSidebar