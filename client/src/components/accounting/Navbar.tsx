import { useDispatch } from "react-redux"
import { faUserTie, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { baseApi } from "../../features/api/_base"
import { useDeauthenticateUserMutation } from "../../features/api/user"
import { deauthenticateUser as deauthenticateUserRedux } from "../../features/auth/auth"
import { useCreateActivityMutation } from "../../features/api/activity.log"
import { selectUser } from "../../features/auth/auth"
import { useSelector } from "react-redux"
import { camelCase, startCase } from "lodash"

function Navbar() {
   const [createActivityMutation] = useCreateActivityMutation()

   const auth = useSelector(selectUser)

   const dispatch = useDispatch()

   const [deauthenticateUserMutation] = useDeauthenticateUserMutation()

   const handleLogOut = async () => {
      baseApi.util.resetApiState()
      await deauthenticateUserMutation()
      dispatch(deauthenticateUserRedux({}))

      createActivityMutation({
         userRole: auth.type,
         entry: "logout",
         module: `${ auth.username }-logged-out`,
         category: "AUTH",
         status: "SUCCEEDED"
      })
   }

   return (
      <nav className="sticky top-0 flex flex-row justify-between items-center bg-white shadow-[0_5px_5px_-5px_#0000003F] w-full z-[1000] px-5 py-2.5">
         <div className="flex flex-row justify-start items-center gap-x-5">
            <img className="object-contain w-[50px] h-[50px]" src={ `${ process.env.PUBLIC_URL }/assets/logo_colored.png` } alt="Veltech Logo Brand" />

            <h1 className="text-3xl text-primary font-grandview-bold uppercase">accounting portal</h1>
         </div>

         <div className="flex flex-row justify-end items-center gap-x-7">
            <button type="button" onClick={ handleLogOut }>
               <FontAwesomeIcon className="text-3xl" icon={ faRightFromBracket } fixedWidth />
            </button>

            <div className="bg-black h-[40px] w-[1.5px]" />

            <div className="flex flex-row justify-end items-center gap-x-3">
               <div className="flex flex-col justify-start items-end">
                  <span className="text-lg font-grandview-bold">{ `${ startCase(camelCase(auth.firstName)) } ${ startCase(camelCase(auth.lastName)) }` }</span>
                  
                  <span className="text-xs">{ startCase(camelCase(auth.type)) }</span>
               </div>

               <FontAwesomeIcon className="text-4xl" icon={ faUserTie } fixedWidth />
            </div>
         </div>
      </nav> 
   )
}

export default Navbar