import { faRightFromBracket, faTableCells, faUsers, faFileCirclePlus, faArchive, faGear, faInfoCircle, faMoneyBill, faUserCog, faQuestion } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { baseApi } from "../../features/api/_base"
import { useDeauthenticateUserMutation } from "../../features/api/user"
import { deauthenticateUser as deauthenticateUserRedux } from "../../features/auth/auth"
import SidebarButton from "./SidebarButton"
import SidebarLink from "./SidebarLink"
import VeltechLogo from "../../assets/Veltech-Logo-Plain-Colored.png";
import { useState } from "react"
import SidebarDropdownToggler from "./SidebarDropdownToggler"
import SidebarDropdown from "./SidebarDropdown"

interface Props{
  isToggled? : boolean
  setToggled : any
}

const Sidebar = ({isToggled,setToggled}: Props) => {
  const [websiteIsToggled,setWebsiteIsToggled] = useState(false)
  const [accountingisToggled,setAccountingisToggled] = useState(false)

  const dispatch = useDispatch()

  const [deauthenticateUserMutation] = useDeauthenticateUserMutation()

  const handleLogOut = async () => {
    baseApi.util.resetApiState()
    await deauthenticateUserMutation()
    dispatch(deauthenticateUserRedux({}))
  }

  return (
    <aside className="fixed flex flex-col gap-y-5 z-50 bg-[#F6F8FA] w-[300px] h-screen p-3">
      <header className="flex gap-x-3 justify-center items-center">
        <img className="w-[40px] h-[40px]" src={VeltechLogo} alt="Veltech Logo" />
        <h1 className="text-2xl text-primary font-bold self-center">ADMIN PORTAL</h1>
      </header>
      <hr className="border-1 border-primary"></hr>
      <div className="flex flex-col gap-y-3">
        <SidebarLink
          text="Dashboard"
          icon={ faTableCells }
          path="/admin/dashboard"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarLink
          text="Quotations"
          icon={ faFileCirclePlus }
          path="/admin/quotation"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarLink
          text="Projects"
          icon={ faArchive }
          path="/admin/project"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarLink
          text="Clients"
          icon={ faUsers }
          path="/admin/clients"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

         <SidebarLink
          text="Inquiries"
          icon={ faQuestion }
          path="/admin/inquiries"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarDropdownToggler
          sidebar={{
            isToggled: isToggled,
            setToggled: setToggled,
          }}
          isToggled={accountingisToggled}
          setToggled={setAccountingisToggled}
          icon={faMoneyBill}
          label="Accounting"
        />

        <SidebarDropdown
          isDropped={accountingisToggled}
          sidebarIsInflated={isToggled}
          routes={[
            {
              path: "/admin/accounting/suppliers",
              label: "Suppliers",
            },
            {
              path: "/admin/accounting/purchase-orders",
              label: "Purchase Orders",
            },
            {
              path: "/admin/accounting/payments",
              label: "Payments",
            }
          ]}
        />

        <SidebarLink
          text="User Management"
          icon={ faUserCog }
          path= "/admin/management/users"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarDropdownToggler
          sidebar={{
            isToggled: isToggled,
            setToggled: setToggled,
          }}
          isToggled={websiteIsToggled}
          setToggled={setWebsiteIsToggled}
          icon={faGear}
          label="Website Management"
        />

        <SidebarDropdown
          isDropped={websiteIsToggled}
          sidebarIsInflated={isToggled}
          routes={[
            {
              path: "/admin/management/application-settings",
              label: "Application Settings",
            },
            {
              path: "/admin/management/carousel",
              label: "Carousel",
            }
          ]}
        />

        <SidebarLink
          text="Activity Logs"
          icon={ faInfoCircle }
          path="/admin/activity-logs"
          textColorClass="text-gray-600"
          activeTextColorClass="!text-primary"
          activeBackgroundColorClass="bg-white"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
        />

        <SidebarButton
          text="Log Out"
          icon={ faRightFromBracket }
          textColorClass="text-gray-600"
          hoverTextColorClass="hover:text-primary"
          hoverBackgroundColorClass="hover:bg-white"
          onClick={ handleLogOut }
        />
      </div>
    </aside>
  )
}

export default Sidebar