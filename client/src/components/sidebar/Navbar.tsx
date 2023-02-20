import { useSelector } from "react-redux"
import { startCase, camelCase } from "lodash"
import { selectUser } from "../../features/auth/auth"

const Navbar = () => {
  const user = useSelector(selectUser)

  return (
    <nav className="fixed flex items-center bg-white shadow-[0_5px_3px_-3px_#00000020] z-30 w-full h-[60px] px-10">
      <div className="flex flex-col ml-auto border-l-2 border-black px-5">
        <span className="text-[1rem] lg:text-sm text-end select-none tracking-wide">{ user?.username }</span>
        <span className="text-[0.75rem] lg:text-xs text-end select-none tracking-wide">{ startCase(camelCase(user?.type)) }</span>
      </div>

      <div className="overflow-hidden rounded-full w-[40px] h-[40px]">
        <img className="w-full h-full" src={ user?.image ? `${process.env.REACT_APP_API_URL}/uploads/${user.image}` : `${process.env.REACT_APP_API_URL}/assets/user-profile-placeholder.jpg` } alt=""/>
      </div>
    </nav>
  )
}

export default Navbar