import { Outlet } from "react-router-dom"
import Navbar from "../accounting/Navbar"
import Footer from "../accounting/Footer"

interface Props {
  hasNavbar?: boolean
}

function AccountingLayout({ hasNavbar }: Props) {
  return (
    <div className="flex flex-col justify-between items-start w-full min-h-screen">
      {
          hasNavbar && (
              <Navbar />
          )
      }
      
      <Outlet />

      <Footer />
    </div>
  )
}

export default AccountingLayout